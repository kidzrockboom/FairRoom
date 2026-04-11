use axum::{
    Json,
    extract::{Query, State},
    http::StatusCode,
};
use chrono::Utc;
use sea_orm::{
    ColumnTrait, DatabaseConnection, EntityTrait, PaginatorTrait, QueryFilter, QueryOrder,
    QuerySelect,
};
use std::collections::HashMap;
use uuid::Uuid;

use crate::entity::*;
use crate::routes::helper::{status_to_str, user_to_response};
use crate::routes::models::*;

const DEFAULT_PAGE_SIZE: u64 = 20;
pub const SUSPENSION_THRESHOLD: i64 = 3;

fn derive_account_state(active_strikes: i64) -> &'static str {
    if active_strikes >= 3 {
        "restricted"
    } else if active_strikes == 2 {
        "warned"
    } else {
        "good"
    }
}

pub async fn get_me(
    State(db): State<DatabaseConnection>,
    auth: AuthUser,
) -> ApiResult<Json<UserResponse>> {
    let user = user::Entity::find_by_id(auth.user_id)
        .one(&db)
        .await
        .map_err(internal_error)?
        .ok_or_else(|| {
            api_error(
                StatusCode::NOT_FOUND,
                "USER_NOT_FOUND",
                "User not found.",
                None,
            )
        })?;

    Ok(Json(user_to_response(&user)))
}

pub async fn get_account_status(
    State(db): State<DatabaseConnection>,
    auth: AuthUser,
) -> ApiResult<Json<AccountStatusResponse>> {
    // Derive active strikes from the strike table (where revokedAt IS NULL)
    // rather than using the denormalised counter on the user row.
    let active_strikes = strike::Entity::find()
        .filter(strike::Column::UserId.eq(auth.user_id))
        .filter(strike::Column::RevokedAt.is_null())
        .count(&db)
        .await
        .map_err(internal_error)? as i64;

    let account_state = derive_account_state(active_strikes).to_string();
    let booking_eligible = active_strikes < SUSPENSION_THRESHOLD;

    Ok(Json(AccountStatusResponse {
        active_strikes,
        booking_eligible,
        account_state,
    }))
}

pub async fn get_account_activities(
    State(db): State<DatabaseConnection>,
    auth: AuthUser,
) -> ApiResult<Json<AccountActivitiesResponse>> {
    // Fetch user's bookings with room info
    let bookings = booking::Entity::find()
        .filter(booking::Column::UserId.eq(auth.user_id))
        .all(&db)
        .await
        .map_err(internal_error)?;

    let room_ids: Vec<Uuid> = bookings.iter().map(|b| b.room_id).collect();
    let rooms: std::collections::HashMap<Uuid, room::Model> = room::Entity::find()
        .filter(room::Column::Id.is_in(room_ids))
        .all(&db)
        .await
        .map_err(internal_error)?
        .into_iter()
        .map(|r| (r.id, r))
        .collect();

    // Fetch user's strikes
    let strikes = strike::Entity::find()
        .filter(strike::Column::UserId.eq(auth.user_id))
        .all(&db)
        .await
        .map_err(internal_error)?;

    let mut items: Vec<AccountActivityItem> = Vec::new();

    for b in &bookings {
        let room_code = rooms
            .get(&b.room_id)
            .map(|r| r.room_code.as_str())
            .unwrap_or("Unknown");
        let starts = b.starts_at.and_utc().format("%Y-%m-%d %H:%M").to_string();
        let ends = b.ends_at.and_utc().format("%H:%M").to_string();

        let (activity_type, title, description, status) = match status_to_str(&b.status) {
            "cancelled" => (
                "booking_cancelled",
                "Booking cancelled",
                format!(
                    "Room {} booking for {} to {} was cancelled.",
                    room_code, starts, ends
                ),
                "cancelled",
            ),
            "no_show" => (
                "booking_no_show",
                "No-show recorded",
                format!("You did not check in for room {} on {}.", room_code, starts),
                "incident",
            ),
            "completed" => (
                "booking_completed",
                "Booking completed",
                format!("Room {} booked for {} to {}.", room_code, starts, ends),
                "completed",
            ),
            _ => (
                "booking_created",
                "Booking confirmed",
                format!("Room {} booked for {} to {}.", room_code, starts, ends),
                "completed",
            ),
        };

        items.push(AccountActivityItem {
            id: b.id.to_string(),
            activity_type: activity_type.to_string(),
            title: title.to_string(),
            description,
            occurred_at: b.created_at.and_utc().to_rfc3339(),
            status: status.to_string(),
            source_entity_type: "booking".to_string(),
            source_entity_id: b.id.to_string(),
        });
    }

    for s in &strikes {
        items.push(AccountActivityItem {
            id: s.id.to_string(),
            activity_type: "strike_recorded".to_string(),
            title: "Strike recorded".to_string(),
            description: s.reason.clone(),
            occurred_at: s.created_at.and_utc().to_rfc3339(),
            status: "incident".to_string(),
            source_entity_type: "strike".to_string(),
            source_entity_id: s.id.to_string(),
        });
    }

    // Sort by occurredAt descending (most recent first)
    items.sort_by(|a, b| b.occurred_at.cmp(&a.occurred_at));

    Ok(Json(AccountActivitiesResponse { items }))
}

pub async fn get_my_bookings(
    State(db): State<DatabaseConnection>,
    auth: AuthUser,
    Query(params): Query<MyBookingQuery>,
) -> ApiResult<Json<BookingListResponse>> {
    let page_num = params.page.unwrap_or(1).max(1);
    let page_size = params.page_size.unwrap_or(DEFAULT_PAGE_SIZE);
    let now = Utc::now().naive_utc();

    let mut query = booking::Entity::find().filter(booking::Column::UserId.eq(auth.user_id));

    match params.scope.as_deref().unwrap_or("all") {
        "active" => {
            query = query
                .filter(
                    booking::Column::Status
                        .eq(crate::entity::sea_orm_active_enums::StatusEnum::Active),
                )
                .filter(booking::Column::EndsAt.gt(now))
        }
        "past" => query = query.filter(booking::Column::EndsAt.lte(now)),
        _ => {}
    }

    let paginator = query
        .order_by_desc(booking::Column::StartsAt)
        .paginate(&db, page_size);

    let total = paginator.num_items().await.map_err(internal_error)?;
    let bookings = paginator
        .fetch_page(page_num - 1)
        .await
        .map_err(internal_error)?;

    // Batch-fetch rooms so we can embed roomCode + roomName
    let room_ids: Vec<Uuid> = bookings.iter().map(|b| b.room_id).collect();
    let rooms: HashMap<Uuid, room::Model> = room::Entity::find()
        .filter(room::Column::Id.is_in(room_ids))
        .all(&db)
        .await
        .map_err(internal_error)?
        .into_iter()
        .map(|r| (r.id, r))
        .collect();

    let items = bookings
        .into_iter()
        .filter_map(|b| {
            let room = rooms.get(&b.room_id)?;
            Some(BookingResponse {
                id: b.id.to_string(),
                room_id: b.room_id.to_string(),
                room_code: room.room_code.clone(),
                room_name: room.room_name.clone(),
                starts_at: b.starts_at.and_utc().to_rfc3339(),
                ends_at: b.ends_at.and_utc().to_rfc3339(),
                status: status_to_str(&b.status).to_string(),
                checked_in: b.checked_in,
                created_at: b.created_at.and_utc().to_rfc3339(),
                updated_at: b.updated_at.and_utc().to_rfc3339(),
            })
        })
        .collect();

    Ok(Json(BookingListResponse {
        items,
        page: page_num,
        page_size,
        total,
    }))
}

pub async fn get_my_reminders(
    State(db): State<DatabaseConnection>,
    auth: AuthUser,
    Query(params): Query<ReminderQuery>,
) -> ApiResult<Json<Vec<reminder::Model>>> {
    let limit = params.page_size.unwrap_or(DEFAULT_PAGE_SIZE);

    let booking_ids: Vec<Uuid> = booking::Entity::find()
        .filter(booking::Column::UserId.eq(auth.user_id))
        .all(&db)
        .await
        .map_err(internal_error)?
        .into_iter()
        .map(|b| b.id)
        .collect();

    if let Some(specific_booking_id) = params.booking_id {
        if !booking_ids.contains(&specific_booking_id) {
            return Ok(Json(vec![]));
        }
    }

    let mut query = reminder::Entity::find().filter(reminder::Column::BookingId.is_in(booking_ids));

    if let Some(status) = params.status {
        query = query.filter(reminder::Column::Status.eq(status));
    }
    if let Some(booking_id) = params.booking_id {
        query = query.filter(reminder::Column::BookingId.eq(booking_id));
    }

    let reminders = query
        .order_by_desc(reminder::Column::CreatedAt)
        .limit(limit)
        .all(&db)
        .await
        .map_err(internal_error)?;

    Ok(Json(reminders))
}

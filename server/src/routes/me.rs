use axum::{
    Json,
    extract::{Query, State},
    http::StatusCode,
};
use chrono::Utc;
use sea_orm::{
    ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, QueryOrder, QuerySelect,
    PaginatorTrait,
};

use crate::entity::*;
use crate::routes::helper::user_to_response;
use crate::routes::models::*;

const DEFAULT_PAGE_SIZE: u64 = 20;
/// Users with this many (or more) active strikes are suspended.
pub const SUSPENSION_THRESHOLD: i32 = 3;

pub async fn get_me(
    State(db): State<DatabaseConnection>,
    auth: AuthUser,
) -> Result<Json<UserResponse>, (StatusCode, String)> {
    let user = user::Entity::find_by_id(auth.user_id)
        .one(&db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?
        .ok_or((StatusCode::NOT_FOUND, "User not found".into()))?;

    Ok(Json(user_to_response(&user)))
}

pub async fn get_account_status(
    State(db): State<DatabaseConnection>,
    auth: AuthUser,
) -> Result<Json<AccountStatusResponse>, (StatusCode, String)> {
    let user = user::Entity::find_by_id(auth.user_id)
        .one(&db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?
        .ok_or((StatusCode::NOT_FOUND, "User not found".into()))?;

    let suspended = user.strikes >= SUSPENSION_THRESHOLD;

    Ok(Json(AccountStatusResponse {
        strikes: user.strikes,
        suspended,
        suspension_reason: suspended.then(|| {
            format!(
                "Account suspended: {} strikes (limit is {})",
                user.strikes, SUSPENSION_THRESHOLD
            )
        }),
    }))
}

pub async fn get_account_activities(
    _state: State<DatabaseConnection>,
    _auth: AuthUser,
) -> Json<Vec<String>> {
    // Account activity tracking is not yet implemented in the schema.
    Json(vec![])
}

pub async fn get_my_bookings(
    State(db): State<DatabaseConnection>,
    auth: AuthUser,
    Query(params): Query<MyBookingQuery>,
) -> Result<Json<Vec<booking::Model>>, (StatusCode, String)> {
    // Pages are 1-indexed in the API; SeaORM uses 0-indexed internally.
    let page = params.page.unwrap_or(1).saturating_sub(1);
    let page_size = params.page_size.unwrap_or(DEFAULT_PAGE_SIZE);
    let now = Utc::now().naive_utc();

    let mut query = booking::Entity::find()
        .filter(booking::Column::UserId.eq(auth.user_id));

    match params.scope.as_deref().unwrap_or("all") {
        "active" => query = query.filter(booking::Column::EndsAt.gt(now)),
        "past"   => query = query.filter(booking::Column::EndsAt.lte(now)),
        _        => {} // "all" — no extra filter
    }

    let bookings = query
        .order_by_desc(booking::Column::StartsAt)
        .paginate(&db, page_size)
        .fetch_page(page)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(bookings))
}

pub async fn get_my_reminders(
    State(db): State<DatabaseConnection>,
    auth: AuthUser,
    Query(params): Query<ReminderQuery>,
) -> Result<Json<Vec<reminder::Model>>, (StatusCode, String)> {
    let limit = params.page_size.unwrap_or(DEFAULT_PAGE_SIZE);

    // Collect this user's booking IDs so we can filter reminders by them.
    // (reminder table has no direct user_id column)
    let booking_ids: Vec<uuid::Uuid> = booking::Entity::find()
        .filter(booking::Column::UserId.eq(auth.user_id))
        .all(&db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?
        .into_iter()
        .map(|b| b.id)
        .collect();

    if let Some(specific_booking_id) = params.booking_id {
        if !booking_ids.contains(&specific_booking_id) {
            return Ok(Json(vec![]));
        }
    }

    let mut query = reminder::Entity::find()
        .filter(reminder::Column::BookingId.is_in(booking_ids));

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
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(reminders))
}

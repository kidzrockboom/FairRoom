use axum::{
    Json,
    extract::{Path, Query, State},
    http::StatusCode,
};
use chrono::Utc;
use sea_orm::{
    ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, ExprTrait, PaginatorTrait,
    QueryFilter, QueryOrder, Set,
};
use uuid::Uuid;

use crate::entity::sea_orm_active_enums::StatusEnum;
use crate::entity::*;
use crate::routes::models::*;

// ── Guard ─────────────────────────────────────────────────────────────────────

fn require_admin(auth: &AuthUser) -> Result<(), (StatusCode, String)> {
    if auth.role != "admin" {
        Err((StatusCode::FORBIDDEN, "Admin access required".into()))
    } else {
        Ok(())
    }
}

const DEFAULT_PAGE_SIZE: u64 = 20;

// ── Admin bookings ─────────────────────────────────────────────────────────────

pub async fn admin_get_bookings(
    State(db): State<DatabaseConnection>,
    auth: AuthUser,
    Query(params): Query<AdminBookingQuery>,
) -> Result<Json<Vec<booking::Model>>, (StatusCode, String)> {
    require_admin(&auth)?;

    let page = params.page.unwrap_or(1).saturating_sub(1);
    let page_size = params.page_size.unwrap_or(DEFAULT_PAGE_SIZE);

    let mut query = booking::Entity::find();

    if let Some(user_id) = params.user_id {
        query = query.filter(booking::Column::UserId.eq(user_id));
    }
    if let Some(room_id) = params.room_id {
        query = query.filter(booking::Column::RoomId.eq(room_id));
    }
    if let Some(starts_at) = params.starts_at {
        query = query.filter(booking::Column::StartsAt.gte(starts_at));
    }
    if let Some(ends_at) = params.ends_at {
        query = query.filter(booking::Column::EndsAt.lte(ends_at));
    }
    if let Some(status_str) = params.status {
        let status = match status_str.as_str() {
            "active"    => StatusEnum::Active,
            "cancelled" => StatusEnum::Cancelled,
            "completed" => StatusEnum::Completed,
            "no_show"   => StatusEnum::NoShow,
            _ => return Err((StatusCode::BAD_REQUEST, "Invalid status value".into())),
        };
        query = query.filter(booking::Column::Status.eq(status));
    }

    let bookings = query
        .order_by_desc(booking::Column::CreatedAt)
        .paginate(&db, page_size)
        .fetch_page(page)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(bookings))
}

pub async fn admin_get_booking(
    State(db): State<DatabaseConnection>,
    auth: AuthUser,
    Path(booking_id): Path<Uuid>,
) -> Result<Json<booking::Model>, (StatusCode, String)> {
    require_admin(&auth)?;

    let booking = booking::Entity::find_by_id(booking_id)
        .one(&db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?
        .ok_or((StatusCode::NOT_FOUND, "Booking not found".into()))?;

    Ok(Json(booking))
}

// ── Admin users & strikes ──────────────────────────────────────────────────────

pub async fn admin_get_users(
    State(db): State<DatabaseConnection>,
    auth: AuthUser,
    Query(params): Query<AdminUserQuery>,
) -> Result<Json<Vec<user::Model>>, (StatusCode, String)> {
    require_admin(&auth)?;

    let mut query = user::Entity::find();

    if let Some(ref search) = params.search {
        query = query.filter(
            user::Column::FullName
                .contains(search)
                .or(user::Column::Email.contains(search)),
        );
    }

    let users = query
        .order_by_asc(user::Column::FullName)
        .all(&db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(users))
}

pub async fn admin_get_user_strikes(
    State(db): State<DatabaseConnection>,
    auth: AuthUser,
    Path(user_id): Path<Uuid>,
) -> Result<Json<Vec<strike::Model>>, (StatusCode, String)> {
    require_admin(&auth)?;

    let strikes = strike::Entity::find()
        .filter(strike::Column::UserId.eq(user_id))
        .order_by_desc(strike::Column::CreatedAt)
        .all(&db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(strikes))
}

pub async fn admin_create_strike(
    State(db): State<DatabaseConnection>,
    auth: AuthUser,
    Json(payload): Json<CreateStrikeRequest>,
) -> Result<Json<strike::Model>, (StatusCode, String)> {
    require_admin(&auth)?;

    if payload.reason.trim().is_empty() {
        return Err((StatusCode::BAD_REQUEST, "reason is required".into()));
    }

    // Verify target user exists and grab current strike count
    let user = user::Entity::find_by_id(payload.user_id)
        .one(&db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?
        .ok_or((StatusCode::NOT_FOUND, "User not found".into()))?;

    let new_strikes = user.strikes + 1;

    // epoch sentinel = "not yet revoked"
    let not_revoked = chrono::NaiveDateTime::UNIX_EPOCH;

    // Insert strike record
    let new_strike = strike::ActiveModel {
        id: Set(Uuid::new_v4()),
        user_id: Set(payload.user_id),
        given_by: Set(auth.user_id),
        reason: Set(payload.reason),
        revoked_at: Set(not_revoked),
        created_at: Set(Utc::now().naive_utc()),
        ..Default::default()
    };

    let strike = new_strike
        .insert(&db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    // Increment the denormalised counter on the user row
    let mut active_user: user::ActiveModel = user.into();
    active_user.strikes = Set(new_strikes);
    active_user
        .update(&db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(strike))
}

pub async fn admin_revoke_strike(
    State(db): State<DatabaseConnection>,
    auth: AuthUser,
    Path(strike_id): Path<Uuid>,
    Json(_payload): Json<RevokeStrikeRequest>,
) -> Result<Json<strike::Model>, (StatusCode, String)> {
    require_admin(&auth)?;

    let strike = strike::Entity::find_by_id(strike_id)
        .one(&db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?
        .ok_or((StatusCode::NOT_FOUND, "Strike not found".into()))?;

    let not_revoked = chrono::NaiveDateTime::UNIX_EPOCH;
    if strike.revoked_at != not_revoked {
        return Err((StatusCode::BAD_REQUEST, "Strike is already revoked".into()));
    }

    let user_id = strike.user_id;

    // Mark as revoked by setting revoked_at to now
    let mut active: strike::ActiveModel = strike.into();
    active.revoked_at = Set(Utc::now().naive_utc());
    let updated = active
        .update(&db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    // Decrement denormalised counter, floored at 0
    let user = user::Entity::find_by_id(user_id)
        .one(&db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?
        .ok_or((StatusCode::NOT_FOUND, "User not found".into()))?;

    let current_strikes = user.strikes;
    let mut active_user: user::ActiveModel = user.into();
    active_user.strikes = Set(Ord::max(current_strikes - 1, 0));
    active_user
        .update(&db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(updated))
}

// ── Admin rooms ────────────────────────────────────────────────────────────────

pub async fn admin_get_rooms(
    State(db): State<DatabaseConnection>,
    auth: AuthUser,
    Query(params): Query<AdminRoomQuery>,
) -> Result<Json<Vec<room::Model>>, (StatusCode, String)> {
    require_admin(&auth)?;

    let mut query = room::Entity::find();

    if let Some(status) = params.status {
        query = query.filter(room::Column::IsActive.eq(status == "active"));
    }

    let rooms = query
        .order_by_asc(room::Column::RoomName)
        .all(&db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(rooms))
}

pub async fn admin_create_room(
    State(db): State<DatabaseConnection>,
    auth: AuthUser,
    Json(payload): Json<CreateRoomRequest>,
) -> Result<Json<room::Model>, (StatusCode, String)> {
    require_admin(&auth)?;

    if payload.room_code.trim().is_empty() || payload.name.trim().is_empty() {
        return Err((
            StatusCode::BAD_REQUEST,
            "roomCode and name are required".into(),
        ));
    }
    if payload.capacity < 1 {
        return Err((
            StatusCode::BAD_REQUEST,
            "capacity must be at least 1".into(),
        ));
    }

    let now = Utc::now().naive_utc();
    let new_room = room::ActiveModel {
        id: Set(Uuid::new_v4()),
        room_code: Set(payload.room_code),
        room_name: Set(payload.name),
        location: Set(payload.location),
        capacity: Set(payload.capacity),
        is_active: Set(payload.status == "active"),
        usage_notes: Set(payload.usage_notes.unwrap_or_default()),
        created_at: Set(now),
        ..Default::default()
    };

    let room = new_room
        .insert(&db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(room))
}

pub async fn admin_update_room(
    State(db): State<DatabaseConnection>,
    auth: AuthUser,
    Path(room_id): Path<Uuid>,
    Json(payload): Json<UpdateRoomRequest>,
) -> Result<Json<room::Model>, (StatusCode, String)> {
    require_admin(&auth)?;

    let room = room::Entity::find_by_id(room_id)
        .one(&db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?
        .ok_or((StatusCode::NOT_FOUND, "Room not found".into()))?;

    let mut active: room::ActiveModel = room.into();

    if let Some(room_code) = payload.room_code {
        active.room_code = Set(room_code);
    }
    if let Some(name) = payload.name {
        active.room_name = Set(name);
    }
    if let Some(location) = payload.location {
        active.location = Set(location);
    }
    if let Some(capacity) = payload.capacity {
        if capacity < 1 {
            return Err((
                StatusCode::BAD_REQUEST,
                "capacity must be at least 1".into(),
            ));
        }
        active.capacity = Set(capacity);
    }
    if let Some(status) = payload.status {
        active.is_active = Set(status == "active");
    }
    if let Some(usage_notes) = payload.usage_notes {
        active.usage_notes = Set(usage_notes);
    }

    let updated = active
        .update(&db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(updated))
}

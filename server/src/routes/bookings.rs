use axum::{
    Json,
    extract::{Path, State},
    http::StatusCode,
};
use chrono::Utc;
use sea_orm::{ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, Set};
use sea_orm::ExprTrait;
use uuid::Uuid;

use crate::entity::sea_orm_active_enums::StatusEnum;
use crate::entity::*;
use crate::routes::me::SUSPENSION_THRESHOLD;
use crate::routes::models::*;

pub async fn create_booking(
    State(db): State<DatabaseConnection>,
    auth: AuthUser,
    Json(payload): Json<CreateBookingRequest>,
) -> Result<Json<booking::Model>, (StatusCode, String)> {
    // ── Validation ────────────────────────────────────────────────────────────
    if payload.starts_at >= payload.ends_at {
        return Err((StatusCode::BAD_REQUEST, "startsAt must be before endsAt".into()));
    }
    if payload.purpose.trim().is_empty() {
        return Err((StatusCode::BAD_REQUEST, "purpose is required".into()));
    }
    if payload.expected_attendees < 1 {
        return Err((StatusCode::BAD_REQUEST, "expectedAttendees must be at least 1".into()));
    }

    // ── Account-status check ──────────────────────────────────────────────────
    let user = user::Entity::find_by_id(auth.user_id)
        .one(&db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?
        .ok_or((StatusCode::NOT_FOUND, "User not found".into()))?;

    if user.strikes >= SUSPENSION_THRESHOLD {
        return Err((
            StatusCode::FORBIDDEN,
            format!(
                "Account suspended ({} strikes). Bookings are disabled.",
                user.strikes
            ),
        ));
    }

    // ── Room check ────────────────────────────────────────────────────────────
    let room = room::Entity::find_by_id(payload.room_id)
        .one(&db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?
        .ok_or((StatusCode::NOT_FOUND, "Room not found".into()))?;

    if !room.is_active {
        return Err((StatusCode::BAD_REQUEST, "Room is not active".into()));
    }
    if payload.expected_attendees > room.capacity {
        return Err((
            StatusCode::BAD_REQUEST,
            format!(
                "Expected attendees ({}) exceed room capacity ({})",
                payload.expected_attendees, room.capacity
            ),
        ));
    }

    // ── Conflict check ────────────────────────────────────────────────────────
    let overlap = booking::Entity::find()
        .filter(booking::Column::RoomId.eq(payload.room_id))
        .filter(booking::Column::Status.eq(StatusEnum::Active))
        .filter(
            booking::Column::EndsAt
                .gt(payload.starts_at)
                .and(booking::Column::StartsAt.lt(payload.ends_at)),
        )
        .one(&db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    if overlap.is_some() {
        return Err((StatusCode::CONFLICT, "This time slot is already booked".into()));
    }

    // ── Create ────────────────────────────────────────────────────────────────
    let now = Utc::now().naive_utc();
    let new_booking = booking::ActiveModel {
        id: Set(Uuid::new_v4()),
        user_id: Set(auth.user_id),
        room_id: Set(payload.room_id),
        starts_at: Set(payload.starts_at),
        ends_at: Set(payload.ends_at),
        status: Set(StatusEnum::Active),
        checked_in: Set(false),
        created_at: Set(now),
        updated_at: Set(now),
        ..Default::default()
    };

    let booking = new_booking
        .insert(&db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(booking))
}

pub async fn get_booking(
    State(db): State<DatabaseConnection>,
    auth: AuthUser,
    Path(booking_id): Path<Uuid>,
) -> Result<Json<booking::Model>, (StatusCode, String)> {
    let booking = booking::Entity::find_by_id(booking_id)
        .one(&db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?
        .ok_or((StatusCode::NOT_FOUND, "Booking not found".into()))?;

    // Only the owner or an admin may view a booking
    if booking.user_id != auth.user_id && auth.role != "admin" {
        return Err((StatusCode::FORBIDDEN, "Access denied".into()));
    }

    Ok(Json(booking))
}

pub async fn update_booking(
    State(db): State<DatabaseConnection>,
    auth: AuthUser,
    Path(booking_id): Path<Uuid>,
    Json(payload): Json<UpdateBookingRequest>,
) -> Result<Json<booking::Model>, (StatusCode, String)> {
    let booking = booking::Entity::find_by_id(booking_id)
        .one(&db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?
        .ok_or((StatusCode::NOT_FOUND, "Booking not found".into()))?;

    // ── Ownership ─────────────────────────────────────────────────────────────
    if booking.user_id != auth.user_id {
        return Err((StatusCode::FORBIDDEN, "You do not own this booking".into()));
    }

    // ── Deadline: booking must not have started yet ───────────────────────────
    let now = Utc::now().naive_utc();
    if booking.starts_at <= now {
        return Err((StatusCode::BAD_REQUEST, "Cannot edit a booking that has already started".into()));
    }

    let new_starts_at = payload.starts_at.unwrap_or(booking.starts_at);
    let new_ends_at = payload.ends_at.unwrap_or(booking.ends_at);

    if new_starts_at >= new_ends_at {
        return Err((StatusCode::BAD_REQUEST, "startsAt must be before endsAt".into()));
    }

    // ── Conflict check (exclude this booking itself) ──────────────────────────
    let overlap = booking::Entity::find()
        .filter(booking::Column::RoomId.eq(booking.room_id))
        .filter(booking::Column::Id.ne(booking_id))
        .filter(booking::Column::Status.eq(StatusEnum::Active))
        .filter(
            booking::Column::EndsAt
                .gt(new_starts_at)
                .and(booking::Column::StartsAt.lt(new_ends_at)),
        )
        .one(&db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    if overlap.is_some() {
        return Err((StatusCode::CONFLICT, "New time slot conflicts with an existing booking".into()));
    }

    let mut active: booking::ActiveModel = booking.into();
    active.starts_at = Set(new_starts_at);
    active.ends_at = Set(new_ends_at);
    active.updated_at = Set(now);

    let updated = active
        .update(&db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(updated))
}

pub async fn cancel_booking(
    State(db): State<DatabaseConnection>,
    auth: AuthUser,
    Path(booking_id): Path<Uuid>,
    Json(_payload): Json<CancelBookingRequest>,
) -> Result<Json<booking::Model>, (StatusCode, String)> {
    let booking = booking::Entity::find_by_id(booking_id)
        .one(&db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?
        .ok_or((StatusCode::NOT_FOUND, "Booking not found".into()))?;

    // ── Ownership ─────────────────────────────────────────────────────────────
    if booking.user_id != auth.user_id {
        return Err((StatusCode::FORBIDDEN, "You do not own this booking".into()));
    }

    // ── Deadline ──────────────────────────────────────────────────────────────
    let now = Utc::now().naive_utc();
    if booking.starts_at <= now {
        return Err((StatusCode::BAD_REQUEST, "Cannot cancel a booking that has already started".into()));
    }

    if booking.status != StatusEnum::Active {
        return Err((StatusCode::BAD_REQUEST, "Only active bookings can be cancelled".into()));
    }

    let mut active: booking::ActiveModel = booking.into();
    active.status = Set(StatusEnum::Cancelled);
    active.updated_at = Set(now);

    let updated = active
        .update(&db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(updated))
}

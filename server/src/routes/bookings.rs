use axum::{
    Json,
    extract::{Path, State},
    http::StatusCode,
};
use chrono::Utc;
use sea_orm::{
    ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, ExprTrait, PaginatorTrait,
    QueryFilter, Set,
};
use uuid::Uuid;

use crate::entity::sea_orm_active_enums::StatusEnum;
use crate::entity::*;
use crate::routes::helper::status_to_str;
use crate::routes::me::SUSPENSION_THRESHOLD;
use crate::routes::models::*;

fn booking_response(b: &booking::Model, room: &room::Model) -> BookingResponse {
    BookingResponse {
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
    }
}

pub async fn create_booking(
    State(db): State<DatabaseConnection>,
    auth: AuthUser,
    Json(payload): Json<CreateBookingRequest>,
) -> ApiResult<(StatusCode, Json<BookingResponse>)> {
    // ── Validation ────────────────────────────────────────────────────────────
    if payload.starts_at >= payload.ends_at {
        return Err(api_error(
            StatusCode::BAD_REQUEST,
            "VALIDATION_ERROR",
            "Request validation failed.",
            Some(
                serde_json::json!({ "field": "endsAt", "reason": "endsAt must be later than startsAt" }),
            ),
        ));
    }
    if payload.purpose.trim().is_empty() {
        return Err(api_error(
            StatusCode::BAD_REQUEST,
            "VALIDATION_ERROR",
            "Request validation failed.",
            Some(serde_json::json!({ "field": "purpose", "reason": "purpose is required" })),
        ));
    }
    if payload.expected_attendees < 1 {
        return Err(api_error(
            StatusCode::BAD_REQUEST,
            "VALIDATION_ERROR",
            "Request validation failed.",
            Some(
                serde_json::json!({ "field": "expectedAttendees", "reason": "expectedAttendees must be at least 1" }),
            ),
        ));
    }

    // ── Account-status check ──────────────────────────────────────────────────
    let active_strikes = strike::Entity::find()
        .filter(strike::Column::UserId.eq(auth.user_id))
        .filter(strike::Column::RevokedAt.is_null())
        .count(&db)
        .await
        .map_err(internal_error)? as i64;

    if active_strikes >= SUSPENSION_THRESHOLD {
        let account_state = if active_strikes >= 3 {
            "restricted"
        } else {
            "warned"
        };
        return Err(api_error(
            StatusCode::FORBIDDEN,
            "BOOKING_RESTRICTED",
            "You cannot create a new booking because your account is restricted.",
            Some(
                serde_json::json!({ "activeStrikes": active_strikes, "accountState": account_state }),
            ),
        ));
    }

    // ── Room check ────────────────────────────────────────────────────────────
    let room = room::Entity::find_by_id(payload.room_id)
        .one(&db)
        .await
        .map_err(internal_error)?
        .ok_or_else(|| {
            api_error(
                StatusCode::NOT_FOUND,
                "ROOM_NOT_FOUND",
                "The requested room could not be found.",
                None,
            )
        })?;

    if room.status != "operational" {
        return Err(api_error(
            StatusCode::BAD_REQUEST,
            "ROOM_UNAVAILABLE",
            "This room is not currently available for booking.",
            None,
        ));
    }
    if payload.expected_attendees > room.capacity {
        return Err(api_error(
            StatusCode::BAD_REQUEST,
            "VALIDATION_ERROR",
            "Request validation failed.",
            Some(serde_json::json!({
                "field": "expectedAttendees",
                "reason": format!("Expected attendees ({}) exceed room capacity ({})", payload.expected_attendees, room.capacity)
            })),
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
        .map_err(internal_error)?;

    if overlap.is_some() {
        return Err(api_error(
            StatusCode::CONFLICT,
            "BOOKING_CONFLICT",
            "The selected time range overlaps an existing active booking.",
            Some(serde_json::json!({
                "roomId": payload.room_id.to_string(),
                "startsAt": payload.starts_at.and_utc().to_rfc3339(),
                "endsAt": payload.ends_at.and_utc().to_rfc3339()
            })),
        ));
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

    let b = new_booking.insert(&db).await.map_err(internal_error)?;
    Ok((StatusCode::CREATED, Json(booking_response(&b, &room))))
}

pub async fn get_booking(
    State(db): State<DatabaseConnection>,
    auth: AuthUser,
    Path(booking_id): Path<Uuid>,
) -> ApiResult<Json<BookingDetailResponse>> {
    let b = booking::Entity::find_by_id(booking_id)
        .one(&db)
        .await
        .map_err(internal_error)?
        .ok_or_else(|| {
            api_error(
                StatusCode::NOT_FOUND,
                "BOOKING_NOT_FOUND",
                "The requested booking could not be found.",
                None,
            )
        })?;

    if b.user_id != auth.user_id && auth.role != "admin" {
        return Err(api_error(
            StatusCode::FORBIDDEN,
            "FORBIDDEN",
            "You do not have permission to access this booking.",
            None,
        ));
    }

    let user = user::Entity::find_by_id(b.user_id)
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

    let room = room::Entity::find_by_id(b.room_id)
        .one(&db)
        .await
        .map_err(internal_error)?
        .ok_or_else(|| {
            api_error(
                StatusCode::NOT_FOUND,
                "ROOM_NOT_FOUND",
                "The requested room could not be found.",
                None,
            )
        })?;

    Ok(Json(BookingDetailResponse {
        id: b.id.to_string(),
        user: BookingDetailUser {
            id: user.id.to_string(),
            full_name: user.full_name,
            email: user.email,
        },
        room: BookingDetailRoom {
            id: room.id.to_string(),
            room_code: room.room_code,
            name: room.room_name,
            location: room.location,
        },
        starts_at: b.starts_at.and_utc().to_rfc3339(),
        ends_at: b.ends_at.and_utc().to_rfc3339(),
        status: status_to_str(&b.status).to_string(),
        checked_in: b.checked_in,
        created_at: b.created_at.and_utc().to_rfc3339(),
        updated_at: b.updated_at.and_utc().to_rfc3339(),
    }))
}

pub async fn update_booking(
    State(db): State<DatabaseConnection>,
    auth: AuthUser,
    Path(booking_id): Path<Uuid>,
    Json(payload): Json<UpdateBookingRequest>,
) -> ApiResult<Json<BookingResponse>> {
    let b = booking::Entity::find_by_id(booking_id)
        .one(&db)
        .await
        .map_err(internal_error)?
        .ok_or_else(|| {
            api_error(
                StatusCode::NOT_FOUND,
                "BOOKING_NOT_FOUND",
                "The requested booking could not be found.",
                None,
            )
        })?;

    if b.user_id != auth.user_id {
        return Err(api_error(
            StatusCode::FORBIDDEN,
            "FORBIDDEN",
            "You do not have permission to modify this booking.",
            None,
        ));
    }

    let now = Utc::now().naive_utc();
    if b.starts_at <= now {
        return Err(api_error(
            StatusCode::BAD_REQUEST,
            "VALIDATION_ERROR",
            "Request validation failed.",
            Some(
                serde_json::json!({ "field": "startsAt", "reason": "Cannot edit a booking that has already started" }),
            ),
        ));
    }

    let new_starts_at = payload.starts_at.unwrap_or(b.starts_at);
    let new_ends_at = payload.ends_at.unwrap_or(b.ends_at);

    if new_starts_at >= new_ends_at {
        return Err(api_error(
            StatusCode::BAD_REQUEST,
            "VALIDATION_ERROR",
            "Request validation failed.",
            Some(
                serde_json::json!({ "field": "endsAt", "reason": "endsAt must be later than startsAt" }),
            ),
        ));
    }

    let overlap = booking::Entity::find()
        .filter(booking::Column::RoomId.eq(b.room_id))
        .filter(booking::Column::Id.ne(booking_id))
        .filter(booking::Column::Status.eq(StatusEnum::Active))
        .filter(
            booking::Column::EndsAt
                .gt(new_starts_at)
                .and(booking::Column::StartsAt.lt(new_ends_at)),
        )
        .one(&db)
        .await
        .map_err(internal_error)?;

    if overlap.is_some() {
        return Err(api_error(
            StatusCode::CONFLICT,
            "BOOKING_CONFLICT",
            "The selected time range overlaps an existing active booking.",
            Some(serde_json::json!({
                "roomId": b.room_id.to_string(),
                "startsAt": new_starts_at.and_utc().to_rfc3339(),
                "endsAt": new_ends_at.and_utc().to_rfc3339()
            })),
        ));
    }

    let room_id = b.room_id;
    let mut active: booking::ActiveModel = b.into();
    active.starts_at = Set(new_starts_at);
    active.ends_at = Set(new_ends_at);
    active.updated_at = Set(now);
    let updated = active.update(&db).await.map_err(internal_error)?;

    let room = room::Entity::find_by_id(room_id)
        .one(&db)
        .await
        .map_err(internal_error)?
        .ok_or_else(|| {
            api_error(
                StatusCode::NOT_FOUND,
                "ROOM_NOT_FOUND",
                "The requested room could not be found.",
                None,
            )
        })?;

    Ok(Json(booking_response(&updated, &room)))
}

pub async fn cancel_booking(
    State(db): State<DatabaseConnection>,
    auth: AuthUser,
    Path(booking_id): Path<Uuid>,
    Json(_payload): Json<CancelBookingRequest>,
) -> ApiResult<Json<BookingResponse>> {
    let b = booking::Entity::find_by_id(booking_id)
        .one(&db)
        .await
        .map_err(internal_error)?
        .ok_or_else(|| {
            api_error(
                StatusCode::NOT_FOUND,
                "BOOKING_NOT_FOUND",
                "The requested booking could not be found.",
                None,
            )
        })?;

    if b.user_id != auth.user_id {
        return Err(api_error(
            StatusCode::FORBIDDEN,
            "FORBIDDEN",
            "You do not have permission to cancel this booking.",
            None,
        ));
    }

    let now = Utc::now().naive_utc();
    if b.starts_at <= now {
        return Err(api_error(
            StatusCode::BAD_REQUEST,
            "VALIDATION_ERROR",
            "Request validation failed.",
            Some(
                serde_json::json!({ "field": "startsAt", "reason": "Cannot cancel a booking that has already started" }),
            ),
        ));
    }

    if b.status != StatusEnum::Active {
        return Err(api_error(
            StatusCode::BAD_REQUEST,
            "VALIDATION_ERROR",
            "Request validation failed.",
            Some(
                serde_json::json!({ "field": "status", "reason": "Only active bookings can be cancelled" }),
            ),
        ));
    }

    let room_id = b.room_id;
    let mut active: booking::ActiveModel = b.into();
    active.status = Set(StatusEnum::Cancelled);
    active.updated_at = Set(now);
    let updated = active.update(&db).await.map_err(internal_error)?;

    let room = room::Entity::find_by_id(room_id)
        .one(&db)
        .await
        .map_err(internal_error)?
        .ok_or_else(|| {
            api_error(
                StatusCode::NOT_FOUND,
                "ROOM_NOT_FOUND",
                "The requested room could not be found.",
                None,
            )
        })?;

    Ok(Json(booking_response(&updated, &room)))
}

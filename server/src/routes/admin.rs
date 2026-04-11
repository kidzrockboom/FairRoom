use axum::{
    Json,
    extract::{Path, Query, State},
    http::StatusCode,
};
use chrono::Utc;
use sea_orm::{
    ActiveModelTrait, ColumnTrait, DatabaseConnection, DbBackend, EntityTrait, ExprTrait,
    FromQueryResult, PaginatorTrait, QueryFilter, QueryOrder, Set, Statement,
};
use std::collections::HashMap;
use uuid::Uuid;

use crate::entity::sea_orm_active_enums::StatusEnum;
use crate::entity::*;
use crate::routes::helper::status_to_str;
use crate::routes::models::*;

// ── Helpers ───────────────────────────────────────────────────────────────────

fn require_admin(auth: &AuthUser) -> Result<(), ApiError> {
    if auth.role != "admin" {
        Err(api_error(
            StatusCode::FORBIDDEN,
            "FORBIDDEN",
            "Admin access required.",
            None,
        ))
    } else {
        Ok(())
    }
}

fn account_state(active_strikes: i64) -> &'static str {
    if active_strikes >= 3 {
        "restricted"
    } else if active_strikes == 2 {
        "warned"
    } else {
        "good"
    }
}

fn strike_to_response(s: &strike::Model) -> StrikeResponse {
    StrikeResponse {
        id: s.id.to_string(),
        user_id: s.user_id.to_string(),
        reason: s.reason.clone(),
        created_at: s.created_at.and_utc().to_rfc3339(),
        revoked_at: s.revoked_at.map(|dt| dt.and_utc().to_rfc3339()),
        given_by: s.given_by.to_string(),
    }
}

async fn room_amenities(
    db: &DatabaseConnection,
    room_id: Uuid,
) -> Result<Vec<AmenityResponse>, ApiError> {
    let links = room_amenity::Entity::find()
        .filter(room_amenity::Column::RoomId.eq(room_id))
        .all(db)
        .await
        .map_err(internal_error)?;

    if links.is_empty() {
        return Ok(vec![]);
    }

    let amenity_ids: Vec<Uuid> = links.into_iter().map(|l| l.amenity_id).collect();
    let amenities = amenity::Entity::find()
        .filter(amenity::Column::Id.is_in(amenity_ids))
        .order_by_asc(amenity::Column::Label)
        .all(db)
        .await
        .map_err(internal_error)?;

    Ok(amenities
        .into_iter()
        .map(|a| AmenityResponse {
            id: a.id.to_string(),
            label: a.label,
        })
        .collect())
}

fn room_to_response(room: room::Model, amenities: Vec<AmenityResponse>) -> RoomResponse {
    RoomResponse {
        id: room.id.to_string(),
        room_code: room.room_code,
        name: room.room_name,
        location: room.location,
        capacity: room.capacity,
        status: room.status,
        usage_notes: room.usage_notes,
        created_at: room.created_at.and_utc().to_rfc3339(),
        amenities,
    }
}

const DEFAULT_PAGE_SIZE: u64 = 20;

// ── Admin bookings ─────────────────────────────────────────────────────────────

pub async fn admin_get_bookings(
    State(db): State<DatabaseConnection>,
    auth: AuthUser,
    Query(params): Query<AdminBookingQuery>,
) -> ApiResult<Json<AdminBookingListResponse>> {
    require_admin(&auth)?;

    let page = Ord::max(params.page.unwrap_or(1), 1);
    let page_size = params.page_size.unwrap_or(DEFAULT_PAGE_SIZE);

    let mut query = booking::Entity::find();

    if let Some(ref search) = params.search {
        let matching_user_ids: Vec<Uuid> = user::Entity::find()
            .filter(
                user::Column::FullName
                    .contains(search)
                    .or(user::Column::Email.contains(search)),
            )
            .all(&db)
            .await
            .map_err(internal_error)?
            .into_iter()
            .map(|u| u.id)
            .collect();
        query = query.filter(booking::Column::UserId.is_in(matching_user_ids));
    }

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
    if let Some(ref status_str) = params.status {
        let status = match status_str.as_str() {
            "active" => StatusEnum::Active,
            "cancelled" => StatusEnum::Cancelled,
            "completed" => StatusEnum::Completed,
            "no_show" => StatusEnum::NoShow,
            _ => {
                return Err(api_error(
                    StatusCode::BAD_REQUEST,
                    "VALIDATION_ERROR",
                    "Request validation failed.",
                    Some(
                        serde_json::json!({ "field": "status", "reason": "Invalid status value" }),
                    ),
                ));
            }
        };
        query = query.filter(booking::Column::Status.eq(status));
    }

    let paginator = query
        .order_by_desc(booking::Column::CreatedAt)
        .paginate(&db, page_size);

    let total = paginator.num_items().await.map_err(internal_error)?;
    let bookings = paginator
        .fetch_page(page - 1)
        .await
        .map_err(internal_error)?;

    let user_ids: Vec<Uuid> = bookings.iter().map(|b| b.user_id).collect();
    let room_ids: Vec<Uuid> = bookings.iter().map(|b| b.room_id).collect();

    let users: HashMap<Uuid, user::Model> = user::Entity::find()
        .filter(user::Column::Id.is_in(user_ids))
        .all(&db)
        .await
        .map_err(internal_error)?
        .into_iter()
        .map(|u| (u.id, u))
        .collect();

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
            let user = users.get(&b.user_id)?;
            let room = rooms.get(&b.room_id)?;
            Some(AdminBookingItem {
                id: b.id.to_string(),
                user: AdminBookingUserSnippet {
                    id: user.id.to_string(),
                    full_name: user.full_name.clone(),
                },
                room: AdminBookingRoomSnippet {
                    id: room.id.to_string(),
                    room_code: room.room_code.clone(),
                    name: room.room_name.clone(),
                    location: room.location.clone(),
                },
                starts_at: b.starts_at.and_utc().to_rfc3339(),
                ends_at: b.ends_at.and_utc().to_rfc3339(),
                status: status_to_str(&b.status).to_string(),
                checked_in: b.checked_in,
                created_at: b.created_at.and_utc().to_rfc3339(),
                updated_at: b.updated_at.and_utc().to_rfc3339(),
            })
        })
        .collect();

    Ok(Json(AdminBookingListResponse {
        items,
        page,
        page_size,
        total,
    }))
}

pub async fn admin_get_booking(
    State(db): State<DatabaseConnection>,
    auth: AuthUser,
    Path(booking_id): Path<Uuid>,
) -> ApiResult<Json<AdminBookingItem>> {
    require_admin(&auth)?;

    let booking = booking::Entity::find_by_id(booking_id)
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

    let user = user::Entity::find_by_id(booking.user_id)
        .one(&db)
        .await
        .map_err(internal_error)?
        .ok_or_else(|| {
            api_error(
                StatusCode::NOT_FOUND,
                "USER_NOT_FOUND",
                "The user associated with this booking could not be found.",
                None,
            )
        })?;

    let room = room::Entity::find_by_id(booking.room_id)
        .one(&db)
        .await
        .map_err(internal_error)?
        .ok_or_else(|| {
            api_error(
                StatusCode::NOT_FOUND,
                "ROOM_NOT_FOUND",
                "The room associated with this booking could not be found.",
                None,
            )
        })?;

    Ok(Json(AdminBookingItem {
        id: booking.id.to_string(),
        user: AdminBookingUserSnippet {
            id: user.id.to_string(),
            full_name: user.full_name,
        },
        room: AdminBookingRoomSnippet {
            id: room.id.to_string(),
            room_code: room.room_code,
            name: room.room_name,
            location: room.location,
        },
        starts_at: booking.starts_at.and_utc().to_rfc3339(),
        ends_at: booking.ends_at.and_utc().to_rfc3339(),
        status: status_to_str(&booking.status).to_string(),
        checked_in: booking.checked_in,
        created_at: booking.created_at.and_utc().to_rfc3339(),
        updated_at: booking.updated_at.and_utc().to_rfc3339(),
    }))
}

// ── Admin users & strikes ──────────────────────────────────────────────────────

pub async fn admin_get_users(
    State(db): State<DatabaseConnection>,
    auth: AuthUser,
    Query(params): Query<AdminUserQuery>,
) -> ApiResult<Json<AdminUserListResponse>> {
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
        .map_err(internal_error)?;

    let user_ids: Vec<Uuid> = users.iter().map(|u| u.id).collect();
    let active_strikes_list = strike::Entity::find()
        .filter(strike::Column::UserId.is_in(user_ids))
        .filter(strike::Column::RevokedAt.is_null())
        .all(&db)
        .await
        .map_err(internal_error)?;

    let mut strike_counts: HashMap<Uuid, i64> = HashMap::new();
    for s in active_strikes_list {
        *strike_counts.entry(s.user_id).or_insert(0) += 1;
    }

    let items: Vec<AdminUserItem> = users
        .into_iter()
        .map(|u| {
            use crate::entity::sea_orm_active_enums::RoleEnum;
            let active = *strike_counts.get(&u.id).unwrap_or(&0);
            AdminUserItem {
                id: u.id.to_string(),
                full_name: u.full_name,
                email: u.email,
                role: match u.role {
                    RoleEnum::Admin => "admin".into(),
                    RoleEnum::Student => "student".into(),
                },
                active_strikes: active,
                account_state: account_state(active).into(),
            }
        })
        .collect();

    let total = items.len();
    Ok(Json(AdminUserListResponse { items, total }))
}

pub async fn admin_get_user_strikes(
    State(db): State<DatabaseConnection>,
    auth: AuthUser,
    Path(user_id): Path<Uuid>,
) -> ApiResult<Json<AdminUserStrikesResponse>> {
    require_admin(&auth)?;

    let strikes = strike::Entity::find()
        .filter(strike::Column::UserId.eq(user_id))
        .order_by_desc(strike::Column::CreatedAt)
        .all(&db)
        .await
        .map_err(internal_error)?;

    let active_strikes = strikes.iter().filter(|s| s.revoked_at.is_none()).count() as i64;
    let items = strikes.iter().map(strike_to_response).collect();

    Ok(Json(AdminUserStrikesResponse {
        user_id: user_id.to_string(),
        active_strikes,
        items,
    }))
}

pub async fn admin_create_strike(
    State(db): State<DatabaseConnection>,
    auth: AuthUser,
    Json(payload): Json<CreateStrikeRequest>,
) -> ApiResult<(StatusCode, Json<StrikeResponse>)> {
    require_admin(&auth)?;

    if payload.reason.trim().is_empty() {
        return Err(api_error(
            StatusCode::BAD_REQUEST,
            "VALIDATION_ERROR",
            "Request validation failed.",
            Some(serde_json::json!({ "field": "reason", "reason": "reason is required" })),
        ));
    }

    let user = user::Entity::find_by_id(payload.user_id)
        .one(&db)
        .await
        .map_err(internal_error)?
        .ok_or_else(|| {
            api_error(
                StatusCode::NOT_FOUND,
                "USER_NOT_FOUND",
                "The requested user could not be found.",
                None,
            )
        })?;

    let new_strikes = user.strikes + 1;

    let new_strike = strike::ActiveModel {
        id: Set(Uuid::new_v4()),
        user_id: Set(payload.user_id),
        given_by: Set(auth.user_id),
        reason: Set(payload.reason),
        revoked_at: Set(None),
        created_at: Set(Utc::now().naive_utc()),
        ..Default::default()
    };

    let inserted = new_strike.insert(&db).await.map_err(internal_error)?;

    let mut active_user: user::ActiveModel = user.into();
    active_user.strikes = Set(new_strikes);
    active_user.update(&db).await.map_err(internal_error)?;

    Ok((StatusCode::CREATED, Json(strike_to_response(&inserted))))
}

pub async fn admin_revoke_strike(
    State(db): State<DatabaseConnection>,
    auth: AuthUser,
    Path(strike_id): Path<Uuid>,
    Json(_payload): Json<RevokeStrikeRequest>,
) -> ApiResult<Json<StrikeResponse>> {
    require_admin(&auth)?;

    let strike = strike::Entity::find_by_id(strike_id)
        .one(&db)
        .await
        .map_err(internal_error)?
        .ok_or_else(|| {
            api_error(
                StatusCode::NOT_FOUND,
                "STRIKE_NOT_FOUND",
                "The requested strike could not be found.",
                None,
            )
        })?;

    if strike.revoked_at.is_some() {
        return Err(api_error(
            StatusCode::BAD_REQUEST,
            "STRIKE_ALREADY_REVOKED",
            "This strike has already been revoked.",
            None,
        ));
    }

    let user_id = strike.user_id;
    let mut active: strike::ActiveModel = strike.into();
    active.revoked_at = Set(Some(Utc::now().naive_utc()));
    let updated = active.update(&db).await.map_err(internal_error)?;

    let user = user::Entity::find_by_id(user_id)
        .one(&db)
        .await
        .map_err(internal_error)?
        .ok_or_else(|| {
            api_error(
                StatusCode::NOT_FOUND,
                "USER_NOT_FOUND",
                "The user associated with this strike could not be found.",
                None,
            )
        })?;

    let current_strikes = user.strikes;
    let mut active_user: user::ActiveModel = user.into();
    active_user.strikes = Set(Ord::max(current_strikes - 1, 0));
    active_user.update(&db).await.map_err(internal_error)?;

    Ok(Json(strike_to_response(&updated)))
}

// ── Admin rooms ────────────────────────────────────────────────────────────────

pub async fn admin_get_rooms(
    State(db): State<DatabaseConnection>,
    auth: AuthUser,
    Query(params): Query<AdminRoomQuery>,
) -> ApiResult<Json<RoomListResponse>> {
    require_admin(&auth)?;

    let mut query = room::Entity::find();
    if let Some(status) = params.status {
        query = query.filter(room::Column::Status.eq(status));
    }

    let rooms = query
        .order_by_asc(room::Column::RoomName)
        .all(&db)
        .await
        .map_err(internal_error)?;

    let mut items = Vec::with_capacity(rooms.len());
    for room in rooms {
        let amenities = room_amenities(&db, room.id).await?;
        items.push(room_to_response(room, amenities));
    }

    let total = items.len();
    Ok(Json(RoomListResponse { items, total }))
}

pub async fn admin_create_room(
    State(db): State<DatabaseConnection>,
    auth: AuthUser,
    Json(payload): Json<CreateRoomRequest>,
) -> ApiResult<(StatusCode, Json<RoomResponse>)> {
    require_admin(&auth)?;

    if payload.room_code.trim().is_empty() || payload.name.trim().is_empty() {
        return Err(api_error(
            StatusCode::BAD_REQUEST,
            "VALIDATION_ERROR",
            "Request validation failed.",
            Some(
                serde_json::json!({ "field": "roomCode, name", "reason": "roomCode and name are required" }),
            ),
        ));
    }
    if payload.capacity < 1 {
        return Err(api_error(
            StatusCode::BAD_REQUEST,
            "VALIDATION_ERROR",
            "Request validation failed.",
            Some(
                serde_json::json!({ "field": "capacity", "reason": "capacity must be at least 1" }),
            ),
        ));
    }
    if payload.status != "operational" && payload.status != "disabled" {
        return Err(api_error(
            StatusCode::BAD_REQUEST,
            "VALIDATION_ERROR",
            "Request validation failed.",
            Some(
                serde_json::json!({ "field": "status", "reason": "status must be 'operational' or 'disabled'" }),
            ),
        ));
    }

    let new_room = room::ActiveModel {
        id: Set(Uuid::new_v4()),
        room_code: Set(payload.room_code),
        room_name: Set(payload.name),
        location: Set(payload.location),
        capacity: Set(payload.capacity),
        status: Set(payload.status),
        usage_notes: Set(payload.usage_notes.unwrap_or_default()),
        created_at: Set(Utc::now().naive_utc()),
        ..Default::default()
    };

    let room = new_room.insert(&db).await.map_err(internal_error)?;
    Ok((StatusCode::CREATED, Json(room_to_response(room, vec![]))))
}

pub async fn admin_update_room(
    State(db): State<DatabaseConnection>,
    auth: AuthUser,
    Path(room_id): Path<Uuid>,
    Json(payload): Json<UpdateRoomRequest>,
) -> ApiResult<Json<RoomResponse>> {
    require_admin(&auth)?;

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
            return Err(api_error(
                StatusCode::BAD_REQUEST,
                "VALIDATION_ERROR",
                "Request validation failed.",
                Some(
                    serde_json::json!({ "field": "capacity", "reason": "capacity must be at least 1" }),
                ),
            ));
        }
        active.capacity = Set(capacity);
    }
    if let Some(ref status) = payload.status {
        if status != "operational" && status != "disabled" {
            return Err(api_error(
                StatusCode::BAD_REQUEST,
                "VALIDATION_ERROR",
                "Request validation failed.",
                Some(
                    serde_json::json!({ "field": "status", "reason": "status must be 'operational' or 'disabled'" }),
                ),
            ));
        }
        active.status = Set(status.clone());
    }
    if let Some(usage_notes) = payload.usage_notes {
        active.usage_notes = Set(usage_notes);
    }

    let updated = active.update(&db).await.map_err(internal_error)?;
    let amenities = room_amenities(&db, updated.id).await?;
    Ok(Json(room_to_response(updated, amenities)))
}

// ── Admin amenities ────────────────────────────────────────────────────────────

pub async fn admin_get_amenities(
    State(db): State<DatabaseConnection>,
    auth: AuthUser,
) -> ApiResult<Json<AmenityListResponse>> {
    require_admin(&auth)?;

    let amenities = amenity::Entity::find()
        .order_by_asc(amenity::Column::Label)
        .all(&db)
        .await
        .map_err(internal_error)?;

    let items: Vec<AmenityResponse> = amenities
        .into_iter()
        .map(|a| AmenityResponse {
            id: a.id.to_string(),
            label: a.label,
        })
        .collect();
    let total = items.len();
    Ok(Json(AmenityListResponse { items, total }))
}

pub async fn admin_create_amenity(
    State(db): State<DatabaseConnection>,
    auth: AuthUser,
    Json(payload): Json<CreateAmenityRequest>,
) -> ApiResult<(StatusCode, Json<AmenityResponse>)> {
    require_admin(&auth)?;

    if payload.label.trim().is_empty() {
        return Err(api_error(
            StatusCode::BAD_REQUEST,
            "VALIDATION_ERROR",
            "Request validation failed.",
            Some(serde_json::json!({ "field": "label", "reason": "label is required" })),
        ));
    }

    let new_amenity = amenity::ActiveModel {
        id: Set(Uuid::new_v4()),
        label: Set(payload.label),
    };

    let inserted = new_amenity.insert(&db).await.map_err(internal_error)?;
    Ok((
        StatusCode::CREATED,
        Json(AmenityResponse {
            id: inserted.id.to_string(),
            label: inserted.label,
        }),
    ))
}

pub async fn admin_delete_amenity(
    State(db): State<DatabaseConnection>,
    auth: AuthUser,
    Path(amenity_id): Path<Uuid>,
) -> ApiResult<StatusCode> {
    require_admin(&auth)?;

    let result = amenity::Entity::delete_by_id(amenity_id)
        .exec(&db)
        .await
        .map_err(internal_error)?;

    if result.rows_affected == 0 {
        return Err(api_error(
            StatusCode::NOT_FOUND,
            "AMENITY_NOT_FOUND",
            "The requested amenity could not be found.",
            None,
        ));
    }

    Ok(StatusCode::NO_CONTENT)
}

pub async fn admin_set_room_amenities(
    State(db): State<DatabaseConnection>,
    auth: AuthUser,
    Path(room_id): Path<Uuid>,
    Json(payload): Json<SetRoomAmenitiesRequest>,
) -> ApiResult<Json<RoomResponse>> {
    require_admin(&auth)?;

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

    let found_amenities = amenity::Entity::find()
        .filter(amenity::Column::Id.is_in(payload.amenity_ids.clone()))
        .all(&db)
        .await
        .map_err(internal_error)?;

    if found_amenities.len() != payload.amenity_ids.len() {
        return Err(api_error(
            StatusCode::BAD_REQUEST,
            "VALIDATION_ERROR",
            "Request validation failed.",
            Some(
                serde_json::json!({ "field": "amenityIds", "reason": "One or more amenity IDs not found" }),
            ),
        ));
    }

    room_amenity::Entity::delete_many()
        .filter(room_amenity::Column::RoomId.eq(room_id))
        .exec(&db)
        .await
        .map_err(internal_error)?;

    for amenity_id in payload.amenity_ids {
        let link = room_amenity::ActiveModel {
            room_id: Set(room_id),
            amenity_id: Set(amenity_id),
        };
        link.insert(&db).await.map_err(internal_error)?;
    }

    let amenities = room_amenities(&db, room_id).await?;
    Ok(Json(room_to_response(room, amenities)))
}

pub async fn admin_delete_room_amenity(
    State(db): State<DatabaseConnection>,
    auth: AuthUser,
    Path((room_id, amenity_id)): Path<(Uuid, Uuid)>,
) -> ApiResult<StatusCode> {
    require_admin(&auth)?;

    let result = room_amenity::Entity::delete_many()
        .filter(room_amenity::Column::RoomId.eq(room_id))
        .filter(room_amenity::Column::AmenityId.eq(amenity_id))
        .exec(&db)
        .await
        .map_err(internal_error)?;

    if result.rows_affected == 0 {
        return Err(api_error(
            StatusCode::NOT_FOUND,
            "ROOM_AMENITY_NOT_FOUND",
            "The requested room amenity assignment could not be found.",
            None,
        ));
    }

    Ok(StatusCode::NO_CONTENT)
}

// ── Admin analytics ────────────────────────────────────────────────────────────

#[derive(Debug, FromQueryResult)]
struct RoomUsageRow {
    key: String,
    total_bookings: i64,
    total_hours: f64,
    no_show_count: i64,
}

pub async fn admin_get_room_usage(
    State(db): State<DatabaseConnection>,
    auth: AuthUser,
    Query(params): Query<RoomUsageQuery>,
) -> ApiResult<Json<RoomUsageAnalyticsResponse>> {
    require_admin(&auth)?;

    let group_by = params.group_by.as_deref().unwrap_or("room").to_string();

    let mut conditions = String::new();
    if params.starts_at.is_some() {
        conditions.push_str(" AND b.starts_at >= $1");
    }
    if params.ends_at.is_some() {
        let n = if params.starts_at.is_some() { 2 } else { 1 };
        conditions.push_str(&format!(" AND b.ends_at <= ${}", n));
    }

    let sql = format!(
        r#"
        SELECT
            r.room_code AS key,
            COUNT(b.id) AS total_bookings,
            COALESCE(SUM(EXTRACT(EPOCH FROM (b.ends_at - b.starts_at)) / 3600), 0)::FLOAT8 AS total_hours,
            COUNT(b.id) FILTER (WHERE b.status = 'no_show') AS no_show_count
        FROM booking b
        JOIN room r ON r.id = b.room_id
        WHERE 1=1{conditions}
        GROUP BY r.room_code
        ORDER BY r.room_code
        "#
    );

    let mut values: Vec<sea_orm::Value> = vec![];
    if let Some(starts_at) = params.starts_at {
        values.push(starts_at.into());
    }
    if let Some(ends_at) = params.ends_at {
        values.push(ends_at.into());
    }

    let rows = RoomUsageRow::find_by_statement(Statement::from_sql_and_values(
        DbBackend::Postgres,
        &sql,
        values,
    ))
    .all(&db)
    .await
    .map_err(internal_error)?;

    // ── Aggregate totals ───────────────────────────────────────────────────────
    let total_bookings: i64 = rows.iter().map(|r| r.total_bookings).sum();
    let total_no_shows: i64 = rows.iter().map(|r| r.no_show_count).sum();
    let total_hours: f64 = rows.iter().map(|r| r.total_hours).sum();

    // ── Summary stats ──────────────────────────────────────────────────────────
    let most_popular = rows.iter().max_by(|a, b| a.total_bookings.cmp(&b.total_bookings));
    let most_popular_room = AnalyticsStat {
        value: most_popular.map(|r| r.key.clone()).unwrap_or_else(|| "N/A".into()),
        text: most_popular
            .map(|r| format!("{} bookings", r.total_bookings))
            .unwrap_or_else(|| "No bookings recorded".into()),
    };

    let avg_duration_hrs = if total_bookings > 0 { total_hours / total_bookings as f64 } else { 0.0 };
    let avg_duration_mins = (avg_duration_hrs * 60.0).round() as i64;
    let average_booking_duration = AnalyticsStat {
        value: format!("{:.1}h", avg_duration_hrs),
        text: format!("{} min avg per booking", avg_duration_mins),
    };

    let no_show_pct = if total_bookings > 0 {
        (total_no_shows as f64 / total_bookings as f64) * 100.0
    } else {
        0.0
    };
    let no_show_rate = AnalyticsStat {
        value: format!("{:.1}%", no_show_pct),
        text: format!("{} of {} bookings were no-shows", total_no_shows, total_bookings),
    };

    // ── Usage distribution ─────────────────────────────────────────────────────
    let usage_distribution: Vec<UsageDistributionItem> = rows
        .iter()
        .map(|r| UsageDistributionItem {
            room: r.key.clone(),
            hours: (r.total_hours * 10.0).round() / 10.0,
        })
        .collect();

    // ── Performance breakdown ──────────────────────────────────────────────────
    // Available hours = days in range × 12 h/day (8 am – 8 pm operating hours).
    // If no range is supplied, default to a 30-day window.
    let days_in_range = match (params.starts_at, params.ends_at) {
        (Some(s), Some(e)) => Ord::max((e - s).num_days(), 1),
        _ => 30,
    };
    let available_hours_per_room = days_in_range as f64 * 12.0;

    let performance_breakdown: Vec<RoomPerformanceItem> = rows
        .iter()
        .map(|r| {
            let occupancy_pct = if available_hours_per_room > 0.0 {
                (r.total_hours / available_hours_per_room * 100.0).min(100.0)
            } else {
                0.0
            };
            let efficiency = if occupancy_pct >= 60.0 {
                "High"
            } else if occupancy_pct >= 25.0 {
                "Medium"
            } else {
                "Low"
            };
            RoomPerformanceItem {
                room_identifier: r.key.clone(),
                total_usage_hours: (r.total_hours * 10.0).round() / 10.0,
                occupancy_percentage: (occupancy_pct * 10.0).round() / 10.0,
                efficiency: efficiency.into(),
            }
        })
        .collect();

    // ── Insights ───────────────────────────────────────────────────────────────
    let least_used = rows.iter().min_by(|a, b| a.total_hours.partial_cmp(&b.total_hours).unwrap());
    let recommendation = if let Some(room) = least_used {
        AnalyticsInsightItem {
            title: format!("Consider promoting {}", room.key),
            description: format!(
                "{} has the lowest utilisation ({:.1} h). Consider making it more visible or reviewing its availability.",
                room.key, room.total_hours
            ),
            meta: format!("{} bookings recorded", room.total_bookings),
        }
    } else {
        AnalyticsInsightItem {
            title: "No data available".into(),
            description: "No booking data found for the selected period.".into(),
            meta: String::new(),
        }
    };

    let anomalies: Vec<AnalyticsInsightItem> = rows
        .iter()
        .filter(|r| {
            r.total_bookings > 0
                && (r.no_show_count as f64 / r.total_bookings as f64) > 0.25
        })
        .map(|r| {
            let pct = (r.no_show_count as f64 / r.total_bookings as f64 * 100.0).round() as i64;
            AnalyticsInsightItem {
                title: format!("High no-show rate in {}", r.key),
                description: format!(
                    "{} has a {}% no-show rate ({} of {} bookings).",
                    r.key, pct, r.no_show_count, r.total_bookings
                ),
                meta: format!("{}% no-show", pct),
            }
        })
        .collect();

    Ok(Json(RoomUsageAnalyticsResponse {
        group_by,
        starts_at: params.starts_at.map(|dt| dt.and_utc().to_rfc3339()),
        ends_at: params.ends_at.map(|dt| dt.and_utc().to_rfc3339()),
        summary: RoomUsageSummary {
            most_popular_room,
            average_booking_duration,
            no_show_rate,
        },
        usage_distribution,
        performance_breakdown,
        insights: RoomUsageInsights {
            recommendation,
            anomalies,
        },
    }))
}

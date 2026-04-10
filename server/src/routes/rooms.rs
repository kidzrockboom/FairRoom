use axum::{
    Json,
    extract::{Path, Query, State},
    http::StatusCode,
};
use chrono::NaiveDate;
use sea_orm::{
    ColumnTrait, DatabaseConnection, EntityTrait, ExprTrait,
    PaginatorTrait, QueryFilter, QueryOrder,
};
use sea_orm::sea_query::Expr;
use uuid::Uuid;

use crate::entity::*;
use crate::routes::helper::status_to_str;
use crate::routes::models::*;

const DEFAULT_PAGE_SIZE: u64 = 20;

/// Fetches amenities for a single room.
async fn fetch_amenities(
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
        .map(|a| AmenityResponse { id: a.id.to_string(), label: a.label })
        .collect())
}

pub async fn get_rooms(
    State(db): State<DatabaseConnection>,
    Query(params): Query<RoomQuery>,
) -> ApiResult<Json<PublicRoomListResponse>> {
    let page = Ord::max(params.page.unwrap_or(1), 1);
    let page_size = params.page_size.unwrap_or(DEFAULT_PAGE_SIZE);
    let has_time_range = params.starts_at.is_some() && params.ends_at.is_some();

    let mut query = room::Entity::find().filter(room::Column::Status.eq("operational"));

    if let Some(ref search) = params.search {
        query = query.filter(
            room::Column::RoomName
                .contains(search)
                .or(room::Column::Location.contains(search))
                .or(room::Column::RoomCode.contains(search)),
        );
    }

    if let Some(min_cap) = params.min_capacity {
        query = query.filter(room::Column::Capacity.gte(min_cap));
    }

    if let (Some(starts_at), Some(ends_at)) = (params.starts_at, params.ends_at) {
        if starts_at >= ends_at {
            return Err(api_error(
                StatusCode::BAD_REQUEST,
                "VALIDATION_ERROR",
                "Request validation failed.",
                Some(serde_json::json!({ "field": "startsAt", "reason": "startsAt must be before endsAt" })),
            ));
        }
        query = query.filter(
            room::Column::Id.not_in_subquery(
                sea_orm::sea_query::Query::select()
                    .column(booking::Column::RoomId)
                    .from(booking::Entity)
                    .and_where(
                        Expr::col(booking::Column::EndsAt)
                            .gt(starts_at)
                            .and(Expr::col(booking::Column::StartsAt).lt(ends_at)),
                    )
                    .to_owned(),
            ),
        );
    }

    let paginator = query.order_by_asc(room::Column::RoomName).paginate(&db, page_size);
    let total = paginator.num_items().await.map_err(internal_error)?;
    let rooms = paginator.fetch_page(page - 1).await.map_err(internal_error)?;

    let mut items = Vec::with_capacity(rooms.len());
    for r in rooms {
        let amenities = fetch_amenities(&db, r.id).await?;
        items.push(PublicRoomItem {
            id: r.id.to_string(),
            room_code: r.room_code,
            name: r.room_name,
            location: r.location,
            capacity: r.capacity,
            status: r.status,
            usage_notes: r.usage_notes,
            created_at: None, // omitted from list responses per contract
            amenities,
            is_available_for_requested_range: has_time_range.then_some(true),
        });
    }

    Ok(Json(PublicRoomListResponse { items, page, page_size, total }))
}

pub async fn get_room(
    State(db): State<DatabaseConnection>,
    Path(room_id): Path<Uuid>,
) -> ApiResult<Json<PublicRoomItem>> {
    let room = room::Entity::find_by_id(room_id)
        .one(&db)
        .await
        .map_err(internal_error)?
        .ok_or_else(|| api_error(
            StatusCode::NOT_FOUND,
            "ROOM_NOT_FOUND",
            "The requested room could not be found.",
            None,
        ))?;

    let amenities = fetch_amenities(&db, room.id).await?;

    Ok(Json(PublicRoomItem {
        id: room.id.to_string(),
        room_code: room.room_code,
        name: room.room_name,
        location: room.location,
        capacity: room.capacity,
        status: room.status,
        usage_notes: room.usage_notes,
        created_at: Some(room.created_at.and_utc().to_rfc3339()),
        amenities,
        is_available_for_requested_range: None,
    }))
}

pub async fn get_room_bookings(
    State(db): State<DatabaseConnection>,
    Path(room_id): Path<Uuid>,
    Query(params): Query<RoomBookingsQuery>,
) -> ApiResult<Json<RoomBookingsResponse>> {
    let room = room::Entity::find_by_id(room_id)
        .one(&db)
        .await
        .map_err(internal_error)?
        .ok_or_else(|| api_error(
            StatusCode::NOT_FOUND,
            "ROOM_NOT_FOUND",
            "The requested room could not be found.",
            None,
        ))?;

    let mut query = booking::Entity::find()
        .filter(booking::Column::RoomId.eq(room_id));

    if let Some(date_str) = params.date {
        let date = NaiveDate::parse_from_str(&date_str, "%Y-%m-%d")
            .map_err(|_| api_error(
                StatusCode::BAD_REQUEST,
                "VALIDATION_ERROR",
                "Request validation failed.",
                Some(serde_json::json!({ "field": "date", "reason": "date must be in YYYY-MM-DD format" })),
            ))?;

        let day_start = date.and_hms_opt(0, 0, 0).unwrap();
        let day_end = date.and_hms_opt(23, 59, 59).unwrap();

        query = query
            .filter(booking::Column::StartsAt.gte(day_start))
            .filter(booking::Column::StartsAt.lte(day_end));
    }

    let bookings = query
        .order_by_asc(booking::Column::StartsAt)
        .all(&db)
        .await
        .map_err(internal_error)?;

    let items = bookings
        .into_iter()
        .map(|b| BookingResponse {
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
        .collect();

    Ok(Json(RoomBookingsResponse { items }))
}

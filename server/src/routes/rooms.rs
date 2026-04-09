use axum::{
    Json,
    extract::{Path, Query, State},
    http::StatusCode,
};
use chrono::NaiveDate;
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, ExprTrait, QueryFilter, QueryOrder, PaginatorTrait};
use sea_orm::sea_query::Expr;
use uuid::Uuid;

use crate::entity::*;
use crate::routes::models::*;

const DEFAULT_PAGE_SIZE: u64 = 20;

pub async fn get_rooms(
    State(db): State<DatabaseConnection>,
    Query(params): Query<RoomQuery>,
) -> Result<Json<Vec<room::Model>>, (StatusCode, String)> {
    let page = params.page.unwrap_or(1).saturating_sub(1);
    let page_size = params.page_size.unwrap_or(DEFAULT_PAGE_SIZE);

    // Only return active rooms to regular users
    let mut query = room::Entity::find().filter(room::Column::IsActive.eq(true));

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

    // If a time window is requested, exclude rooms that have a confirmed booking
    // overlapping that window. This uses a NOT EXISTS sub-select approach via
    // SeaORM's condition builder.
    if let (Some(starts_at), Some(ends_at)) = (params.starts_at, params.ends_at) {
        if starts_at >= ends_at {
            return Err((StatusCode::BAD_REQUEST, "startsAt must be before endsAt".into()));
        }
        // Exclude rooms whose id appears in any overlapping active booking
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

    let rooms = query
        .order_by_asc(room::Column::RoomName)
        .paginate(&db, page_size)
        .fetch_page(page)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(rooms))
}

pub async fn get_room(
    State(db): State<DatabaseConnection>,
    Path(room_id): Path<Uuid>,
) -> Result<Json<room::Model>, (StatusCode, String)> {
    let room = room::Entity::find_by_id(room_id)
        .one(&db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?
        .ok_or((StatusCode::NOT_FOUND, "Room not found".into()))?;

    Ok(Json(room))
}

pub async fn get_room_bookings(
    State(db): State<DatabaseConnection>,
    Path(room_id): Path<Uuid>,
    Query(params): Query<RoomBookingsQuery>,
) -> Result<Json<Vec<booking::Model>>, (StatusCode, String)> {
    let mut query = booking::Entity::find()
        .filter(booking::Column::RoomId.eq(room_id));

    if let Some(date_str) = params.date {
        let date = NaiveDate::parse_from_str(&date_str, "%Y-%m-%d")
            .map_err(|_| (StatusCode::BAD_REQUEST, "Invalid date — use YYYY-MM-DD".into()))?;

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
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(bookings))
}

use axum::{
    Router,
    http::Method,
    routing::{get, patch, post},
};
use sea_orm::DatabaseConnection;
use tower_http::cors::{Any, CorsLayer};

pub mod configuration;
pub mod db;
pub mod entity;
pub mod routes;

use routes::admin::*;
use routes::auth::*;
use routes::bookings::*;
use routes::me::*;
use routes::rooms::*;

pub fn create_app(db: DatabaseConnection) -> Router {
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods([
            Method::GET,
            Method::POST,
            Method::PATCH,
            Method::DELETE,
            Method::OPTIONS,
        ])
        .allow_headers(Any);

    Router::new()
        // ── Utility ───────────────────────────────────────────────────────────
        .route("/", get(root))
        .route("/health_check", get(health_check))
        // ── Auth ──────────────────────────────────────────────────────────────
        .route("/auth/register", post(register))
        .route("/auth/login", post(login))
        // ── Account (me) ──────────────────────────────────────────────────────
        .route("/me", get(get_me))
        .route("/me/account-status", get(get_account_status))
        .route("/me/account-activities", get(get_account_activities))
        .route("/me/bookings", get(get_my_bookings))
        .route("/me/reminders", get(get_my_reminders))
        // ── Rooms (public) ────────────────────────────────────────────────────
        .route("/rooms", get(get_rooms))
        .route("/rooms/{room_id}", get(get_room))
        .route("/rooms/{room_id}/bookings", get(get_room_bookings))
        // ── Bookings ──────────────────────────────────────────────────────────
        .route("/bookings", post(create_booking))
        .route(
            "/bookings/{booking_id}",
            get(get_booking).patch(update_booking),
        )
        .route("/bookings/{booking_id}/cancel", post(cancel_booking))
        // ── Admin: bookings ───────────────────────────────────────────────────
        .route("/admin/bookings", get(admin_get_bookings))
        .route("/admin/bookings/{booking_id}", get(admin_get_booking))
        // ── Admin: users & strikes ────────────────────────────────────────────
        .route("/admin/users", get(admin_get_users))
        .route(
            "/admin/users/{user_id}/strikes",
            get(admin_get_user_strikes),
        )
        .route("/admin/strikes", post(admin_create_strike))
        .route(
            "/admin/strikes/{strike_id}/revoke",
            post(admin_revoke_strike),
        )
        // ── Admin: rooms ──────────────────────────────────────────────────────
        .route("/admin/rooms", get(admin_get_rooms).post(admin_create_room))
        .route("/admin/rooms/{room_id}", patch(admin_update_room))
        .layer(cors)
        .with_state(db)
}

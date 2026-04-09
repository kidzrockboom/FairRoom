use axum::{
    extract::FromRequestParts,
    http::{StatusCode, request::Parts},
};
use chrono::NaiveDateTime;
use jsonwebtoken::{DecodingKey, Validation, decode};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

// ── Auth ──────────────────────────────────────────────────────────────────────

#[derive(Deserialize)]
pub struct RegisterRequest {
    pub full_name: String,
    pub email: String,
    pub password: String,
}

#[derive(Deserialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

#[derive(Serialize)]
pub struct AuthResponse {
    pub token: String,
    pub user: UserResponse,
}

// Kept for backward-compat with any existing code referencing RegisterResponse
pub type RegisterResponse = AuthResponse;

#[derive(Serialize)]
pub struct UserResponse {
    pub id: String,
    pub full_name: String,
    pub email: String,
    pub role: String,
    pub strikes: i32,
    pub created_at: String,
}

// ── JWT ───────────────────────────────────────────────────────────────────────

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String, // user id
    pub email: String,
    pub role: String,
    pub exp: usize,
}

// ── Auth extractor ────────────────────────────────────────────────────────────

pub struct AuthUser {
    pub user_id: Uuid,
    pub role: String,
}

impl<S> FromRequestParts<S> for AuthUser
where
    S: Send + Sync,
{
    type Rejection = (StatusCode, String);

    async fn from_request_parts(parts: &mut Parts, _state: &S) -> Result<Self, Self::Rejection> {
        let auth_header = parts
            .headers
            .get("Authorization")
            .ok_or((StatusCode::UNAUTHORIZED, "Missing token".into()))?
            .to_str()
            .map_err(|_| (StatusCode::UNAUTHORIZED, "Invalid header".into()))?;

        let token = auth_header
            .strip_prefix("Bearer ")
            .ok_or((StatusCode::UNAUTHORIZED, "Invalid token format".into()))?;

        let secret = std::env::var("JWT_SECRET").unwrap_or_else(|_| "secret".into());

        let data = decode::<Claims>(
            token,
            &DecodingKey::from_secret(secret.as_bytes()),
            &Validation::default(),
        )
        .map_err(|_| (StatusCode::UNAUTHORIZED, "Invalid token".into()))?;

        Ok(AuthUser {
            user_id: data.claims.sub.parse().map_err(|_| (StatusCode::UNAUTHORIZED, "Invalid user id in token".into()))?,
            role: data.claims.role,
        })
    }
}

// ── Account ───────────────────────────────────────────────────────────────────

#[derive(Serialize)]
pub struct AccountStatusResponse {
    pub strikes: i32,
    pub suspended: bool,
    pub suspension_reason: Option<String>,
}

// ── Booking requests ──────────────────────────────────────────────────────────

#[derive(Deserialize)]
pub struct CreateBookingRequest {
    pub room_id: Uuid,
    pub starts_at: NaiveDateTime,
    pub ends_at: NaiveDateTime,
    pub purpose: String,
    pub expected_attendees: i32,
}

#[derive(Deserialize)]
pub struct UpdateBookingRequest {
    pub starts_at: Option<NaiveDateTime>,
    pub ends_at: Option<NaiveDateTime>,
}

#[derive(Deserialize, Default)]
pub struct CancelBookingRequest {
    pub reason: Option<String>,
}

// ── Query params ──────────────────────────────────────────────────────────────

#[derive(Deserialize, Default)]
pub struct MyBookingQuery {
    pub scope: Option<String>, // "active" | "past" | "all"
    pub page: Option<u64>,
    pub page_size: Option<u64>,
}

#[derive(Deserialize, Default)]
pub struct ReminderQuery {
    pub status: Option<String>,
    pub booking_id: Option<Uuid>,
    pub page_size: Option<u64>,
}

#[derive(Deserialize, Default)]
pub struct RoomQuery {
    pub search: Option<String>,
    pub min_capacity: Option<i32>,
    pub starts_at: Option<NaiveDateTime>,
    pub ends_at: Option<NaiveDateTime>,
    pub page: Option<u64>,
    pub page_size: Option<u64>,
}

#[derive(Deserialize, Default)]
pub struct RoomBookingsQuery {
    pub date: Option<String>, // YYYY-MM-DD
}

#[derive(Deserialize, Default)]
pub struct AdminBookingQuery {
    pub search: Option<String>,
    pub status: Option<String>,
    pub user_id: Option<Uuid>,
    pub room_id: Option<Uuid>,
    pub starts_at: Option<NaiveDateTime>,
    pub ends_at: Option<NaiveDateTime>,
    pub page: Option<u64>,
    pub page_size: Option<u64>,
}

#[derive(Deserialize, Default)]
pub struct AdminUserQuery {
    pub search: Option<String>,
}

#[derive(Deserialize, Default)]
pub struct AdminRoomQuery {
    pub status: Option<String>,
}

// ── Admin requests ────────────────────────────────────────────────────────────

#[derive(Deserialize)]
pub struct CreateStrikeRequest {
    pub user_id: Uuid,
    pub reason: String,
    pub source_booking_id: Option<Uuid>,
}

#[derive(Deserialize, Default)]
pub struct RevokeStrikeRequest {
    pub reason: Option<String>,
}

#[derive(Deserialize)]
pub struct CreateRoomRequest {
    pub room_code: String,
    pub name: String,
    pub location: String,
    pub capacity: i32,
    pub status: String, // "active" | "inactive"
    pub usage_notes: Option<String>,
}

#[derive(Deserialize)]
pub struct UpdateRoomRequest {
    pub room_code: Option<String>,
    pub name: Option<String>,
    pub location: Option<String>,
    pub capacity: Option<i32>,
    pub status: Option<String>,
    pub usage_notes: Option<String>,
}

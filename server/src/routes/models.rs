use axum::{
    Json,
    extract::FromRequestParts,
    http::{StatusCode, request::Parts},
};
use chrono::NaiveDateTime;
use jsonwebtoken::{DecodingKey, Validation, decode};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use uuid::Uuid;

// ── Error types ───────────────────────────────────────────────────────────────

#[derive(Serialize)]
pub struct ApiErrorBody {
    pub code: String,
    pub message: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub details: Option<Value>,
}

#[derive(Serialize)]
pub struct ApiErrorResponse {
    pub error: ApiErrorBody,
}

pub type ApiError = (StatusCode, Json<ApiErrorResponse>);
pub type ApiResult<T> = Result<T, ApiError>;

pub fn api_error(
    status: StatusCode,
    code: &str,
    message: &str,
    details: Option<Value>,
) -> ApiError {
    (
        status,
        Json(ApiErrorResponse {
            error: ApiErrorBody {
                code: code.to_string(),
                message: message.to_string(),
                details,
            },
        }),
    )
}

pub fn internal_error(e: impl std::fmt::Display) -> ApiError {
    eprintln!("[internal_error] {e}");
    api_error(
        StatusCode::INTERNAL_SERVER_ERROR,
        "INTERNAL_SERVER_ERROR",
        "An unexpected error occurred. Please try again later.",
        None,
    )
}

// ── Auth ──────────────────────────────────────────────────────────────────────

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
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

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct UserResponse {
    pub id: String,
    pub full_name: String,
    pub email: String,
    pub role: String,
    pub created_at: String,
}

// ── JWT ───────────────────────────────────────────────────────────────────────

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String,
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
    type Rejection = ApiError;

    async fn from_request_parts(parts: &mut Parts, _state: &S) -> Result<Self, Self::Rejection> {
        let unauth = || {
            api_error(
                StatusCode::UNAUTHORIZED,
                "UNAUTHENTICATED",
                "Authentication is required for this endpoint.",
                None,
            )
        };

        let auth_header = parts
            .headers
            .get("Authorization")
            .ok_or_else(unauth)?
            .to_str()
            .map_err(|_| unauth())?;

        let token = auth_header.strip_prefix("Bearer ").ok_or_else(unauth)?;

        let secret = std::env::var("JWT_SECRET").unwrap_or_else(|_| "secret".into());

        let data = decode::<Claims>(
            token,
            &DecodingKey::from_secret(secret.as_bytes()),
            &Validation::default(),
        )
        .map_err(|_| unauth())?;

        Ok(AuthUser {
            user_id: data.claims.sub.parse().map_err(|_| unauth())?,
            role: data.claims.role,
        })
    }
}

// ── Account ───────────────────────────────────────────────────────────────────

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AccountStatusResponse {
    pub active_strikes: i64,
    pub booking_eligible: bool,
    pub account_state: String,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AccountActivityItem {
    pub id: String,
    #[serde(rename = "type")]
    pub activity_type: String,
    pub title: String,
    pub description: String,
    pub occurred_at: String,
    pub status: String,
    pub source_entity_type: String,
    pub source_entity_id: String,
}

#[derive(Serialize)]
pub struct AccountActivitiesResponse {
    pub items: Vec<AccountActivityItem>,
}

// ── Booking requests ──────────────────────────────────────────────────────────

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateBookingRequest {
    pub room_id: Uuid,
    pub starts_at: NaiveDateTime,
    pub ends_at: NaiveDateTime,
    pub purpose: String,
    pub expected_attendees: i32,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UpdateBookingRequest {
    pub starts_at: Option<NaiveDateTime>,
    pub ends_at: Option<NaiveDateTime>,
}

#[derive(Deserialize, Default)]
pub struct CancelBookingRequest {
    pub reason: Option<String>,
}

// ── Booking responses ─────────────────────────────────────────────────────────

/// Paginated list of bookings (GET /me/bookings)
#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct BookingListResponse {
    pub items: Vec<BookingResponse>,
    pub page: u64,
    pub page_size: u64,
    pub total: u64,
}

/// Used for list + mutating endpoints (POST, PATCH, cancel).
/// Embeds roomCode and roomName so the client doesn't need a second request.
#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct BookingResponse {
    pub id: String,
    pub room_id: String,
    pub room_code: String,
    pub room_name: String,
    pub starts_at: String,
    pub ends_at: String,
    pub status: String,
    pub checked_in: bool,
    pub created_at: String,
    pub updated_at: String,
}

/// Used for GET /bookings/:id — includes embedded user and room objects.
#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct BookingDetailUser {
    pub id: String,
    pub full_name: String,
    pub email: String,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct BookingDetailRoom {
    pub id: String,
    pub room_code: String,
    pub name: String,
    pub location: String,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct BookingDetailResponse {
    pub id: String,
    pub user: BookingDetailUser,
    pub room: BookingDetailRoom,
    pub starts_at: String,
    pub ends_at: String,
    pub status: String,
    pub checked_in: bool,
    pub created_at: String,
    pub updated_at: String,
}

// ── Query params ──────────────────────────────────────────────────────────────

#[derive(Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct MyBookingQuery {
    pub scope: Option<String>,
    pub page: Option<u64>,
    pub page_size: Option<u64>,
}

#[derive(Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ReminderQuery {
    pub status: Option<String>,
    pub booking_id: Option<Uuid>,
    pub page_size: Option<u64>,
}

#[derive(Deserialize, Default)]
#[serde(rename_all = "camelCase")]
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
    pub date: Option<String>,
}

#[derive(Deserialize, Default)]
#[serde(rename_all = "camelCase")]
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
#[serde(rename_all = "camelCase")]
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
#[serde(rename_all = "camelCase")]
pub struct CreateRoomRequest {
    pub room_code: String,
    pub name: String,
    pub location: String,
    pub capacity: i32,
    pub status: String,
    pub usage_notes: Option<String>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UpdateRoomRequest {
    pub room_code: Option<String>,
    pub name: Option<String>,
    pub location: Option<String>,
    pub capacity: Option<i32>,
    pub status: Option<String>,
    pub usage_notes: Option<String>,
}

// ── Amenity requests ──────────────────────────────────────────────────────────

#[derive(Deserialize)]
pub struct CreateAmenityRequest {
    pub label: String,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SetRoomAmenitiesRequest {
    pub amenity_ids: Vec<uuid::Uuid>,
}

// ── Amenity responses ─────────────────────────────────────────────────────────

#[derive(Serialize)]
pub struct AmenityResponse {
    pub id: String,
    pub label: String,
}

#[derive(Serialize)]
pub struct AmenityListResponse {
    pub items: Vec<AmenityResponse>,
    pub total: usize,
}

// ── Room responses ────────────────────────────────────────────────────────────

/// Public-facing room item.
/// `createdAt` is omitted from list responses but present on single-room responses.
/// `isAvailableForRequestedRange` is only present when a time range was queried.
#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PublicRoomItem {
    pub id: String,
    pub room_code: String,
    pub name: String,
    pub location: String,
    pub capacity: i32,
    pub status: String,
    pub usage_notes: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,
    pub amenities: Vec<AmenityResponse>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub is_available_for_requested_range: Option<bool>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PublicRoomListResponse {
    pub items: Vec<PublicRoomItem>,
    pub page: u64,
    pub page_size: u64,
    pub total: u64,
}

/// Wrapper for GET /rooms/:id/bookings
#[derive(Serialize)]
pub struct RoomBookingsResponse {
    pub items: Vec<BookingResponse>,
}

/// Admin room response — always includes amenities.
#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RoomResponse {
    pub id: String,
    pub room_code: String,
    pub name: String,
    pub location: String,
    pub capacity: i32,
    pub status: String,
    pub usage_notes: String,
    pub created_at: String,
    pub amenities: Vec<AmenityResponse>,
}

#[derive(Serialize)]
pub struct RoomListResponse {
    pub items: Vec<RoomResponse>,
    pub total: usize,
}

// ── Admin booking responses ───────────────────────────────────────────────────

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AdminBookingUserSnippet {
    pub id: String,
    pub full_name: String,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AdminBookingRoomSnippet {
    pub id: String,
    pub room_code: String,
    pub name: String,
    pub location: String,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AdminBookingItem {
    pub id: String,
    pub user: AdminBookingUserSnippet,
    pub room: AdminBookingRoomSnippet,
    pub starts_at: String,
    pub ends_at: String,
    pub status: String,
    pub checked_in: bool,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AdminBookingListResponse {
    pub items: Vec<AdminBookingItem>,
    pub page: u64,
    pub page_size: u64,
    pub total: u64,
}

// ── Admin user responses ──────────────────────────────────────────────────────

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AdminUserItem {
    pub id: String,
    pub full_name: String,
    pub email: String,
    pub role: String,
    pub active_strikes: i64,
    pub account_state: String,
}

#[derive(Serialize)]
pub struct AdminUserListResponse {
    pub items: Vec<AdminUserItem>,
    pub total: usize,
}

// ── Strike responses ──────────────────────────────────────────────────────────

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct StrikeResponse {
    pub id: String,
    pub user_id: String,
    pub reason: String,
    pub created_at: String,
    pub revoked_at: Option<String>,
    pub given_by: String,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AdminUserStrikesResponse {
    pub user_id: String,
    pub active_strikes: i64,
    pub items: Vec<StrikeResponse>,
}

// ── Analytics ─────────────────────────────────────────────────────────────────

#[derive(Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct RoomUsageQuery {
    pub group_by: Option<String>,
    pub starts_at: Option<NaiveDateTime>,
    pub ends_at: Option<NaiveDateTime>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AnalyticsStat {
    pub value: String,
    pub text: String,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RoomUsageSummary {
    pub most_popular_room: AnalyticsStat,
    pub average_booking_duration: AnalyticsStat,
    pub no_show_rate: AnalyticsStat,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct UsageDistributionItem {
    pub room: String,
    pub hours: f64,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RoomPerformanceItem {
    pub room_identifier: String,
    pub total_usage_hours: f64,
    pub occupancy_percentage: f64,
    pub efficiency: String,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AnalyticsInsightItem {
    pub title: String,
    pub description: String,
    pub meta: String,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RoomUsageInsights {
    pub recommendation: AnalyticsInsightItem,
    pub anomalies: Vec<AnalyticsInsightItem>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RoomUsageAnalyticsResponse {
    pub group_by: String,
    pub starts_at: Option<String>,
    pub ends_at: Option<String>,
    pub summary: RoomUsageSummary,
    pub usage_distribution: Vec<UsageDistributionItem>,
    pub performance_breakdown: Vec<RoomPerformanceItem>,
    pub insights: RoomUsageInsights,
}

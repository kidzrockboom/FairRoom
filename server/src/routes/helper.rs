use super::models::{internal_error, ApiError, Claims};
use chrono::{Duration, Utc};
use jsonwebtoken::{EncodingKey, Header, encode};
use sea_orm::{ConnectionTrait, DatabaseConnection};


pub fn generate_jwt(user_id: &str, email: &str, role: &str) -> String {
    let expiration = Utc::now()
        .checked_add_signed(Duration::hours(24))
        .unwrap()
        .timestamp() as usize;

    let claims = Claims {
        sub: user_id.to_string(),
        email: email.to_string(),
        role: role.to_string(),
        exp: expiration,
    };

    let secret = std::env::var("JWT_SECRET").unwrap_or_else(|_| "secret".into());

    encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(secret.as_bytes()),
    )
    .unwrap()
}

pub fn role_to_str(role: &crate::entity::sea_orm_active_enums::RoleEnum) -> String {
    use crate::entity::sea_orm_active_enums::RoleEnum;
    match role {
        RoleEnum::Admin => "admin".to_string(),
        RoleEnum::Student => "student".to_string(),
    }
}

/// Maps a user Model into the API UserProfile shape (no strikes field).
pub fn user_to_response(user: &crate::entity::user::Model) -> super::models::UserResponse {
    super::models::UserResponse {
        id: user.id.to_string(),
        full_name: user.full_name.clone(),
        email: user.email.clone(),
        role: role_to_str(&user.role),
        created_at: user.created_at.and_utc().to_rfc3339(),
    }
}

/// Marks any Active bookings whose ends_at has passed as Completed.
/// Call this at the start of any endpoint that reads bookings to keep statuses fresh.
pub async fn auto_complete_past_bookings(db: &DatabaseConnection) -> Result<(), ApiError> {
    let sql = r#"
        UPDATE booking
        SET status = 'completed', updated_at = NOW()
        WHERE status = 'active' AND ends_at < NOW()
    "#;
    db.execute_unprepared(sql)
        .await
        .map_err(internal_error)?;
    Ok(())
}

/// Converts a booking StatusEnum to its canonical string value.
pub fn status_to_str(status: &crate::entity::sea_orm_active_enums::StatusEnum) -> &'static str {
    use crate::entity::sea_orm_active_enums::StatusEnum;
    match status {
        StatusEnum::Active => "active",
        StatusEnum::Cancelled => "cancelled",
        StatusEnum::Completed => "completed",
        StatusEnum::NoShow => "no_show",
    }
}

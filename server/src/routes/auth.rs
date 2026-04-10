use argon2::{Argon2, PasswordHash, PasswordHasher, PasswordVerifier};
use argon2::password_hash::{SaltString, rand_core::OsRng};
use axum::http::StatusCode;
use axum::{Json, extract::State};
use chrono::Utc;
use sea_orm::DatabaseConnection;
use sea_orm::{ActiveModelTrait, ColumnTrait, EntityTrait, QueryFilter, Set};
use uuid::Uuid;

use crate::entity::sea_orm_active_enums::RoleEnum;
use crate::entity::*;
use crate::routes::helper::{generate_jwt, user_to_response};
use crate::routes::models::*;

pub async fn root() -> &'static str {
    "Hello, World!"
}

pub async fn health_check() -> StatusCode {
    StatusCode::OK
}

pub async fn register(
    State(db): State<DatabaseConnection>,
    Json(payload): Json<RegisterRequest>,
) -> ApiResult<(StatusCode, Json<AuthResponse>)> {
    if payload.full_name.is_empty() || payload.email.is_empty() || payload.password.is_empty() {
        return Err(api_error(
            StatusCode::BAD_REQUEST,
            "VALIDATION_ERROR",
            "Request validation failed.",
            Some(serde_json::json!({
                "field": "fullName, email, password",
                "reason": "All fields are required"
            })),
        ));
    }

    let existing = user::Entity::find()
        .filter(user::Column::Email.eq(&payload.email))
        .one(&db)
        .await
        .map_err(internal_error)?;

    if existing.is_some() {
        return Err(api_error(
            StatusCode::CONFLICT,
            "EMAIL_ALREADY_EXISTS",
            "This email address is already registered.",
            None,
        ));
    }

    let salt = SaltString::generate(&mut OsRng);
    let password_hash = Argon2::default()
        .hash_password(payload.password.as_bytes(), &salt)
        .map_err(|_| api_error(StatusCode::INTERNAL_SERVER_ERROR, "INTERNAL_SERVER_ERROR", "An unexpected error occurred. Please try again later.", None))?
        .to_string();

    let new_user = user::ActiveModel {
        id: Set(Uuid::new_v4()),
        full_name: Set(payload.full_name),
        email: Set(payload.email),
        password: Set(password_hash),
        role: Set(RoleEnum::Student),
        strikes: Set(0),
        created_at: Set(Utc::now().naive_utc()),
    };

    let user = new_user.insert(&db).await.map_err(internal_error)?;

    let role = match user.role {
        RoleEnum::Admin => "admin",
        RoleEnum::Student => "student",
    };
    let token = generate_jwt(&user.id.to_string(), &user.email, role);

    Ok((StatusCode::CREATED, Json(AuthResponse {
        token,
        user: user_to_response(&user),
    })))
}

pub async fn login(
    State(db): State<DatabaseConnection>,
    Json(payload): Json<LoginRequest>,
) -> ApiResult<Json<AuthResponse>> {
    if payload.email.is_empty() || payload.password.is_empty() {
        return Err(api_error(
            StatusCode::BAD_REQUEST,
            "VALIDATION_ERROR",
            "Request validation failed.",
            Some(serde_json::json!({
                "field": "email, password",
                "reason": "All fields are required"
            })),
        ));
    }

    let invalid_creds = || api_error(
        StatusCode::UNAUTHORIZED,
        "UNAUTHENTICATED",
        "Invalid email or password.",
        None,
    );

    let user = user::Entity::find()
        .filter(user::Column::Email.eq(&payload.email))
        .one(&db)
        .await
        .map_err(internal_error)?
        .ok_or_else(invalid_creds)?;

    let parsed_hash = PasswordHash::new(&user.password).map_err(|_| invalid_creds())?;
    if Argon2::default()
        .verify_password(payload.password.as_bytes(), &parsed_hash)
        .is_err()
    {
        return Err(invalid_creds());
    }

    let role = match user.role {
        RoleEnum::Admin => "admin",
        RoleEnum::Student => "student",
    };
    let token = generate_jwt(&user.id.to_string(), &user.email, role);

    Ok(Json(AuthResponse {
        token,
        user: user_to_response(&user),
    }))
}

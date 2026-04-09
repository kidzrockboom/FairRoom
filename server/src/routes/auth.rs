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
) -> Result<Json<AuthResponse>, (StatusCode, String)> {
    if payload.full_name.is_empty() || payload.email.is_empty() || payload.password.is_empty() {
        return Err((StatusCode::BAD_REQUEST, "Missing required fields".into()));
    }

    // Reject duplicate email
    let existing = user::Entity::find()
        .filter(user::Column::Email.eq(&payload.email))
        .one(&db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    if existing.is_some() {
        return Err((StatusCode::CONFLICT, "Email is already registered".into()));
    }

    let new_user = user::ActiveModel {
        id: Set(Uuid::new_v4()),
        full_name: Set(payload.full_name),
        email: Set(payload.email),
        password: Set(payload.password), // TODO: bcrypt hash before storing
        role: Set(RoleEnum::Student),
        strikes: Set(0),
        created_at: Set(Utc::now().naive_utc()),
    };

    let user = new_user
        .insert(&db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

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

pub async fn login(
    State(db): State<DatabaseConnection>,
    Json(payload): Json<LoginRequest>,
) -> Result<Json<AuthResponse>, (StatusCode, String)> {
    if payload.email.is_empty() || payload.password.is_empty() {
        return Err((StatusCode::BAD_REQUEST, "Missing required fields".into()));
    }

    let user = user::Entity::find()
        .filter(user::Column::Email.eq(&payload.email))
        .one(&db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?
        .ok_or((StatusCode::UNAUTHORIZED, "Invalid credentials".into()))?;

    // TODO: replace with bcrypt::verify when passwords are hashed
    if user.password != payload.password {
        return Err((StatusCode::UNAUTHORIZED, "Invalid credentials".into()));
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

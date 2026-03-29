pub mod models;

use axum::{
    Router,
    http::StatusCode,
    routing::{get, post},
};

// basic handler that responds with a static string
async fn root() -> &'static str {
    "Hello, World!"
}

// build our application with a route
pub fn create_app() -> Router {
    Router::new()
        .route("/", get(root))
        .route("/health_check", get(health_check))
        .route("/register", post(register))
}

async fn health_check() -> StatusCode {
    StatusCode::OK
}

async fn register() -> StatusCode {
    StatusCode::OK
}

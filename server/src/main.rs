use axum::{
    Json, Router,
    http::StatusCode,
    routing::{get, post},
};

#[tokio::main]
async fn main() {
    let app = create_app();

    // run our app with hyper, listening globally on port 3000
    let listener = tokio::net::TcpListener::bind("127.0.0.1:8080")
        .await
        .unwrap();
    axum::serve(listener, app).await.unwrap();
}

// basic handler that responds with a static string
async fn root() -> &'static str {
    "Hello, World!"
}

// build our application with a route
fn create_app() -> Router {
    Router::new()
        .route("/", get(root))
        .route("/health_check", get(health_check))
}

async fn health_check() -> StatusCode {
    StatusCode::OK
}

use axum::{
    body::Body,
    http::{Request, StatusCode},
};
use server::create_app;
use tower::ServiceExt;

#[tokio::test]
async fn check_health() {
    let app = create_app();

    let response = app
        .oneshot(Request::get("/").body(Body::empty()).unwrap())
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::OK);
}

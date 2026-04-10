use axum::{
    body::Body,
    http::{Request, StatusCode},
};
use sea_orm::DbErr;
use sea_orm::entity::prelude::*;
use sea_orm::{DatabaseBackend, MockDatabase};
use server::{create_app, db::connect_db, entity::room};
use tower::ServiceExt;

#[tokio::test]
async fn check_health() {
    let db = match connect_db().await {
        Ok(db) => db,
        Err(err) => panic!("{}", err),
    };
    let app = create_app(db);

    let response = app
        .oneshot(Request::get("/").body(Body::empty()).unwrap())
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::OK);
}

#[tokio::test]
async fn test_insert_and_find_database_queries() -> Result<(), DbErr> {
    // Get UUID string
    let id1 = uuid::Uuid::new_v4();
    let id2 = uuid::Uuid::new_v4();

    // Get create at time
    let time1 = chrono::Utc::now().naive_utc();
    let time2 = chrono::Utc::now().naive_utc();

    let db = MockDatabase::new(DatabaseBackend::Postgres)
        .append_query_results([
            // First query result
            vec![room::Model {
                id: id1,
                room_code: "TEST-001".to_string(),
                room_name: "Test Room".to_string(),
                location: "Test Location".to_string(),
                usage_notes: "Using to sleep".to_string(),
                capacity: 10,
                is_active: true,
                created_at: time1,
            }],
            // Second query result
            vec![
                room::Model {
                    id: id1,
                    room_code: "TEST-001".to_string(),
                    room_name: "Test Room".to_string(),
                    location: "Test Location".to_string(),
                    usage_notes: "Using to sleep".to_string(),
                    capacity: 10,
                    is_active: true,
                    created_at: time1,
                },
                room::Model {
                    id: id2,
                    room_code: "TEST-002".to_string(),
                    room_name: "Test Room 2".to_string(),
                    location: "Test Location 2".to_string(),
                    usage_notes: "Using to Study".to_string(),
                    capacity: 5,
                    is_active: true,
                    created_at: time2,
                },
            ],
        ])
        .into_connection();

    // Find a room from mockDatabase
    // Return the first query result
    assert_eq!(
        room::Entity::find().one(&db).await?,
        Some(room::Model {
            id: id1,
            room_code: "TEST-001".to_string(),
            room_name: "Test Room".to_string(),
            location: "Test Location".to_string(),
            usage_notes: "Using to sleep".to_string(),
            capacity: 10,
            is_active: true,
            created_at: time1,
        })
    );

    // Find all rooms from mockDatabase
    assert_eq!(
        room::Entity::find().all(&db).await?,
        [
            room::Model {
                id: id1,
                room_code: "TEST-001".to_string(),
                room_name: "Test Room".to_string(),
                location: "Test Location".to_string(),
                usage_notes: "Using to sleep".to_string(),
                capacity: 10,
                is_active: true,
                created_at: time1,
            },
            room::Model {
                id: id2,
                room_code: "TEST-002".to_string(),
                room_name: "Test Room 2".to_string(),
                location: "Test Location 2".to_string(),
                usage_notes: "Using to Study".to_string(),
                capacity: 5,
                is_active: true,
                created_at: time2,
            }
        ]
    );
    Ok(())
}

use fairroom::create_app;
use fairroom::{configuration::get_configuration, db::connect_db};
use migration::{Migrator, MigratorTrait};

#[tokio::main]
async fn main() {
    let db = match connect_db().await {
        Ok(db) => db,
        Err(err) => panic!("{}", err),
    };

    // Run all pending migrations before starting the server
    Migrator::up(&db, None)
        .await
        .expect("Failed to run migrations");

    let app = create_app(db);

    // let config = get_configuration().expect("Failed to read configuration");

    let port = std::env::var("PORT").unwrap_or_else(|_| "3000".to_string());

    // run our app with listening globally on settings port
    let address = format!("0.0.0.0:{}", port);

    println!("{}", address);

    let listener = tokio::net::TcpListener::bind(address).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

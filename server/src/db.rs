use crate::configuration::get_configuration;
use sea_orm::DbErr;
use sea_orm::{Database, DatabaseConnection};

pub async fn connect_db() -> Result<DatabaseConnection, DbErr> {
    let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");

    let db = Database::connect(&database_url)
        .await
        .expect("Failed to connect to database");

    Ok(db)
}

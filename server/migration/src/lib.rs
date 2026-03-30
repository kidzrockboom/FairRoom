pub use sea_orm_migration::prelude::*;

mod m20220101_000001_create_user_table;
mod m20220101_000002_create_room_table;
mod m20220101_000003_create_booking_table;
mod m20260330_191622_create_strike_table;
mod m20260330_191643_create_reminder_table;

pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_create_user_table::Migration),
            Box::new(m20220101_000002_create_room_table::Migration),
            Box::new(m20220101_000003_create_booking_table::Migration),
            Box::new(m20260330_191622_create_strike_table::Migration),
            Box::new(m20260330_191643_create_reminder_table::Migration),
        ]
    }
}

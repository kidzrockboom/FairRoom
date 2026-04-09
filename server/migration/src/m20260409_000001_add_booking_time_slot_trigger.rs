use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .get_connection()
            .execute_unprepared(
                r#"
                CREATE OR REPLACE FUNCTION set_booking_time_slot()
                RETURNS TRIGGER AS $$
                BEGIN
                  NEW.time_slot := tstzrange(NEW.starts_at::timestamptz, NEW.ends_at::timestamptz);
                  RETURN NEW;
                END;
                $$ LANGUAGE plpgsql;

                DROP TRIGGER IF EXISTS trg_booking_time_slot ON booking;

                CREATE TRIGGER trg_booking_time_slot
                BEFORE INSERT OR UPDATE ON booking
                FOR EACH ROW EXECUTE FUNCTION set_booking_time_slot();
                "#,
            )
            .await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .get_connection()
            .execute_unprepared(
                r#"
                DROP TRIGGER IF EXISTS trg_booking_time_slot ON booking;
                DROP FUNCTION IF EXISTS set_booking_time_slot();
                "#,
            )
            .await?;

        Ok(())
    }
}

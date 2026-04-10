use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

/// The original create_strike migration used `date_time()` which defaults to
/// NOT NULL in SeaORM. This migration drops that constraint so that a NULL
/// revoked_at correctly means "not yet revoked".
#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .get_connection()
            .execute_unprepared(
                "ALTER TABLE strike ALTER COLUMN revoked_at DROP NOT NULL",
            )
            .await?;
        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .get_connection()
            .execute_unprepared(
                "ALTER TABLE strike ALTER COLUMN revoked_at SET NOT NULL",
            )
            .await?;
        Ok(())
    }
}

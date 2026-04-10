use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

/// The strike table already has revoked_at as a nullable column (no NOT NULL
/// constraint in the original migration). This migration cleans up the
/// UNIX_EPOCH sentinel values written by early code and replaces them with
/// proper NULLs so that `revokedAt: null` in the API means "not revoked".
#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .get_connection()
            .execute_unprepared(
                "UPDATE strike SET revoked_at = NULL WHERE revoked_at = '1970-01-01 00:00:00'",
            )
            .await?;
        Ok(())
    }

    async fn down(&self, _manager: &SchemaManager) -> Result<(), DbErr> {
        Ok(())
    }
}

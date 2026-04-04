use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Strike::Table)
                    .if_not_exists()
                    .col(pk_uuid(Strike::Id).not_null().primary_key())
                    .col(uuid(Strike::UserId).not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk-user-id")
                            .from(Strike::Table, Strike::UserId)
                            .to(User::Table, User::Id)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .col(text(Strike::Reason).not_null())
                    .col(date_time(Strike::CreatedAt).not_null())
                    .col(date_time(Strike::RevokedAt))
                    .col(uuid(Strike::GivenBy))
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Strike::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Strike {
    Table,
    Id,
    UserId,
    Reason,
    CreatedAt,
    RevokedAt,
    GivenBy,
}

#[derive(DeriveIden)]
enum User {
    Table,
    Id,
}

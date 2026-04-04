use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Room::Table)
                    .if_not_exists()
                    .col(pk_uuid(Room::Id).not_null().primary_key())
                    .col(string(Room::RoomCode).not_null().unique_key())
                    .col(string(Room::Name).not_null())
                    .col(text(Room::Location).not_null())
                    .col(integer(Room::Capacity).not_null())
                    .col(boolean(Room::IsActive).not_null().default(true))
                    .col(timestamp(Room::CreatedAt).not_null())
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Room::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Room {
    Table,
    Id,
    RoomCode,
    Name,
    Location,
    Capacity,
    IsActive,
    CreatedAt,
}

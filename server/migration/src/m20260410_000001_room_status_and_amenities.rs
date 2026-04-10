use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // 1. Add status column to room
        manager
            .alter_table(
                Table::alter()
                    .table(Room::Table)
                    .add_column(string(Room::Status).not_null().default("operational"))
                    .to_owned(),
            )
            .await?;

        // 2. Migrate is_active → status
        manager
            .get_connection()
            .execute_unprepared(
                "UPDATE room SET status = CASE WHEN is_active THEN 'operational' ELSE 'disabled' END",
            )
            .await?;

        // 3. Drop is_active
        manager
            .alter_table(
                Table::alter()
                    .table(Room::Table)
                    .drop_column(Room::IsActive)
                    .to_owned(),
            )
            .await?;

        // 4. Create amenity table
        manager
            .create_table(
                Table::create()
                    .table(Amenity::Table)
                    .if_not_exists()
                    .col(pk_uuid(Amenity::Id).not_null().primary_key())
                    .col(text(Amenity::Label).not_null().unique_key())
                    .to_owned(),
            )
            .await?;

        // 5. Create room_amenity join table
        manager
            .create_table(
                Table::create()
                    .table(RoomAmenity::Table)
                    .if_not_exists()
                    .col(uuid(RoomAmenity::RoomId).not_null())
                    .col(uuid(RoomAmenity::AmenityId).not_null())
                    .primary_key(
                        Index::create()
                            .col(RoomAmenity::RoomId)
                            .col(RoomAmenity::AmenityId),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk-room-amenity-room")
                            .from(RoomAmenity::Table, RoomAmenity::RoomId)
                            .to(Room::Table, Room::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk-room-amenity-amenity")
                            .from(RoomAmenity::Table, RoomAmenity::AmenityId)
                            .to(Amenity::Table, Amenity::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(RoomAmenity::Table).to_owned())
            .await?;
        manager
            .drop_table(Table::drop().table(Amenity::Table).to_owned())
            .await?;
        manager
            .alter_table(
                Table::alter()
                    .table(Room::Table)
                    .add_column(boolean(Room::IsActive).not_null().default(true))
                    .to_owned(),
            )
            .await?;
        manager
            .get_connection()
            .execute_unprepared(
                "UPDATE room SET is_active = (status = 'operational')",
            )
            .await?;
        manager
            .alter_table(
                Table::alter()
                    .table(Room::Table)
                    .drop_column(Room::Status)
                    .to_owned(),
            )
            .await?;
        Ok(())
    }
}

#[derive(DeriveIden)]
enum Room {
    Table,
    Id,
    Status,
    IsActive,
}

#[derive(DeriveIden)]
enum Amenity {
    Table,
    Id,
    Label,
}

#[derive(DeriveIden)]
enum RoomAmenity {
    Table,
    RoomId,
    AmenityId,
}

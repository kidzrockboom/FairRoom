use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // Enable extension for exclusion constraints
        manager
            .get_connection()
            .execute_unprepared("CREATE EXTENSION IF NOT EXISTS btree_gist;")
            .await?;

        manager
            .create_table(
                Table::create()
                    .table(Booking::Table)
                    .if_not_exists()
                    .col(pk_uuid(Booking::Id).not_null().primary_key())
                    .col(uuid(Booking::UserId).not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk-user-id")
                            .from(Booking::Table, Booking::UserId)
                            .to(User::Table, User::Id)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .col(string(Booking::RoomName).not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk-room-name")
                            .from(Booking::Table, Booking::RoomName)
                            .to(Room::Table, Room::RoomName)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .col(
                        ColumnDef::new(Booking::TimeSlot)
                            .custom(Alias::new("tstzrange"))
                            .not_null(),
                    )
                    .to_owned(),
            )
            .await?;

        manager
            .get_connection()
            .execute_unprepared(
                r#"
                ALTER TABLE booking
                ADD CONSTRAINT no_overlap
                EXCLUDE USING gist (
                  room_name WITH =,
                  time_slot WITH &&
                );
                "#,
            )
            .await?;
        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Booking::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Booking {
    Table,
    Id,
    UserId,
    RoomName,
    TimeSlot,
}

#[derive(DeriveIden)]
enum User {
    Table,
    Id,
    Name,
    Email,
    Password,
    Strikes,
    Role,
    Bookings,
    CreatedAt,
}

#[derive(DeriveIden)]
enum Room {
    Table,
    Id,
    RoomName,
    Location,
    Capacity,
    UsageNotes,
    TimeSlots,
}

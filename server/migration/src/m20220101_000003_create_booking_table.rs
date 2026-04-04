use sea_orm_migration::prelude::extension::postgres::Type;
use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_type(
                Type::create()
                    .as_enum(BookingStatus::StatusEnum)
                    .values([
                        BookingStatus::Active,
                        BookingStatus::Cancelled,
                        BookingStatus::Completed,
                        BookingStatus::NoShow,
                    ])
                    .to_owned(),
            )
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
                            .name("fk-booking-user-id")
                            .from(Booking::Table, Booking::UserId)
                            .to(User::Table, User::Id)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .col(uuid(Booking::RoomId).not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk-booking-room-id")
                            .from(Booking::Table, Booking::RoomId)
                            .to(Room::Table, Room::Id)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .col(date_time(Booking::StartsAt).not_null())
                    .col(date_time(Booking::EndsAt).not_null())
                    .col(
                        ColumnDef::new(Booking::Status)
                            .enumeration(
                                BookingStatus::StatusEnum,
                                [
                                    BookingStatus::Active,
                                    BookingStatus::Cancelled,
                                    BookingStatus::Completed,
                                    BookingStatus::NoShow,
                                ],
                            )
                            .not_null(),
                    )
                    .col(boolean(Booking::CheckedIn).not_null().default(false))
                    .col(timestamp(Booking::CreatedAt).not_null())
                    .col(timestamp(Booking::UpdatedAt).not_null())
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Booking::Table).to_owned())
            .await?;

        manager
            .drop_type(Type::drop().name(BookingStatus::StatusEnum).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Booking {
    Table,
    Id,
    UserId,
    RoomId,
    StartsAt,
    EndsAt,
    Status,
    CheckedIn,
    CreatedAt,
    UpdatedAt,
}

#[derive(Iden)]
enum BookingStatus {
    StatusEnum,
    Active,
    Cancelled,
    Completed,
    NoShow,
}

#[derive(DeriveIden)]
enum User {
    Table,
    Id,
}

#[derive(DeriveIden)]
enum Room {
    Table,
    Id,
}

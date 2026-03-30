use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Reminder::Table)
                    .if_not_exists()
                    .col(pk_uuid(Reminder::Id).not_null().primary_key())
                    .col(uuid(Reminder::BookingId).not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk-booking-id")
                            .from(Reminder::Table, Reminder::BookingId)
                            .to(Booking::Table, Booking::Id)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .col(date_time(Reminder::ScheduledFor).not_null())
                    .col(date_time(Reminder::SentAt))
                    .col(date_time(Reminder::CreatedAt).not_null())
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table("post").to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Reminder {
    Table,
    Id,
    BookingId,
    ScheduledFor,
    SentAt,
    CreatedAt,
}

#[derive(DeriveIden)]
enum Booking {
    Table,
    Id,
    UserID,
    RoomName,
    TimeSlot,
}

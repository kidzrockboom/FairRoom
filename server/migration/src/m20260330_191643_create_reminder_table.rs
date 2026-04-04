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
                    .as_enum(ReminderChannel::ChannelEnum)
                    .values([
                        ReminderChannel::Email,
                        ReminderChannel::Push,
                        ReminderChannel::Sms,
                    ])
                    .to_owned(),
            )
            .await?;

        manager
            .create_type(
                Type::create()
                    .as_enum(ReminderStatus::StatusEnum)
                    .values([
                        ReminderStatus::Scheduled,
                        ReminderStatus::Delivered,
                        ReminderStatus::Failed,
                    ])
                    .to_owned(),
            )
            .await?;

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
                    .col(
                        ColumnDef::new(Reminder::Channel)
                            .enumeration(
                                ReminderChannel::ChannelEnum,
                                [
                                    ReminderChannel::Email,
                                    ReminderChannel::Push,
                                    ReminderChannel::Sms,
                                ],
                            )
                            .not_null(),
                    )
                    .col(date_time(Reminder::ScheduledFor).not_null())
                    .col(date_time(Reminder::SentAt))
                    .col(
                        ColumnDef::new(Reminder::Status)
                            .enumeration(
                                ReminderStatus::StatusEnum,
                                [
                                    ReminderStatus::Scheduled,
                                    ReminderStatus::Delivered,
                                    ReminderStatus::Failed,
                                ],
                            )
                            .not_null(),
                    )
                    .col(text(Reminder::FailureReason))
                    .col(date_time(Reminder::CreatedAt).not_null())
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Reminder::Table).to_owned())
            .await?;

        manager
            .drop_type(Type::drop().name(ReminderStatus::StatusEnum).to_owned())
            .await?;

        manager
            .drop_type(Type::drop().name(ReminderChannel::ChannelEnum).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Reminder {
    Table,
    Id,
    BookingId,
    Channel,
    ScheduledFor,
    SentAt,
    Status,
    FailureReason,
    CreatedAt,
}

#[derive(Iden)]
enum ReminderChannel {
    ChannelEnum,
    Email,
    Push,
    Sms,
}

#[derive(Iden)]
enum ReminderStatus {
    StatusEnum,
    Scheduled,
    Delivered,
    Failed,
}

#[derive(DeriveIden)]
enum Booking {
    Table,
    Id,
}

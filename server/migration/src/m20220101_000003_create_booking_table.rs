use sea_orm_migration::prelude::extension::postgres::Type;
use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // Needed for exclusion constraints
        manager
            .get_connection()
            .execute_unprepared("CREATE EXTENSION IF NOT EXISTS btree_gist;")
            .await?;

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
                  room_id WITH =,
                  time_slot WITH &&
                );
                "#,
            )
            .await?;

        // Populate the booking table
        manager
            .get_connection()
            .execute_unprepared(
                r#"
                INSERT INTO booking (
  id,
  user_id,
  room_id,
  starts_at,
  ends_at,
  status,
  checked_in,
  created_at,
  updated_at,
  time_slot
)
VALUES

-- Active booking (future)
(
  uuid_generate_v4(),
  (SELECT id FROM "user" WHERE email = 'bob@example.com'),
  (SELECT id FROM room WHERE room_name = 'Meeting Room A1'),
  '2026-04-10 10:00',
  '2026-04-10 11:00',
  'active',
  false,
  NOW(),
  NOW(),
  tstzrange('2026-04-01 08:00', '2026-04-01 9:00')
),

-- Completed booking
(
  uuid_generate_v4(),
  (SELECT id FROM "user" WHERE email = 'alice@example.com'),
  (SELECT id FROM room WHERE room_name = 'Meeting Room A1'),
  '2026-04-01 09:00',
  '2026-04-01 10:00',
  'completed',
  true,
  NOW() - INTERVAL '10 days',
  NOW() - INTERVAL '9 days',
  tstzrange('2026-04-01 10:00', '2026-04-01 11:00')
),

-- Cancelled booking
(
  uuid_generate_v4(),
  (SELECT id FROM "user" WHERE email = 'charlie@example.com'),
  (SELECT id FROM room WHERE room_name = 'Conference Room B1'),
  '2026-04-05 14:00',
  '2026-04-05 15:00',
  'cancelled',
  false,
  NOW() - INTERVAL '5 days',
  NOW() - INTERVAL '5 days',
  tstzrange('2026-04-01 11:00', '2026-04-01 12:00')
),

-- No-show booking
(
  uuid_generate_v4(),
  (SELECT id FROM "user" WHERE email = 'bob@example.com'),
  (SELECT id FROM room WHERE room_name = 'Meeting Room A2'),
  '2026-04-03 11:00',
  '2026-04-03 12:00',
  'no_show',
  false,
  NOW() - INTERVAL '7 days',
  NOW() - INTERVAL '6 days',
  tstzrange('2026-04-01 13:00', '2026-04-01 14:00')
),

-- Another active booking
(
  uuid_generate_v4(),
  (SELECT id FROM "user" WHERE email = 'charlie@example.com'),
  (SELECT id FROM room WHERE room_name = 'Conference Room B1'),
  '2026-04-12 13:00',
  '2026-04-12 15:00',
  'active',
  false,
  NOW(),
  NOW(),
  tstzrange('2026-04-01 15:00', '2026-04-01 16:00')
);
        "#,
            )
            .await?;

        Ok(())
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
    TimeSlot,
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

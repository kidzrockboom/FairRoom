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
                    .col(string(Room::RoomName).not_null())
                    .col(text(Room::Location).not_null())
                    .col(integer(Room::Capacity).not_null())
                    .col(text(Room::UsageNotes))
                    .col(boolean(Room::IsActive).not_null().default(true))
                    .col(timestamp(Room::CreatedAt).not_null())
                    .to_owned(),
            )
            .await?;

        // Populate the Room table
        manager
            .get_connection()
            .execute_unprepared(
                r#"
        INSERT INTO room (
  id,
  room_code,
  room_name,
  location,
  capacity,
  usage_notes,
  is_active,
  created_at
)
VALUES

-- Small meeting rooms
(
  uuid_generate_v4(),
  'RM-A101',
  'Meeting Room A1',
  'First Floor - Building A',
  6,
  'Ideal for small team meetings and calls',
  true,
  NOW()
),
(
  uuid_generate_v4(),
  'RM-A102',
  'Meeting Room A2',
  'First Floor - Building A',
  8,
  'Equipped with TV screen and whiteboard',
  true,
  NOW()
),

-- Medium rooms
(
  uuid_generate_v4(),
  'RM-B201',
  'Conference Room B1',
  'Second Floor - Building B',
  12,
  'Video conferencing enabled',
  true,
  NOW()
),
(
  uuid_generate_v4(),
  'RM-B202',
  'Conference Room B2',
  'Second Floor - Building B',
  16,
  'Projector and hybrid meeting setup',
  true,
  NOW()
),

-- Large rooms
(
  uuid_generate_v4(),
  'RM-C301',
  'Lecture Room C1',
  'Third Floor - Building C',
  30,
  'Suitable for lectures and workshops',
  true,
  NOW()
),

-- Quiet / special purpose
(
  uuid_generate_v4(),
  'RM-Q101',
  'Quiet Study Room',
  'Ground Floor - Library Wing',
  4,
  'Silent study only',
  true,
  NOW()
),

-- Inactive room (good for testing)
(
  uuid_generate_v4(),
  'RM-X999',
  'Maintenance Room',
  'Basement',
  10,
  'Currently unavailable due to maintenance',
  false,
  NOW()
);
        "#,
            )
            .await?;

        Ok(())
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
    RoomName,
    Location,
    Capacity,
    UsageNotes,
    IsActive,
    CreatedAt,
}

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

        // Create table
        manager
            .create_table(
                Table::create()
                    .table(RoomTimeSlots::Table)
                    .if_not_exists()
                    .col(pk_uuid(RoomTimeSlots::Id))
                    .col(uuid(RoomTimeSlots::RoomId).not_null())
                    .col(
                        ColumnDef::new(RoomTimeSlots::TimeSlot)
                            .custom(Alias::new("tstzrange"))
                            .not_null(),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk-room-time-slots-room")
                            .from(RoomTimeSlots::Table, RoomTimeSlots::RoomId)
                            .to(Room::Table, Room::Id)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await?;

        // Prevent overlapping availability per room (optional but recommended)
        manager
            .get_connection()
            .execute_unprepared(
                r#"
                ALTER TABLE room_time_slots
                ADD CONSTRAINT no_overlap_availability
                EXCLUDE USING gist (
                  room_id WITH =,
                  time_slot WITH &&
                );
                "#,
            )
            .await?;

        // Populate the time_slots table
        manager
            .get_connection()
            .execute_unprepared(
                r#"
                CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        INSERT INTO room_time_slots (id, room_id, time_slot)
VALUES
(
  uuid_generate_v4(),
  (SELECT id FROM room WHERE room_name = 'Room A'),
  tstzrange('2026-04-01 08:00', '2026-04-01 12:00')
),
(
  uuid_generate_v4(),
  (SELECT id FROM room WHERE room_name = 'Room A'),
  tstzrange('2026-04-01 13:00', '2026-04-01 18:00')
);
        "#,
            )
            .await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(RoomTimeSlots::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum RoomTimeSlots {
    Table,
    Id,
    RoomId,
    TimeSlot,
}

#[derive(DeriveIden)]
enum Room {
    Table,
    Id,
}

use sea_orm_migration::prelude::extension::postgres::Type;
use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // Create ENUM type
        manager
            .create_type(
                Type::create()
                    .as_enum(Role::RoleEnum)
                    .values([Role::Admin, Role::Student])
                    .to_owned(),
            )
            .await?;

        // Create User table
        manager
            .create_table(
                Table::create()
                    .table(User::Table)
                    .if_not_exists()
                    .col(pk_uuid(User::Id).not_null().primary_key())
                    .col(string(User::FullName).not_null())
                    .col(string(User::Email).not_null().unique_key())
                    .col(string(User::Password).not_null())
                    .col(integer(User::Strikes).not_null())
                    .col(
                        ColumnDef::new(User::Role)
                            .enumeration(Role::RoleEnum, [Role::Admin, Role::Student])
                            .not_null(),
                    )
                    .col(timestamp(User::CreatedAt).not_null())
                    .to_owned(),
            )
            .await?;

        // Populate the user table
        manager.get_connection().execute_unprepared(r#"
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

        INSERT INTO "user" (id, full_name, email, password, strikes, role, created_at)
        VALUES
        (uuid_generate_v4(), 'Alice Admin', 'alice@example.com', 'hashed_pw_1', 0, 'admin', NOW()),
        (uuid_generate_v4(), 'Bob Student', 'bob@example.com', 'hashed_pw_2', 1, 'student', NOW()),
        (uuid_generate_v4(), 'Charlie Student', 'charlie@example.com', 'hashed_pw_3', 0, 'student', NOW());
        "#).await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_type(Type::drop().name(Role::RoleEnum).to_owned())
            .await?;

        manager
            .drop_table(Table::drop().table(User::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum User {
    Table,
    Id,
    FullName,
    Email,
    Password,
    Strikes,
    Role,
    CreatedAt,
}

#[derive(Iden)]
enum Role {
    RoleEnum, // name of the enum type
    Admin,
    Student,
}

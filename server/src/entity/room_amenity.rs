use sea_orm::entity::prelude::*;
use serde::Serialize;

#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel, Serialize)]
#[sea_orm(table_name = "room_amenity")]
pub struct Model {
    #[sea_orm(primary_key, auto_increment = false)]
    pub room_id: Uuid,
    #[sea_orm(primary_key, auto_increment = false)]
    pub amenity_id: Uuid,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, PartialEq, Eq, PartialOrd, Ord, Deserialize, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Room {
    pub id: Uuid,
    pub room_code: String,
    pub name: String,
    pub location: String,
    pub capacity: i32,
    pub is_active: bool,
    pub created_at: DateTime<Utc>,
}

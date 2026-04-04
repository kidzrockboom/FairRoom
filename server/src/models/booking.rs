use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, PartialEq, Eq, PartialOrd, Ord, Deserialize, Serialize, Clone)]
#[serde(rename_all = "snake_case")]
pub enum BookingStatus {
    Active,
    Cancelled,
    Completed,
    NoShow,
}

#[derive(Debug, PartialEq, Eq, PartialOrd, Ord, Deserialize, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Booking {
    pub id: Uuid,
    pub user_id: Uuid,
    pub room_id: Uuid,
    pub starts_at: DateTime<Utc>,
    pub ends_at: DateTime<Utc>,
    pub status: BookingStatus,
    pub checked_in: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, PartialEq, Eq, PartialOrd, Ord, Deserialize, Serialize, Clone)]
#[serde(rename_all = "snake_case")]
pub enum ReminderStatus {
    Scheduled,
    Delivered,
    Failed,
}

#[derive(Debug, PartialEq, Eq, PartialOrd, Ord, Deserialize, Serialize, Clone)]
#[serde(rename_all = "snake_case")]
pub enum ReminderChannel {
    Email,
    Push,
    Sms,
}

#[derive(Debug, PartialEq, Eq, PartialOrd, Ord, Deserialize, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Reminder {
    pub id: Uuid,
    pub booking_id: Uuid,
    pub channel: ReminderChannel,
    pub scheduled_for: DateTime<Utc>,
    pub sent_at: Option<DateTime<Utc>>,
    pub status: ReminderStatus,
    pub failure_reason: Option<String>,
    pub created_at: DateTime<Utc>,
}

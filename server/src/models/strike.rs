use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, PartialEq, Eq, PartialOrd, Ord, Deserialize, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Strike {
    pub id: Uuid,
    pub user_id: Uuid,
    pub reason: String,
    pub created_at: DateTime<Utc>,
    pub revoked_at: Option<DateTime<Utc>>,
    pub given_by: Option<Uuid>,
}

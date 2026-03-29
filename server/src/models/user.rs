use super::role::Role;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, PartialEq, Eq, PartialOrd, Ord, Deserialize, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct User {
    pub id: Uuid,

    pub full_name: String,

    pub email: String,

    pub password_hash: String,

    pub role: Role,

    pub created_at: DateTime<Utc>,
}

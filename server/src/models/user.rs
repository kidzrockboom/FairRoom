use super::role::Role;
use serde::{Deserialize, Serialize};

#[derive(Debug, PartialEq, Eq, PartialOrd, Ord, Deserialize, Serialize, Clone)]
pub struct User {
    pub id: Uuid,

    pub name: String,

    pub email: String,

    pub password: String,

    pub strikes: u8,

    pub role: Role,

    pub created_at: DateTime<Utc>,
}

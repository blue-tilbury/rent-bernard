use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use surrealdb::sql::Thing;

pub mod model;

const TABLE_NAME: &str = "users";

/// Raw data returned by DB
#[derive(Serialize, Deserialize)]
struct UserResource {
    id: Option<Thing>,
    name: String,
    email: String,
    picture: String,
    created_at: NaiveDateTime,
    updated_at: NaiveDateTime,
}

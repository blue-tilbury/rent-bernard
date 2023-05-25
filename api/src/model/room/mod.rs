use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use surrealdb::sql::Thing;

use self::model::Image;

mod factory;
pub mod model;

const TABLE_NAME: &'static str = "rooms";

/// Raw data returned by DB
#[derive(Serialize, Deserialize)]
struct RoomResource {
    id: Option<Thing>,
    title: String,
    price: i64,
    area: String,
    street: Option<String>,
    is_furnished: bool,
    is_pet_friendly: bool,
    description: String,
    images: Vec<Image>,
    created_at: NaiveDateTime,
    updated_at: NaiveDateTime,
}

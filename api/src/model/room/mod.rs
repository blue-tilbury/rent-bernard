use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use surrealdb::sql::Thing;

use self::model::{ContactInformation, Image};

mod factory;
pub mod model;

const TABLE_NAME: &str = "rooms";

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
    contact_information: ContactInformation,
    created_at: NaiveDateTime,
    updated_at: NaiveDateTime,
}

#[derive(Serialize)]
struct UpdateRoomResource {
    title: String,
    price: i64,
    area: String,
    street: Option<String>,
    is_furnished: bool,
    is_pet_friendly: bool,
    description: String,
    images: Vec<Image>,
    contact_information: ContactInformation,
    updated_at: NaiveDateTime,
}

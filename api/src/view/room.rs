use rocket::serde::json::Json;
use serde::Serialize;

use crate::model::room::Room;

#[derive(Serialize)]
pub struct GetRoom {
    id: String,
    title: String,
    price: i64,
    area: String,
    street: Option<String>,
    is_furnished: bool,
    is_pet_friendly: bool,
    description: String,
    created_at: String,
    updated_at: String,
}

impl GetRoom {
    pub fn get_room(room: Room) -> Json<GetRoom> {
        let Room {
            id,
            title,
            price,
            area,
            street,
            is_furnished,
            is_pet_friendly,
            description,
            created_at,
            updated_at,
        } = room;
        let res = GetRoom {
            id,
            title,
            price,
            area,
            street,
            is_furnished,
            is_pet_friendly,
            description,
            created_at: created_at.to_string(),
            updated_at: updated_at.to_string(),
        };
        Json(res)
    }
}

use rocket::serde::json::Json;
use serde::{Deserialize, Serialize};

use crate::model::room::model::Room;

#[derive(Serialize, Deserialize)]
pub struct GetRoom {
    pub id: String,
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

#[cfg(test)]
mod tests {
    use chrono::Local;

    use super::*;

    #[test]
    fn test_get_room() {
        let room = Room {
            id: "id".to_string(),
            title: "title".to_string(),
            price: 10000,
            area: "area".to_string(),
            street: None,
            is_furnished: true,
            is_pet_friendly: false,
            description: "description".to_string(),
            created_at: Local::now().naive_local(),
            updated_at: Local::now().naive_local(),
        };
        let json = GetRoom::get_room(room);
        assert_eq!(json.id, "id".to_string());
        assert_eq!(json.title, "title".to_string());
        assert_eq!(json.price, 10000);
        assert_eq!(json.area, "area".to_string());
        assert!(json.street.is_none());
        assert!(json.is_furnished);
        assert!(!json.is_pet_friendly);
        assert_eq!(json.description, "description".to_string());
        assert!(!json.created_at.to_string().is_empty());
        assert!(!json.updated_at.to_string().is_empty());
    }
}

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
    images: Vec<GetImage>,
    contact_information: GetContactInformation,
    created_at: String,
    updated_at: String,
}

#[derive(Serialize, Deserialize)]
struct GetImage {
    url: String,
}

#[derive(Serialize, Deserialize)]
struct GetContactInformation {
    email: String,
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
            images,
            contact_information,
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
            images: images
                .into_iter()
                .map(|image| GetImage { url: image.url })
                .collect(),
            contact_information: GetContactInformation {
                email: contact_information.email,
            },
            created_at: created_at.to_string(),
            updated_at: updated_at.to_string(),
        };
        Json(res)
    }
}

#[cfg(test)]
mod tests {
    use chrono::Local;

    use crate::model::room::model::{ContactInformation, Image};

    use super::*;

    #[test]
    fn test_get_room() {
        let image = Image {
            url: "url".to_string(),
        };
        let room = Room {
            id: "id".to_string(),
            title: "title".to_string(),
            price: 10000,
            area: "area".to_string(),
            street: None,
            is_furnished: true,
            is_pet_friendly: false,
            description: "description".to_string(),
            images: vec![image],
            contact_information: ContactInformation {
                email: "email".to_string(),
            },
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
        assert_eq!(json.images[0].url, "url".to_string());
        assert_eq!(json.contact_information.email, "email".to_string());
        assert_eq!(json.description, "description".to_string());
        assert!(!json.created_at.to_string().is_empty());
        assert!(!json.updated_at.to_string().is_empty());
    }
}

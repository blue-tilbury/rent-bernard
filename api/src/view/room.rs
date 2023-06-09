use rocket::serde::json::Json;
use serde::{Deserialize, Serialize};

use crate::model::room::model::Room;

#[derive(Serialize, Deserialize)]
pub struct Get {
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

#[derive(Serialize, Deserialize)]
pub struct List {
    rooms: Vec<Get>,
}

impl Get {
    pub fn generate(room: Room) -> Json<Get> {
        Json(Self::to_get(room))
    }

    fn to_get(room: Room) -> Get {
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
        Get {
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
        }
    }
}

impl List {
    pub fn generate(rooms: Vec<Room>) -> Json<List> {
        let res: Vec<Get> = rooms.into_iter().map(Get::to_get).collect();
        Json(List { rooms: res })
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
        let json = Get::generate(room);
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

    #[test]
    fn test_list_rooms() {
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
        let json = List::generate(vec![room]);
        assert_eq!(json.rooms.len(), 1);
    }
}

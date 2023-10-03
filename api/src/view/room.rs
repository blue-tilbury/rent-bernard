use rocket::{http::Status, serde::json::Json};
use serde::{Deserialize, Serialize};

use crate::{model::room::model::Room, utils::s3::S3Operation};

#[derive(Serialize, Deserialize)]
pub struct Get {
    pub id: String,
    title: String,
    price: i64,
    city: String,
    street: Option<String>,
    is_furnished: bool,
    is_pet_friendly: bool,
    description: String,
    image_urls: Vec<String>,
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
    rooms: Vec<ListItem>,
}

#[derive(Serialize, Deserialize)]
pub struct ListItem {
    id: String,
    title: String,
    price: i64,
    city: String,
    street: Option<String>,
    is_furnished: bool,
    is_pet_friendly: bool,
    description: String,
    contact_information: GetContactInformation,
    created_at: String,
    updated_at: String,
}

impl Get {
    pub async fn generate(room: Room, client: impl S3Operation) -> Result<Json<Get>, Status> {
        let json = Json(Self::to_get(room, client).await?);
        Ok(json)
    }

    async fn to_get(room: Room, client: impl S3Operation) -> Result<Get, Status> {
        let Room {
            id,
            title,
            price,
            city,
            street,
            is_furnished,
            is_pet_friendly,
            description,
            contact_information,
            created_at,
            updated_at,
            s3_keys,
        } = room;
        let mut image_urls: Vec<String> = vec![];
        for key in s3_keys.clone() {
            image_urls.push(client.get_object(key).await?);
        }
        Ok(Get {
            id,
            title,
            price,
            city,
            street,
            is_furnished,
            is_pet_friendly,
            description,
            image_urls,
            contact_information: GetContactInformation {
                email: contact_information.email,
            },
            created_at: created_at.to_string(),
            updated_at: updated_at.to_string(),
        })
    }
}

impl List {
    pub fn generate(rooms: Vec<Room>) -> Json<List> {
        Json(Self::to_list(rooms))
    }

    fn to_list(rooms: Vec<Room>) -> List {
        List {
            rooms: rooms
                .into_iter()
                .map(|room| ListItem {
                    id: room.id,
                    title: room.title,
                    price: room.price,
                    city: room.city,
                    street: room.street,
                    is_furnished: room.is_furnished,
                    is_pet_friendly: room.is_pet_friendly,
                    description: room.description,
                    contact_information: GetContactInformation {
                        email: room.contact_information.email,
                    },
                    created_at: room.created_at.to_string(),
                    updated_at: room.updated_at.to_string(),
                })
                .collect(),
        }
    }
}

#[cfg(test)]
mod tests {
    use chrono::Local;

    use crate::model::room::model::ContactInformation;

    use super::*;

    struct MockS3Client;

    #[rocket::async_trait]
    impl S3Operation for MockS3Client {
        async fn get_object(&self, _key: String) -> Result<String, Status> {
            Ok("object".to_string())
        }

        async fn get_presigned_upload_url(&self, _key: String) -> Result<String, Status> {
            Ok("url".to_string())
        }
    }

    #[tokio::test]
    async fn test_get_room() {
        let room = Room {
            id: "id".to_string(),
            title: "title".to_string(),
            price: 10000,
            city: "city".to_string(),
            street: None,
            is_furnished: true,
            is_pet_friendly: false,
            description: "description".to_string(),
            s3_keys: vec!["key".to_string()],
            contact_information: ContactInformation {
                email: "email".to_string(),
            },
            created_at: Local::now().naive_local(),
            updated_at: Local::now().naive_local(),
        };
        let json = Get::generate(room, MockS3Client {}).await.unwrap();
        assert_eq!(json.id, "id".to_string());
        assert_eq!(json.title, "title".to_string());
        assert_eq!(json.price, 10000);
        assert_eq!(json.city, "city".to_string());
        assert!(json.street.is_none());
        assert!(json.is_furnished);
        assert!(!json.is_pet_friendly);
        assert_eq!(json.image_urls[0], "object".to_string());
        assert_eq!(json.contact_information.email, "email".to_string());
        assert_eq!(json.description, "description".to_string());
        assert!(!json.created_at.to_string().is_empty());
        assert!(!json.updated_at.to_string().is_empty());
    }

    #[test]
    fn test_list_rooms() {
        let room = Room {
            id: "id".to_string(),
            title: "title".to_string(),
            price: 10000,
            city: "city".to_string(),
            street: None,
            is_furnished: true,
            is_pet_friendly: false,
            description: "description".to_string(),
            s3_keys: vec!["key".to_string()],
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

use rocket::{http::Status, serde::json::Json};
use serde::{Deserialize, Serialize};

use crate::{
    model::room::model::{AddressComponent, Room},
    utils::s3::S3Operation,
};

#[derive(Serialize, Deserialize)]
pub struct Get {
    pub id: String,
    title: String,
    price: i32,
    city: Option<String>,
    place_id: String,
    formatted_address: String,
    is_furnished: bool,
    is_pet_friendly: bool,
    description: String,
    image_urls: Vec<String>,
    email: String,
    user_id: String,
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
            place_id,
            formatted_address,
            address_components,
            is_furnished,
            is_pet_friendly,
            description,
            email,
            created_at,
            updated_at,
            s3_keys,
            user_id,
        } = room;
        let mut image_urls: Vec<String> = vec![];
        for key in s3_keys.clone() {
            image_urls.push(client.get_object(key).await?);
        }
        let city = extract_city(address_components.to_vec());
        Ok(Get {
            id: id.to_string(),
            title,
            price,
            place_id,
            formatted_address,
            city,
            is_furnished,
            is_pet_friendly,
            description,
            image_urls,
            email,
            user_id: user_id.to_string(),
            created_at: created_at.to_string(),
            updated_at: updated_at.to_string(),
        })
    }
}

pub mod private {
    use rocket::{http::Status, serde::json::Json};
    use serde::{Deserialize, Serialize};

    use crate::{model::room::model::Room, utils::s3::S3Operation};

    use super::extract_city;

    #[derive(Serialize, Deserialize)]
    pub struct List {
        pub rooms: Vec<ListItem>,
    }

    #[derive(Serialize, Deserialize)]
    pub struct ListItem {
        pub id: String,
        pub title: String,
        pub price: i32,
        pub city: Option<String>,
        pub place_id: String,
        pub formatted_address: String,
        pub is_furnished: bool,
        pub is_pet_friendly: bool,
        pub description: String,
        pub thumbnail_url: Option<String>,
        pub email: String,
        pub user_id: String,
        pub created_at: String,
        pub updated_at: String,
    }

    impl List {
        pub async fn generate(
            rooms: Vec<Room>,
            client: impl S3Operation,
        ) -> Result<Json<List>, Status> {
            let json = Json(Self::to_list(rooms, client).await?);
            Ok(json)
        }

        async fn to_list(rooms: Vec<Room>, client: impl S3Operation) -> Result<List, Status> {
            let mut list_items: Vec<ListItem> = Vec::new();
            for room in rooms {
                let key = room.s3_keys.first().map(|key| key.to_string());
                let thumbnail_url = match key {
                    Some(key) => Some(client.get_object(key).await?),
                    None => None,
                };
                let city = extract_city(room.address_components.to_vec());
                let item = ListItem {
                    id: room.id.to_string(),
                    title: room.title,
                    price: room.price,
                    city,
                    place_id: room.place_id,
                    formatted_address: room.formatted_address,
                    is_furnished: room.is_furnished,
                    is_pet_friendly: room.is_pet_friendly,
                    description: room.description,
                    email: room.email,
                    thumbnail_url,
                    user_id: room.user_id.to_string(),
                    created_at: room.created_at.to_string(),
                    updated_at: room.updated_at.to_string(),
                };
                list_items.push(item);
            }
            Ok(List { rooms: list_items })
        }
    }
}

pub mod public {
    use rocket::{http::Status, serde::json::Json};
    use serde::{Deserialize, Serialize};

    use crate::{model::room::model::ListRoom, utils::s3::S3Operation};

    use super::extract_city;

    #[derive(Serialize, Deserialize)]
    pub struct List {
        pub count: i64,
        pub rooms: Vec<ListItem>,
    }

    #[derive(Serialize, Deserialize)]
    pub struct ListItem {
        pub id: String,
        pub title: String,
        pub price: i32,
        pub city: Option<String>,
        pub place_id: String,
        pub formatted_address: String,
        pub is_furnished: bool,
        pub is_pet_friendly: bool,
        pub description: String,
        pub thumbnail_url: Option<String>,
        pub is_favorite: bool,
        pub email: String,
        pub user_id: String,
        pub created_at: String,
        pub updated_at: String,
    }

    impl List {
        pub async fn generate(
            rooms: Vec<ListRoom>,
            client: impl S3Operation,
        ) -> Result<Json<List>, Status> {
            let json = Json(Self::to_list(rooms, client).await?);
            Ok(json)
        }

        async fn to_list(rooms: Vec<ListRoom>, client: impl S3Operation) -> Result<List, Status> {
            let mut list_items: Vec<ListItem> = Vec::new();
            for room in rooms.clone() {
                let key = room.s3_keys.first().map(|key| key.to_string());
                let thumbnail_url = match key {
                    Some(key) => Some(client.get_object(key).await?),
                    None => None,
                };
                let city = extract_city(room.address_components.to_vec());
                let item = ListItem {
                    id: room.id.to_string(),
                    title: room.title,
                    price: room.price,
                    city,
                    place_id: room.place_id,
                    formatted_address: room.formatted_address,
                    is_furnished: room.is_furnished,
                    is_pet_friendly: room.is_pet_friendly,
                    description: room.description,
                    email: room.email,
                    thumbnail_url,
                    user_id: room.user_id.to_string(),
                    is_favorite: room.is_favorite,
                    created_at: room.created_at.to_string(),
                    updated_at: room.updated_at.to_string(),
                };
                list_items.push(item);
            }
            let count = rooms.get(0).map(|room| room.count).unwrap_or(0);
            Ok(List {
                rooms: list_items,
                count,
            })
        }
    }
}

fn extract_city(address_components: Vec<AddressComponent>) -> Option<String> {
    address_components.into_iter().find_map(|component| {
        if component.types.contains(&"locality".to_string()) {
            Some(component.long_name)
        } else {
            None
        }
    })
}

#[cfg(test)]
mod tests {
    use chrono::Utc;
    use sqlx::types::Json;
    use uuid::Uuid;

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
        let id = Uuid::new_v4();
        let user_id = Uuid::new_v4();
        let address_components: Json<Vec<AddressComponent>> = serde_json::from_str(
            r#"
                [
                    {
                        "long_name": "city",
                        "short_name": "city",
                        "types": [
                            "locality"
                        ]
                    }
                ]
                "#,
        )
        .unwrap();
        let room = Room {
            id,
            title: "title".to_string(),
            price: 10000,
            place_id: "place_id".to_string(),
            formatted_address: "formatted_address".to_string(),
            address_components,
            is_furnished: true,
            is_pet_friendly: false,
            description: "description".to_string(),
            s3_keys: vec!["key".to_string()],
            email: "email".to_string(),
            user_id,
            created_at: Utc::now(),
            updated_at: Utc::now(),
        };
        let json = Get::generate(room, MockS3Client {}).await.unwrap();
        assert_eq!(json.id, id.to_string());
        assert_eq!(json.title, "title".to_string());
        assert_eq!(json.price, 10000);
        assert_eq!(json.city, Some("city".to_string()));
        assert_eq!(json.place_id, "place_id".to_string());
        assert_eq!(json.formatted_address, "formatted_address".to_string());
        assert!(json.is_furnished);
        assert!(!json.is_pet_friendly);
        assert_eq!(json.image_urls[0], "object".to_string());
        assert_eq!(json.email, "email".to_string());
        assert_eq!(json.description, "description".to_string());
        assert_eq!(json.user_id, user_id.to_string());
        assert!(!json.created_at.to_string().is_empty());
        assert!(!json.updated_at.to_string().is_empty());
    }

    mod public {
        use crate::{model::room::model::ListRoom, view::room::public::List};

        use super::*;

        #[tokio::test]
        async fn test_list_rooms() {
            let id = Uuid::new_v4();
            let user_id = Uuid::new_v4();
            let address_components: Json<Vec<AddressComponent>> = serde_json::from_str(
                r#"
                [
                    {
                        "long_name": "city",
                        "short_name": "city",
                        "types": [
                            "locality"
                        ]
                    }
                ]
                "#,
            )
            .unwrap();
            let room = ListRoom {
                id,
                title: "title".to_string(),
                price: 10000,
                place_id: "place_id".to_string(),
                formatted_address: "formatted_address".to_string(),
                address_components,
                is_furnished: true,
                is_pet_friendly: false,
                description: "description".to_string(),
                s3_keys: vec!["key".to_string()],
                email: "email".to_string(),
                user_id,
                is_favorite: true,
                created_at: Utc::now(),
                updated_at: Utc::now(),
                count: 1,
            };
            let json = List::generate(vec![room], MockS3Client {}).await.unwrap();
            assert_eq!(json.rooms.len(), 1);
            assert_eq!(json.count, 1);

            let room = &json.rooms[0];
            assert_eq!(room.id, id.to_string());
            assert_eq!(room.title, "title".to_string());
            assert_eq!(room.price, 10000);
            assert_eq!(room.city, Some("city".to_string()));
            assert_eq!(room.place_id, "place_id".to_string());
            assert_eq!(room.formatted_address, "formatted_address".to_string());
            assert!(room.is_furnished);
            assert!(!room.is_pet_friendly);
            assert_eq!(room.thumbnail_url.as_ref().unwrap(), "object");
            assert_eq!(room.email, "email".to_string());
            assert_eq!(room.description, "description".to_string());
            assert_eq!(room.user_id, user_id.to_string());
            assert!(room.is_favorite);
            assert!(!room.created_at.to_string().is_empty());
            assert!(!room.updated_at.to_string().is_empty());
        }
    }

    mod private {
        use crate::{model::room::model::Room, view::room::private::List};

        use super::*;

        #[tokio::test]
        async fn test_list_rooms() {
            let id = Uuid::new_v4();
            let user_id = Uuid::new_v4();
            let address_components: Json<Vec<AddressComponent>> = serde_json::from_str(
                r#"
                [
                    {
                        "long_name": "city",
                        "short_name": "city",
                        "types": [
                            "locality"
                        ]
                    }
                ]
                "#,
            )
            .unwrap();
            let room = Room {
                id,
                title: "title".to_string(),
                price: 10000,
                place_id: "place_id".to_string(),
                formatted_address: "formatted_address".to_string(),
                address_components,
                is_furnished: true,
                is_pet_friendly: false,
                description: "description".to_string(),
                s3_keys: vec!["key".to_string()],
                email: "email".to_string(),
                user_id,
                created_at: Utc::now(),
                updated_at: Utc::now(),
            };
            let json = List::generate(vec![room], MockS3Client {}).await.unwrap();
            assert_eq!(json.rooms.len(), 1);

            let room = &json.rooms[0];
            assert_eq!(room.id, id.to_string());
            assert_eq!(room.title, "title".to_string());
            assert_eq!(room.price, 10000);
            assert_eq!(room.city, Some("city".to_string()));
            assert_eq!(room.place_id, "place_id".to_string());
            assert_eq!(room.formatted_address, "formatted_address".to_string());
            assert!(room.is_furnished);
            assert!(!room.is_pet_friendly);
            assert_eq!(room.thumbnail_url.as_ref().unwrap(), "object");
            assert_eq!(room.email, "email".to_string());
            assert_eq!(room.description, "description".to_string());
            assert_eq!(room.user_id, user_id.to_string());
            assert!(!room.created_at.to_string().is_empty());
            assert!(!room.updated_at.to_string().is_empty());
        }
    }
}

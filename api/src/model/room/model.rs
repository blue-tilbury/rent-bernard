use chrono::{Local, NaiveDateTime};
use serde::{Deserialize, Serialize};

use crate::{fairing::db::DB, model::IdConverter};

use super::{RoomResource, UpdateRoomResource, TABLE_NAME};

#[derive(Deserialize)]
pub struct Room {
    pub id: String,
    pub title: String,
    pub price: i64,
    pub area: String,
    pub street: Option<String>,
    pub is_furnished: bool,
    pub is_pet_friendly: bool,
    pub description: String,
    pub images: Vec<Image>,
    pub contact_information: ContactInformation,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Default)]
pub struct CreateRoom {
    pub title: String,
    pub price: i64,
    pub area: String,
    pub street: Option<String>,
    pub is_furnished: bool,
    pub is_pet_friendly: bool,
    pub description: String,
    pub images: Vec<Image>,
    pub contact_information: ContactInformation,
}

#[derive(Default)]
pub struct UpdateRoom {
    pub id: String,
    pub title: String,
    pub price: i64,
    pub area: String,
    pub street: Option<String>,
    pub is_furnished: bool,
    pub is_pet_friendly: bool,
    pub description: String,
    pub images: Vec<Image>,
    pub contact_information: ContactInformation,
}

#[derive(Default, Serialize, Deserialize, Clone)]
pub struct Image {
    pub url: String,
}

#[derive(Default, Serialize, Deserialize, Clone)]
pub struct ContactInformation {
    pub email: String,
}

impl Room {
    pub async fn create(db: &DB, room: CreateRoom) -> Result<Room, surrealdb::Error> {
        let room = db
            .create(TABLE_NAME)
            .content(RoomResource {
                id: None,
                title: room.title,
                price: room.price,
                area: room.area,
                street: room.street,
                is_furnished: room.is_furnished,
                is_pet_friendly: room.is_pet_friendly,
                description: room.description,
                images: room.images,
                contact_information: room.contact_information,
                created_at: Local::now().naive_local(),
                updated_at: Local::now().naive_local(),
            })
            .await?;
        Ok(Self::to_raw_id(room))
    }

    pub async fn get(db: &DB, id: String) -> Result<Option<Room>, surrealdb::Error> {
        let room: Option<RoomResource> = db.select((TABLE_NAME, id)).await?;
        match room {
            Some(room) => Ok(Some(Self::to_raw_id(room))),
            None => Ok(None),
        }
    }
    pub async fn list(db: &DB) -> Result<Vec<Room>, surrealdb::Error> {
        let rooms: Vec<RoomResource> = db.select(TABLE_NAME).await?;
        Ok(rooms.into_iter().map(Self::to_raw_id).collect())
    }

    pub async fn update(db: &DB, room: UpdateRoom) -> Result<Room, surrealdb::Error> {
        let updated_room: RoomResource = db
            .update((TABLE_NAME, room.id))
            .merge(UpdateRoomResource {
                title: room.title,
                price: room.price,
                area: room.area,
                street: room.street,
                is_furnished: room.is_furnished,
                is_pet_friendly: room.is_pet_friendly,
                description: room.description,
                images: room.images,
                contact_information: room.contact_information,
                updated_at: Local::now().naive_local(),
            })
            .await?;
        Ok(Self::to_raw_id(updated_room))
    }

    pub async fn delete(db: &DB, id: String) -> Result<(), surrealdb::Error> {
        let _: RoomResource = db.delete((TABLE_NAME, id)).await?;
        Ok(())
    }
}

impl IdConverter<RoomResource, Self> for Room {
    fn to_raw_id(room: RoomResource) -> Room {
        let id = room.id.clone().unwrap().id.to_raw();
        Room {
            id,
            title: room.title,
            price: room.price,
            area: room.area,
            street: room.street,
            is_furnished: room.is_furnished,
            is_pet_friendly: room.is_pet_friendly,
            description: room.description,
            images: room.images,
            contact_information: room.contact_information,
            created_at: room.created_at,
            updated_at: room.updated_at,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::{
        fairing::db,
        model::room::factory::tests::{RoomFactory, RoomFactoryParams},
    };

    #[tokio::test]
    async fn test_create() {
        let db = db::TestConnection::setup_db().await;
        let image = Image {
            url: "url".to_string(),
        };
        let params = CreateRoom {
            title: "title".to_string(),
            price: 10000,
            area: "area".to_string(),
            street: None,
            is_furnished: true,
            is_pet_friendly: false,
            images: vec![image],
            contact_information: ContactInformation {
                email: "email".to_string(),
            },
            description: "description".to_string(),
        };

        let result = Room::create(&db, params).await.unwrap();
        assert_eq!(result.title, "title".to_string());
        assert_eq!(result.price, 10000);
        assert_eq!(result.area, "area".to_string());
        assert!(result.street.is_none());
        assert!(result.is_furnished);
        assert!(!result.is_pet_friendly);
        assert_eq!(result.images[0].url, "url".to_string());
        assert_eq!(result.contact_information.email, "email".to_string());
        assert_eq!(result.description, "description".to_string());
    }

    #[tokio::test]
    async fn test_get() {
        let db = db::TestConnection::setup_db().await;
        let image = Image {
            url: "url".to_string(),
        };
        let params = RoomFactoryParams {
            id: None,
            title: Some("title".to_string()),
            price: Some(10000),
            area: Some("area".to_string()),
            street: None,
            is_furnished: Some(true),
            is_pet_friendly: Some(false),
            images: Some(vec![image]),
            contact_information: Some(ContactInformation {
                email: "email".to_string(),
            }),
            description: Some("description".to_string()),
        };
        let Room { id, .. } = RoomFactory::create(&db, params).await;

        let result = Room::get(&db, id).await.unwrap().unwrap();
        assert!(!result.id.is_empty());
        assert_eq!(result.title, "title".to_string());
        assert_eq!(result.price, 10000);
        assert_eq!(result.area, "area".to_string());
        assert!(result.street.is_none());
        assert!(result.is_furnished);
        assert!(!result.is_pet_friendly);
        assert_eq!(result.images[0].url, "url".to_string());
        assert_eq!(result.description, "description".to_string());
        assert_eq!(result.contact_information.email, "email".to_string());
        assert!(!result.created_at.to_string().is_empty());
        assert!(!result.updated_at.to_string().is_empty());
    }

    #[tokio::test]
    async fn test_list() {
        let db = db::TestConnection::setup_db().await;
        let image = Image {
            url: "url".to_string(),
        };
        let params = RoomFactoryParams {
            id: None,
            title: Some("title".to_string()),
            price: Some(10000),
            area: Some("area".to_string()),
            street: None,
            is_furnished: Some(true),
            is_pet_friendly: Some(false),
            images: Some(vec![image]),
            contact_information: Some(ContactInformation {
                email: "email".to_string(),
            }),
            description: Some("description".to_string()),
        };
        RoomFactory::create_many(&db, params, 3).await;

        let result = Room::list(&db).await.unwrap();
        assert_eq!(result.len(), 3);
    }

    #[tokio::test]
    async fn test_update() {
        let db = db::TestConnection::setup_db().await;
        let image = Image {
            url: "url".to_string(),
        };
        let params = RoomFactoryParams {
            title: Some("title".to_string()),
            images: Some(vec![image]),
            contact_information: Some(ContactInformation {
                email: "email".to_string(),
            }),
            ..Default::default()
        };
        let room = RoomFactory::create(&db, params).await;

        let new_image = Image {
            url: "new_url".to_string(),
        };
        let new_params = UpdateRoom {
            id: room.id,
            title: "new_title".to_string(),
            images: vec![new_image],
            contact_information: ContactInformation {
                email: "new_email".to_string(),
            },
            ..Default::default()
        };
        let result = Room::update(&db, new_params).await.unwrap();
        assert_eq!(result.title, "new_title".to_string());
        assert_eq!(result.images[0].url, "new_url".to_string());
        assert_eq!(result.images.len(), 1);
        assert_eq!(result.contact_information.email, "new_email".to_string());
    }

    #[tokio::test]
    async fn test_delete() {
        let db = db::TestConnection::setup_db().await;
        let image = Image {
            url: "url".to_string(),
        };
        let params = RoomFactoryParams {
            title: Some("title".to_string()),
            images: Some(vec![image]),
            contact_information: Some(ContactInformation {
                email: "email".to_string(),
            }),
            ..Default::default()
        };
        let Room { id, .. } = RoomFactory::create(&db, params).await;
        let result = Room::delete(&db, id).await;
        assert!(result.is_ok());
    }
}

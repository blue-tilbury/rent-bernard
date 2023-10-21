use std::collections::HashMap;

use chrono::NaiveDateTime;
use sqlx::{FromRow, PgPool, Row};
use uuid::Uuid;

#[derive(Debug, Clone)]
pub struct Room {
    pub id: Uuid,
    pub title: String,
    pub price: i32,
    pub city: String,
    pub street: Option<String>,
    pub is_furnished: bool,
    pub is_pet_friendly: bool,
    pub description: String,
    pub s3_keys: Vec<String>,
    pub email: String,
    pub user_id: Uuid,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Default)]
pub struct CreateRoom {
    pub title: String,
    pub price: i32,
    pub city: String,
    pub street: Option<String>,
    pub is_furnished: bool,
    pub is_pet_friendly: bool,
    pub description: String,
    pub email: String,
    pub user_id: Uuid,
}

#[derive(Default)]
pub struct UpdateRoom {
    pub id: Uuid,
    pub title: String,
    pub price: i32,
    pub city: String,
    pub street: Option<String>,
    pub is_furnished: bool,
    pub is_pet_friendly: bool,
    pub description: String,
    pub email: String,
}

#[derive(FromRow, Clone)]
struct RoomRow {
    id: Uuid,
    title: String,
    price: i32,
    city: String,
    street: Option<String>,
    is_furnished: bool,
    is_pet_friendly: bool,
    description: String,
    s3_key: Option<String>,
    email: String,
    user_id: Uuid,
    created_at: NaiveDateTime,
    updated_at: NaiveDateTime,
}

impl Room {
    pub async fn create(db: &PgPool, room: CreateRoom) -> Result<Uuid, sqlx::Error> {
        let rec = sqlx::query(
            r#"
                INSERT INTO rooms (
                    title, price, city, street, is_furnished, is_pet_friendly, description, email, user_id
                )
                VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9 )
                RETURNING id
            "#,
        )
        .bind(room.title)
        .bind(room.price)
        .bind(room.city)
        .bind(room.street)
        .bind(room.is_furnished)
        .bind(room.is_pet_friendly)
        .bind(room.description)
        .bind(room.email)
        .bind(room.user_id)
        .fetch_one(db)
        .await?;
        rec.try_get("id")
    }

    pub async fn get(db: &PgPool, id: String) -> Result<Option<Room>, sqlx::Error> {
        let uuid = match Uuid::parse_str(&id) {
            Ok(uuid) => uuid,
            Err(_) => return Ok(None),
        };
        let rec: Vec<RoomRow> = sqlx::query_as(
            r#"
                SELECT r.*, ri.s3_key FROM rooms r
                LEFT OUTER JOIN room_images ri ON r.id = ri.room_id
                WHERE r.id = $1
            "#,
        )
        .bind(uuid)
        .fetch_all(db)
        .await?;
        Ok(Self::rows_to_room(rec))
    }

    pub async fn list(db: &PgPool) -> Result<Vec<Room>, sqlx::Error> {
        let rec: Vec<RoomRow> = sqlx::query_as(
            r#"
                SELECT r.*, ri.s3_key FROM rooms r
                LEFT OUTER JOIN room_images ri ON r.id = ri.room_id
            "#,
        )
        .fetch_all(db)
        .await?;
        Ok(Self::rows_to_rooms(rec))
    }

    pub async fn filter_by_user(db: &PgPool, user_id: Uuid) -> Result<Vec<Room>, sqlx::Error> {
        let rec: Vec<RoomRow> = sqlx::query_as(
            r#"
                SELECT r.*, ri.s3_key FROM rooms r
                LEFT OUTER JOIN room_images ri ON r.id = ri.room_id
                WHERE user_id = $1
            "#,
        )
        .bind(user_id)
        .fetch_all(db)
        .await?;
        Ok(Self::rows_to_rooms(rec))
    }

    pub async fn update(db: &PgPool, room: UpdateRoom) -> Result<Option<()>, sqlx::Error> {
        let rec = sqlx::query(
            r#"
                UPDATE rooms
                SET title = $1, price = $2, city = $3, street = $4, is_furnished = $5, is_pet_friendly = $6, description = $7
                WHERE id = $8
            "#
        )
        .bind(room.title)
        .bind(room.price)
        .bind(room.city)
        .bind(room.street)
        .bind(room.is_furnished)
        .bind(room.is_pet_friendly)
        .bind(room.description)
        .bind(room.id)
        .execute(db)
        .await?;
        match rec.rows_affected() {
            0 => Ok(None),
            _ => Ok(Some(())),
        }
    }

    pub async fn delete(db: &PgPool, id: String) -> Result<Option<()>, sqlx::Error> {
        let uuid = match Uuid::parse_str(&id) {
            Ok(uuid) => uuid,
            Err(_) => return Ok(None),
        };
        let rec = sqlx::query(r#"DELETE FROM rooms WHERE id = $1"#)
            .bind(uuid)
            .execute(db)
            .await?;
        match rec.rows_affected() {
            0 => Ok(None),
            _ => Ok(Some(())),
        }
    }

    fn rows_to_room(rows: Vec<RoomRow>) -> Option<Room> {
        rows.get(0).map(|row| Room {
            id: row.id,
            title: row.title.clone(),
            price: row.price,
            city: row.city.clone(),
            street: row.street.clone(),
            is_furnished: row.is_furnished,
            is_pet_friendly: row.is_pet_friendly,
            description: row.description.clone(),
            s3_keys: rows.iter().filter_map(|r| r.s3_key.clone()).collect(),
            email: row.email.clone(),
            user_id: row.user_id,
            created_at: row.created_at,
            updated_at: row.updated_at,
        })
    }

    fn rows_to_rooms(rows: Vec<RoomRow>) -> Vec<Room> {
        let mut hashmap = HashMap::<Uuid, Vec<RoomRow>>::new();
        for row in rows {
            match hashmap.get_mut(&row.id) {
                Some(v) => v.push(row),
                None => {
                    hashmap.insert(row.id, vec![row]);
                }
            }
        }
        hashmap
            .values()
            .cloned()
            .filter_map(Self::rows_to_room)
            .collect()
    }
}

#[cfg(test)]
mod tests {
    use fake::{Fake, Faker};

    use super::*;
    use crate::{
        fairing::db::tests::TestConnection,
        model::{
            room::factory::tests::{RoomFactory, RoomFactoryParams},
            room_image::factory::tests::{RoomImageFactory, RoomImageFactoryParams},
            user::factory::tests::UserFactory,
        },
    };

    #[tokio::test]
    async fn test_create() {
        let db = TestConnection::new().await;
        let user_id = UserFactory::create(&db.pool, Faker.fake()).await;
        let params = CreateRoom {
            title: "title".to_string(),
            price: 10000,
            city: "city".to_string(),
            street: None,
            is_furnished: true,
            is_pet_friendly: false,
            email: "email".to_string(),
            description: "description".to_string(),
            user_id,
        };

        assert!(Room::create(&db.pool, params).await.is_ok());
    }

    #[tokio::test]
    async fn test_get() {
        let db = TestConnection::new().await;
        let user_id = UserFactory::create(&db.pool, Faker.fake()).await;
        let params = RoomFactoryParams {
            title: "title".to_string(),
            price: 10000,
            city: "city".to_string(),
            street: None,
            is_furnished: true,
            is_pet_friendly: false,
            email: "email".to_string(),
            description: "description".to_string(),
            user_id: Some(user_id),
        };
        let id = RoomFactory::create(&db.pool, params).await;
        let room_image_params = RoomImageFactoryParams {
            room_id: id,
            ..Faker.fake()
        };
        RoomImageFactory::create_many(&db.pool, room_image_params, 2).await;
        let result = Room::get(&db.pool, id.to_string()).await.unwrap().unwrap();
        assert!(!result.id.to_string().is_empty());
        assert_eq!(result.title, "title".to_string());
        assert_eq!(result.price, 10000);
        assert_eq!(result.city, "city".to_string());
        assert!(result.street.is_none());
        assert!(result.is_furnished);
        assert!(!result.is_pet_friendly);
        assert_eq!(result.s3_keys.len(), 2);
        assert_eq!(result.description, "description".to_string());
        assert_eq!(result.email, "email".to_string());
        assert_eq!(result.user_id, user_id);
        assert!(!result.created_at.to_string().is_empty());
        assert!(!result.updated_at.to_string().is_empty());
    }

    #[tokio::test]
    async fn test_get_not_found() {
        let db = TestConnection::new().await;
        let id = "random_id".to_string();
        let result = Room::get(&db.pool, id).await.unwrap();
        assert!(result.is_none());
    }

    #[tokio::test]
    async fn test_list() {
        let db = TestConnection::new().await;
        let user_id1 = UserFactory::create(&db.pool, Faker.fake()).await;
        let id1 = RoomFactory::create(
            &db.pool,
            RoomFactoryParams {
                user_id: Some(user_id1),
                ..Faker.fake()
            },
        )
        .await;
        let user_id2 = UserFactory::create(&db.pool, Faker.fake()).await;
        RoomFactory::create(
            &db.pool,
            RoomFactoryParams {
                user_id: Some(user_id2),
                ..Faker.fake()
            },
        )
        .await;
        RoomImageFactory::create_many(
            &db.pool,
            RoomImageFactoryParams {
                room_id: id1,
                ..Faker.fake()
            },
            2,
        )
        .await;

        let result = Room::list(&db.pool).await.unwrap();
        assert_eq!(result.len(), 2);
    }

    #[tokio::test]
    async fn test_filter_by_user() {
        let db = TestConnection::new().await;
        let user_id1 = UserFactory::create(&db.pool, Faker.fake()).await;
        let id1 = RoomFactory::create(
            &db.pool,
            RoomFactoryParams {
                user_id: Some(user_id1),
                ..Faker.fake()
            },
        )
        .await;
        let user_id2 = UserFactory::create(&db.pool, Faker.fake()).await;
        RoomFactory::create(
            &db.pool,
            RoomFactoryParams {
                user_id: Some(user_id2),
                ..Faker.fake()
            },
        )
        .await;
        RoomImageFactory::create_many(
            &db.pool,
            RoomImageFactoryParams {
                room_id: id1,
                ..Faker.fake()
            },
            2,
        )
        .await;

        let result = Room::filter_by_user(&db.pool, user_id1).await.unwrap();
        assert_eq!(result.len(), 1);
        assert_eq!(result.get(0).unwrap().user_id, user_id1);
    }

    #[tokio::test]
    async fn test_update() {
        let db = TestConnection::new().await;
        let params = RoomFactoryParams {
            title: "title".to_string(),
            user_id: None,
            ..Faker.fake()
        };
        let id = RoomFactory::create(&db.pool, params.clone()).await;

        let update_room_params = UpdateRoom {
            id,
            title: "new_title".to_string(),
            price: params.price,
            city: params.city,
            street: params.street,
            is_furnished: params.is_furnished,
            is_pet_friendly: params.is_pet_friendly,
            email: params.email,
            description: params.description,
        };
        let result = Room::update(&db.pool, update_room_params).await.unwrap();
        let room = Room::get(&db.pool, id.to_string()).await.unwrap().unwrap();
        assert!(result.is_some());
        assert_eq!(room.title, "new_title".to_string());
    }

    #[tokio::test]
    async fn test_update_not_found() {
        let db = TestConnection::new().await;
        let params = UpdateRoom {
            id: Uuid::new_v4(),
            title: "title".to_string(),
            ..Default::default()
        };
        let result = Room::update(&db.pool, params).await.unwrap();
        assert!(result.is_none());
    }

    #[tokio::test]
    async fn test_delete() {
        let db = TestConnection::new().await;
        let id = RoomFactory::create(
            &db.pool,
            RoomFactoryParams {
                user_id: None,
                ..Faker.fake()
            },
        )
        .await;
        let result = Room::delete(&db.pool, id.to_string()).await.unwrap();
        assert!(result.is_some());
    }

    #[tokio::test]
    async fn test_delete_not_found() {
        let db = TestConnection::new().await;
        let result = Room::delete(&db.pool, "invalid_id".to_string())
            .await
            .unwrap();
        assert!(result.is_none());
    }
}

use chrono::NaiveDateTime;
use sqlx::{PgPool, Postgres, QueryBuilder};
use uuid::Uuid;

pub struct RoomImage {
    pub id: Uuid,
    pub room_id: Uuid,
    pub s3_key: String,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

impl RoomImage {
    pub async fn create_many(
        db: &PgPool,
        room_id: Uuid,
        s3_keys: Vec<String>,
    ) -> Result<(), sqlx::Error> {
        let mut query_builder: QueryBuilder<Postgres> =
            QueryBuilder::new("INSERT INTO room_images ( room_id, s3_key ) ");
        query_builder
            .push_values(s3_keys, |mut builder, key| {
                builder.push_bind(room_id).push_bind(key);
            })
            .build()
            .execute(db)
            .await?;
        Ok(())
    }

    pub async fn delete_many(db: &PgPool, room_id: Uuid) -> Result<(), sqlx::Error> {
        sqlx::query!(r#"DELETE FROM room_images WHERE room_id = $1"#, room_id)
            .execute(db)
            .await?;
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::{
        fairing::db::tests::TestConnection,
        model::{
            room::factory::tests::{RoomFactory, RoomFactoryParams},
            room_image::factory::tests::{RoomImageFactory, RoomImageFactoryParams},
        },
    };

    #[tokio::test]
    async fn test_create_many() {
        let db = TestConnection::new().await;
        let room_id = RoomFactory::create(&db.pool, RoomFactoryParams::default()).await;
        let s3_keys = vec!["key1".to_string(), "key2".to_string()];
        assert!(RoomImage::create_many(&db.pool, room_id, s3_keys)
            .await
            .is_ok());
    }

    #[tokio::test]
    async fn test_delete() {
        let db = TestConnection::new().await;
        let room_id = RoomFactory::create(&db.pool, RoomFactoryParams::default()).await;
        let params = RoomImageFactoryParams {
            room_id,
            s3_key: "key".to_string(),
        };
        RoomImageFactory::create_many(&db.pool, params, 2).await;
        assert!(RoomImage::delete_many(&db.pool, room_id).await.is_ok());
    }
}

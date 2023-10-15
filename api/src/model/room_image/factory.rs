#[cfg(test)]
pub mod tests {
    use sqlx::{PgPool, Row};
    use uuid::Uuid;

    use crate::model::room_image::model::RoomImage;

    #[derive(Default, Clone)]
    pub struct RoomImageFactoryParams {
        pub room_id: Uuid,
        pub s3_key: String,
    }

    pub struct RoomImageFactory {}

    impl RoomImageFactory {
        pub async fn create(db: &PgPool, params: RoomImageFactoryParams) -> RoomImage {
            let rec = sqlx::query(
                r#"
                    INSERT INTO room_images ( room_id, s3_key )
                    VALUES ( $1, $2 )
                    RETURNING *
                "#,
            )
            .bind(params.room_id)
            .bind(params.s3_key)
            .fetch_one(db)
            .await
            .unwrap();
            RoomImage {
                id: rec.try_get("id").unwrap(),
                room_id: rec.try_get("room_id").unwrap(),
                s3_key: rec.try_get("s3_key").unwrap(),
                created_at: rec.try_get("created_at").unwrap(),
                updated_at: rec.try_get("updated_at").unwrap(),
            }
        }

        pub async fn create_many(
            db: &PgPool,
            params: RoomImageFactoryParams,
            number: usize,
        ) -> Vec<RoomImage> {
            let mut images: Vec<RoomImage> = Vec::new();
            for _ in 0..number {
                let image = Self::create(db, params.clone()).await;
                images.push(image)
            }
            images
        }
    }
}

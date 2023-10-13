#[cfg(test)]
pub mod tests {
    use sqlx::PgPool;
    use uuid::Uuid;

    #[derive(Default, Clone)]
    pub struct RoomFactoryParams {
        pub title: String,
        pub price: i32,
        pub city: String,
        pub street: Option<String>,
        pub is_furnished: bool,
        pub is_pet_friendly: bool,
        pub email: String,
        pub description: String,
    }

    pub struct RoomFactory {}

    impl RoomFactory {
        pub async fn create(db: &PgPool, params: RoomFactoryParams) -> Uuid {
            let rec = sqlx::query!(
                r#"
                    INSERT INTO rooms (
                        title, price, city, street, is_furnished, is_pet_friendly, description, email
                    )
                    VALUES ( $1, $2, $3, $4, $5, $6, $7, $8 )
                    RETURNING id
                "#,
                params.title,
                params.price,
                params.city,
                params.street,
                params.is_furnished,
                params.is_pet_friendly,
                params.description,
                params.email,
            )
            .fetch_one(db)
            .await.unwrap();
            rec.id
        }

        pub async fn create_many(
            db: &PgPool,
            params: RoomFactoryParams,
            number: usize,
        ) -> Vec<Uuid> {
            let mut room_ids: Vec<Uuid> = Vec::new();
            for _ in 0..number {
                let room_id = Self::create(db, params.clone()).await;
                room_ids.push(room_id)
            }
            room_ids
        }
    }
}

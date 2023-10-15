#[cfg(test)]
pub mod tests {
    use sqlx::{PgPool, Row};
    use uuid::Uuid;

    use crate::model::user::factory::tests::{UserFactory, UserFactoryParams};

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
        pub user_id: Option<Uuid>,
    }

    pub struct RoomFactory {}

    impl RoomFactory {
        pub async fn create(db: &PgPool, params: RoomFactoryParams) -> Uuid {
            let user_id = match params.user_id {
                Some(user_id) => user_id,
                None => UserFactory::create(&db, UserFactoryParams::default()).await,
            };
            let rec = sqlx::query(
                r#"
                    INSERT INTO rooms (
                        title, price, city, street, is_furnished, is_pet_friendly, description, email, user_id
                    )
                    VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9 )
                    RETURNING id
                "#
            )
            .bind(params.title)
            .bind(params.price)
            .bind(params.city)
            .bind(params.street)
            .bind(params.is_furnished)
            .bind(params.is_pet_friendly)
            .bind(params.description)
            .bind(params.email)
            .bind(user_id)
            .fetch_one(db)
            .await.unwrap();
            rec.try_get("id").unwrap()
        }
    }
}

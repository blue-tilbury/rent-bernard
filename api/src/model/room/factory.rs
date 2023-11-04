#[cfg(test)]
pub mod tests {
    use fake::{Dummy, Fake, Faker};
    use sqlx::{types::Json, PgPool, Row};
    use uuid::Uuid;

    use crate::model::{room::model::AddressComponent, user::factory::tests::UserFactory};

    #[derive(Dummy, Clone)]
    pub struct RoomFactoryParams {
        pub title: String,
        pub price: i32,
        pub longitude: f64,
        pub latitude: f64,
        pub formatted_address: String,
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
                None => UserFactory::create(db, Faker.fake()).await,
            };
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
            let rec = sqlx::query(
                r#"
                    INSERT INTO rooms (
                        title, price, longitude, latitude, formatted_address, address_components, is_furnished, is_pet_friendly, description, email, user_id
                    )
                    VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11 )
                    RETURNING id
                "#
            )
            .bind(params.title)
            .bind(params.price)
            .bind(params.longitude)
            .bind(params.latitude)
            .bind(params.formatted_address)
            .bind(address_components)
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

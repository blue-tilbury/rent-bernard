#[cfg(test)]
pub mod tests {
    use sqlx::{PgPool, Row};
    use uuid::Uuid;

    #[derive(Default, Clone)]
    pub struct UserFactoryParams {
        pub name: String,
        pub email: String,
        pub picture: String,
    }

    pub struct UserFactory {}

    impl UserFactory {
        pub async fn create(db: &PgPool, params: UserFactoryParams) -> Uuid {
            let rec = sqlx::query(
                r#"
                    INSERT INTO users ( name, email, picture )
                    VALUES ( $1, $2, $3 )
                    RETURNING id
                "#,
            )
            .bind(params.name)
            .bind(params.email)
            .bind(params.picture)
            .fetch_one(db)
            .await
            .unwrap();
            rec.try_get("id").unwrap()
        }
    }
}

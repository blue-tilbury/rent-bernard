use chrono::{DateTime, Utc};
use serde::Deserialize;
use sqlx::{PgPool, Row};
use uuid::Uuid;

#[derive(sqlx::FromRow)]
pub struct User {
    pub id: Uuid,
    pub name: String,
    pub email: String,
    pub picture: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Default, Deserialize, Clone)]
pub struct CreateUser {
    pub name: String,
    pub email: String,
    pub picture: String,
}

impl User {
    pub async fn create(db: &PgPool, user: CreateUser) -> Result<Uuid, sqlx::Error> {
        let rec = sqlx::query(
            r#"
                INSERT INTO users ( name, email, picture )
                VALUES ( $1, $2, $3 )
                RETURNING id
            "#,
        )
        .bind(user.name)
        .bind(user.email)
        .bind(user.picture)
        .fetch_one(db)
        .await?;
        rec.try_get("id")
    }

    pub async fn find_by_email(db: &PgPool, email: String) -> Result<Option<User>, sqlx::Error> {
        let rec = sqlx::query_as::<_, User>(
            r#"
                SELECT * FROM users
                WHERE email = $1
            "#,
        )
        .bind(email)
        .fetch_optional(db)
        .await?;
        Ok(rec)
    }

    pub async fn find_by_id(db: &PgPool, id: Uuid) -> Result<Option<User>, sqlx::Error> {
        let rec = sqlx::query_as::<_, User>(
            r#"
                SELECT * FROM users
                WHERE id = $1
            "#,
        )
        .bind(id)
        .fetch_optional(db)
        .await?;
        Ok(rec)
    }
}

#[cfg(test)]
mod tests {
    use fake::{Fake, Faker};

    use super::*;
    use crate::{
        fairing::db::tests::TestConnection,
        model::user::factory::tests::{UserFactory, UserFactoryParams},
    };

    #[tokio::test]
    async fn test_create() {
        let mut db = TestConnection::new().await;
        let params = CreateUser {
            name: "name".to_string(),
            email: "email".to_string(),
            picture: "picture".to_string(),
        };

        assert!(User::create(&db.pool, params).await.is_ok());
        db.clean_up().await;
    }

    #[tokio::test]
    async fn test_find_by_email() {
        let mut db = TestConnection::new().await;
        let params: UserFactoryParams = Faker.fake();
        let expected_id = UserFactory::create(&db.pool, params.clone()).await;
        let user = User::find_by_email(&db.pool, params.email)
            .await
            .unwrap()
            .unwrap();

        assert_eq!(user.id, expected_id);
        db.clean_up().await;
    }

    #[tokio::test]
    async fn test_find_by_id() {
        let mut db = TestConnection::new().await;
        let params: UserFactoryParams = Faker.fake();
        let id = UserFactory::create(&db.pool, params).await;
        assert!(User::find_by_id(&db.pool, id).await.unwrap().is_some());
        db.clean_up().await;
    }
}

use chrono::NaiveDateTime;
use serde::Deserialize;
use sqlx::{PgPool, Row};
use uuid::Uuid;

#[derive(sqlx::FromRow)]
pub struct User {
    pub id: Uuid,
    pub name: String,
    pub email: String,
    pub picture: String,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
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
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::fairing::db::tests::TestConnection;

    #[tokio::test]
    async fn test_create() {
        let db = TestConnection::new().await;
        let params = CreateUser {
            name: "name".to_string(),
            email: "email".to_string(),
            picture: "picture".to_string(),
        };

        assert!(User::create(&db.pool, params).await.is_ok());
    }
}

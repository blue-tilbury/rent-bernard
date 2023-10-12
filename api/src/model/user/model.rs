use chrono::{DateTime, Utc};
use serde::Deserialize;
use sqlx::PgPool;
use uuid::Uuid;

pub struct User {
    pub id: Uuid,
    pub name: String,
    pub email: String,
    pub picture: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Default, Deserialize)]
pub struct CreateUser {
    pub name: String,
    pub email: String,
    pub picture: String,
}

impl User {
    pub async fn create(db: &PgPool, user: CreateUser) -> Result<Uuid, sqlx::Error> {
        let rec = sqlx::query!(
            r#"
                INSERT INTO users ( name, email, picture )
                VALUES ( $1, $2, $3 )
                RETURNING id
            "#,
            user.name,
            user.email,
            user.picture
        )
        .fetch_one(db)
        .await?;
        Ok(rec.id)
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

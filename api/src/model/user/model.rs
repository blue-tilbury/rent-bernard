use chrono::{Local, NaiveDateTime};
use serde::Deserialize;

use crate::{fairing::db::DBClient, model::IdConverter};

use super::{UserResource, TABLE_NAME};

#[derive(Deserialize)]
pub struct User {
    pub id: String,
    pub name: String,
    pub email: String,
    pub picture: String,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Default, Deserialize)]
pub struct CreateUser {
    pub name: String,
    pub email: String,
    pub picture: String,
}

impl User {
    pub async fn create(db: &DBClient, user: CreateUser) -> Result<User, surrealdb::Error> {
        let user = db
            .create(TABLE_NAME)
            .content(UserResource {
                id: None,
                name: user.name,
                email: user.email,
                picture: user.picture,
                created_at: Local::now().naive_local(),
                updated_at: Local::now().naive_local(),
            })
            .await?;
        Ok(Self::to_raw_id(user))
    }
}

impl IdConverter<UserResource, Self> for User {
    fn to_raw_id(user: UserResource) -> User {
        let id = user.id.clone().unwrap().id.to_raw();
        User {
            id,
            name: user.name,
            email: user.email,
            picture: user.picture,
            created_at: user.created_at,
            updated_at: user.updated_at,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::fairing::db;

    #[tokio::test]
    async fn test_create() {
        let db = db::TestConnection::setup_db().await;
        let params = CreateUser {
            name: "name".to_string(),
            email: "email".to_string(),
            picture: "picture".to_string(),
        };

        let result = User::create(&db, params).await.unwrap();
        assert_eq!(result.name, "name".to_string());
        assert_eq!(result.email, "email".to_string());
        assert_eq!(result.picture, "picture".to_string());
    }
}

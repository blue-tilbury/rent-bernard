use chrono::NaiveDateTime;
use sqlx::PgPool;
use uuid::Uuid;

pub struct Wishlist {
    pub id: Uuid,
    pub room_id: Uuid,
    pub user_id: Uuid,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

impl Wishlist {
    pub async fn create(db: &PgPool, room_id: Uuid, user_id: Uuid) -> Result<(), sqlx::Error> {
        sqlx::query(r#"INSERT INTO wishlists ( room_id, user_id ) VALUES ( $1, $2 )"#)
            .bind(room_id)
            .bind(user_id)
            .execute(db)
            .await?;
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use fake::{Fake, Faker};

    use super::*;
    use crate::{
        fairing::db::tests::TestConnection,
        model::{
            room::factory::tests::{RoomFactory, RoomFactoryParams},
            user::factory::tests::UserFactory,
        },
    };

    #[tokio::test]
    async fn test_create() {
        let db = TestConnection::new().await;
        let room_id = RoomFactory::create(
            &db.pool,
            RoomFactoryParams {
                user_id: None,
                ..Faker.fake()
            },
        )
        .await;
        let user_id = UserFactory::create(&db.pool, Faker.fake()).await;
        assert!(Wishlist::create(&db.pool, room_id, user_id).await.is_ok());
    }
}

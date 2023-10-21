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

    pub async fn delete(db: &PgPool, room_id: Uuid, user_id: Uuid) -> Result<(), sqlx::Error> {
        sqlx::query(r#"DELETE FROM wishlists WHERE room_id = $1 AND user_id = $2"#)
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
            wishlist::factory::tests::{WishlistFactory, WishlistFactoryParams},
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

    #[tokio::test]
    async fn test_delete() {
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
        WishlistFactory::create(&db.pool, WishlistFactoryParams { room_id, user_id }).await;
        assert!(Wishlist::delete(&db.pool, room_id, user_id).await.is_ok());
    }
}

#[cfg(test)]
pub mod tests {
    use fake::Dummy;
    use sqlx::PgPool;
    use uuid::Uuid;

    #[derive(Dummy, Clone)]
    pub struct WishlistFactoryParams {
        pub user_id: Uuid,
        pub room_id: Uuid,
    }

    pub struct WishlistFactory {}

    impl WishlistFactory {
        pub async fn create(db: &PgPool, params: WishlistFactoryParams) {
            sqlx::query(r#"INSERT INTO wishlists ( room_id, user_id ) VALUES ( $1, $2 )"#)
                .bind(params.room_id)
                .bind(params.user_id)
                .execute(db)
                .await
                .unwrap();
        }
    }
}

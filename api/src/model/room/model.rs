use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::{types::Json, FromRow, PgPool, Postgres, QueryBuilder, Row};
use uuid::Uuid;

use crate::model::Pagination;

#[derive(Debug, Clone, FromRow)]
pub struct Room {
    pub id: Uuid,
    pub title: String,
    pub price: i32,
    pub place_id: String,
    pub formatted_address: String,
    pub address_components: Json<Vec<AddressComponent>>,
    pub is_furnished: bool,
    pub is_pet_friendly: bool,
    pub description: String,
    pub s3_keys: Vec<String>,
    pub email: String,
    pub user_id: Uuid,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, FromRow)]
pub struct ListRoom {
    pub id: Uuid,
    pub title: String,
    pub price: i32,
    pub place_id: String,
    pub formatted_address: String,
    pub address_components: Json<Vec<AddressComponent>>,
    pub is_furnished: bool,
    pub is_pet_friendly: bool,
    pub description: String,
    pub s3_keys: Vec<String>,
    pub email: String,
    pub user_id: Uuid,
    pub is_favorite: bool,
    pub count: i64,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Default)]
pub struct CreateRoom {
    pub title: String,
    pub price: i32,
    pub place_id: String,
    pub formatted_address: String,
    pub address_components: Json<Vec<AddressComponent>>,
    pub is_furnished: bool,
    pub is_pet_friendly: bool,
    pub description: String,
    pub email: String,
    pub user_id: Uuid,
}

#[derive(Default)]
pub struct UpdateRoom {
    pub id: Uuid,
    pub title: String,
    pub price: i32,
    pub place_id: String,
    pub formatted_address: String,
    pub address_components: Json<Vec<AddressComponent>>,
    pub is_furnished: bool,
    pub is_pet_friendly: bool,
    pub description: String,
    pub email: String,
}

#[derive(Debug, Clone, FromRow, Serialize, Deserialize)]
pub struct AddressComponent {
    pub long_name: String,
    pub short_name: String,
    pub types: Vec<String>,
}

#[derive(Debug, PartialEq, FromFormField)]
pub enum SortBy {
    UpdatedAt,
    Price,
}

impl ToString for SortBy {
    fn to_string(&self) -> String {
        match self {
            SortBy::UpdatedAt => "updated_at".to_string(),
            SortBy::Price => "price".to_string(),
        }
    }
}

#[derive(Debug, PartialEq, FromFormField)]
pub enum Order {
    Asc,
    Desc,
}

impl ToString for Order {
    fn to_string(&self) -> String {
        match self {
            Order::Asc => "ASC".to_string(),
            Order::Desc => "DESC".to_string(),
        }
    }
}

#[derive(Default)]
pub struct Filter {
    pub is_furnished: Option<bool>,
    pub is_pet_friendly: Option<bool>,
    pub price_min: Option<i32>,
    pub price_max: Option<i32>,
}

impl Room {
    pub async fn create(db: &PgPool, room: CreateRoom) -> Result<Uuid, sqlx::Error> {
        let rec = sqlx::query(
            r#"
                INSERT INTO rooms (
                    title, price, place_id, formatted_address, address_components, is_furnished, is_pet_friendly, description, email, user_id
                )
                VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10 )
                RETURNING id
            "#,
        )
        .bind(room.title)
        .bind(room.price)
        .bind(room.place_id)
        .bind(room.formatted_address)
        .bind(room.address_components)
        .bind(room.is_furnished)
        .bind(room.is_pet_friendly)
        .bind(room.description)
        .bind(room.email)
        .bind(room.user_id)
        .fetch_one(db)
        .await?;
        rec.try_get("id")
    }

    pub async fn get(db: &PgPool, id: String) -> Result<Option<Room>, sqlx::Error> {
        let uuid = match Uuid::parse_str(&id) {
            Ok(uuid) => uuid,
            Err(_) => return Ok(None),
        };
        let rec: Room = sqlx::query_as(
            r#"
                SELECT r.*, ARRAY_REMOVE(ARRAY_AGG(ri.s3_key), NULL) s3_keys FROM rooms r
                LEFT OUTER JOIN room_images ri ON r.id = ri.room_id
                WHERE r.id = $1
                GROUP BY r.id
            "#,
        )
        .bind(uuid)
        .fetch_one(db)
        .await?;
        Ok(Some(rec))
    }

    pub async fn list(
        db: &PgPool,
        sort_by: Option<SortBy>,
        order: Option<Order>,
        filter: Filter,
        user_id: Option<Uuid>,
        pagination: Pagination,
    ) -> Result<Vec<ListRoom>, sqlx::Error> {
        #[derive(FromRow)]
        struct Record {
            id: Uuid,
            title: String,
            price: i32,
            place_id: String,
            formatted_address: String,
            address_components: Json<Vec<AddressComponent>>,
            is_furnished: bool,
            is_pet_friendly: bool,
            description: String,
            s3_keys: Vec<String>,
            email: String,
            user_id: Uuid,
            wishlist_count: i64,
            count: i64,
            created_at: DateTime<Utc>,
            updated_at: DateTime<Utc>,
        }
        let mut query_builder: QueryBuilder<Postgres> = QueryBuilder::new(
            r#"
                SELECT r.*, ARRAY_REMOVE(ARRAY_AGG(ri.s3_key), NULL) s3_keys, COUNT(w.id) wishlist_count, COUNT(*) OVER() count
                FROM rooms r
                LEFT OUTER JOIN room_images ri ON r.id = ri.room_id
                LEFT OUTER JOIN wishlists w ON r.id = w.room_id
            "#,
        );
        if user_id.is_some() {
            query_builder.push(" AND w.user_id =").push_bind(user_id);
        }
        query_builder.push(" GROUP BY r.id ");
        if filter.is_furnished.is_some()
            || filter.is_pet_friendly.is_some()
            || filter.price_min.is_some()
            || filter.price_max.is_some()
        {
            query_builder.push(" HAVING ");
        }
        let mut separated_by_and = query_builder.separated(" AND ");
        if filter.is_furnished.is_some_and(|is_furnished| is_furnished) {
            separated_by_and.push("r.is_furnished = TRUE");
        }
        if filter
            .is_pet_friendly
            .is_some_and(|is_pet_friendly| is_pet_friendly)
        {
            separated_by_and.push("r.is_pet_friendly = TRUE");
        }
        if let Some(price_min) = filter.price_min {
            separated_by_and
                .push("r.price >=")
                .push_bind_unseparated(price_min);
        }
        if let Some(price_max) = filter.price_max {
            separated_by_and
                .push("r.price <=")
                .push_bind_unseparated(price_max);
        }
        let sort_by = sort_by.unwrap_or(SortBy::UpdatedAt).to_string();
        let order = order.unwrap_or(Order::Desc).to_string();
        query_builder.push(format_args!(" ORDER BY r.{sort_by} {order}, r.id DESC "));
        query_builder.push(pagination.to_sql());
        let rooms = query_builder
            .build_query_as::<Record>()
            .fetch_all(db)
            .await?
            .into_iter()
            .map(|room| ListRoom {
                id: room.id,
                title: room.title,
                price: room.price,
                place_id: room.place_id,
                formatted_address: room.formatted_address,
                address_components: room.address_components,
                is_furnished: room.is_furnished,
                is_pet_friendly: room.is_pet_friendly,
                description: room.description,
                s3_keys: room.s3_keys,
                email: room.email,
                user_id: room.user_id,
                created_at: room.created_at,
                updated_at: room.updated_at,
                is_favorite: if user_id.is_none() {
                    false
                } else {
                    room.wishlist_count == 1
                },
                count: room.count,
            })
            .collect();
        Ok(rooms)
    }

    pub async fn filter_by_user(db: &PgPool, user_id: Uuid) -> Result<Vec<Room>, sqlx::Error> {
        sqlx::query_as(
            r#"
                SELECT r.*, ARRAY_REMOVE(ARRAY_AGG(ri.s3_key), NULL) s3_keys FROM rooms r
                LEFT OUTER JOIN room_images ri ON r.id = ri.room_id
                WHERE user_id = $1
                GROUP BY r.id
                ORDER BY r.updated_at DESC, r.id DESC
            "#,
        )
        .bind(user_id)
        .fetch_all(db)
        .await
    }

    pub async fn get_wishlists(db: &PgPool, user_id: Uuid) -> Result<Vec<Room>, sqlx::Error> {
        sqlx::query_as(
            r#"
                SELECT r.*, ARRAY_REMOVE(ARRAY_AGG(ri.s3_key), NULL) s3_keys FROM rooms r
                INNER JOIN wishlists w ON r.id = w.room_id AND w.user_id = $1
                LEFT OUTER JOIN room_images ri ON r.id = ri.room_id
                GROUP BY r.id
                ORDER BY r.updated_at DESC, r.id DESC
            "#,
        )
        .bind(user_id)
        .fetch_all(db)
        .await
    }

    pub async fn update(db: &PgPool, room: UpdateRoom) -> Result<Option<()>, sqlx::Error> {
        let rec = sqlx::query(
            r#"
                UPDATE rooms
                SET title = $1, price = $2, place_id = $3, formatted_address = $4,
                address_components = $5, is_furnished = $6, is_pet_friendly = $7, description = $8
                WHERE id = $9
            "#,
        )
        .bind(room.title)
        .bind(room.price)
        .bind(room.place_id)
        .bind(room.formatted_address)
        .bind(room.address_components)
        .bind(room.is_furnished)
        .bind(room.is_pet_friendly)
        .bind(room.description)
        .bind(room.id)
        .execute(db)
        .await?;
        match rec.rows_affected() {
            0 => Ok(None),
            _ => Ok(Some(())),
        }
    }

    pub async fn delete(db: &PgPool, id: String) -> Result<Option<()>, sqlx::Error> {
        let uuid = match Uuid::parse_str(&id) {
            Ok(uuid) => uuid,
            Err(_) => return Ok(None),
        };
        let rec = sqlx::query(r#"DELETE FROM rooms WHERE id = $1"#)
            .bind(uuid)
            .execute(db)
            .await?;
        match rec.rows_affected() {
            0 => Ok(None),
            _ => Ok(Some(())),
        }
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
            room_image::factory::tests::{RoomImageFactory, RoomImageFactoryParams},
            user::factory::tests::UserFactory,
            wishlist::factory::tests::{WishlistFactory, WishlistFactoryParams},
        },
    };

    #[tokio::test]
    async fn test_create() {
        let mut db = TestConnection::new().await;
        let user_id = UserFactory::create(&db.pool, Faker.fake()).await;
        let params = CreateRoom {
            title: "title".to_string(),
            price: 10000,
            place_id: "place_id".to_string(),
            formatted_address: "formatted_address".to_string(),
            address_components: Json(vec![]),
            is_furnished: true,
            is_pet_friendly: false,
            email: "email".to_string(),
            description: "description".to_string(),
            user_id,
        };

        assert!(Room::create(&db.pool, params).await.is_ok());
        db.clean_up().await;
    }

    #[tokio::test]
    async fn test_filter_by_user() {
        let mut db = TestConnection::new().await;
        let user_id1 = UserFactory::create(&db.pool, Faker.fake()).await;
        let room_id1 = RoomFactory::create(
            &db.pool,
            RoomFactoryParams {
                user_id: Some(user_id1),
                ..Faker.fake()
            },
        )
        .await;
        let room_id2 = RoomFactory::create(
            &db.pool,
            RoomFactoryParams {
                user_id: Some(user_id1),
                ..Faker.fake()
            },
        )
        .await;
        let user_id2 = UserFactory::create(&db.pool, Faker.fake()).await;
        RoomFactory::create(
            &db.pool,
            RoomFactoryParams {
                user_id: Some(user_id2),
                ..Faker.fake()
            },
        )
        .await;

        let result = Room::filter_by_user(&db.pool, user_id1).await.unwrap();
        assert_eq!(result.len(), 2);
        assert_eq!(result.get(0).unwrap().user_id, user_id1);
        // ORDER BY created_ad DESC
        assert_eq!(result[0].id, room_id2);
        assert_eq!(result[1].id, room_id1);
        db.clean_up().await;
    }

    #[tokio::test]
    async fn test_get_wishlists() {
        let mut db = TestConnection::new().await;
        let login_user_id = UserFactory::create(&db.pool, Faker.fake()).await;
        let room_id1 = RoomFactory::create(
            &db.pool,
            RoomFactoryParams {
                user_id: None,
                ..Faker.fake()
            },
        )
        .await;
        let room_id2 = RoomFactory::create(
            &db.pool,
            RoomFactoryParams {
                user_id: None,
                ..Faker.fake()
            },
        )
        .await;
        WishlistFactory::create(
            &db.pool,
            WishlistFactoryParams {
                user_id: login_user_id,
                room_id: room_id1,
            },
        )
        .await;
        WishlistFactory::create(
            &db.pool,
            WishlistFactoryParams {
                user_id: login_user_id,
                room_id: room_id2,
            },
        )
        .await;

        let result = Room::get_wishlists(&db.pool, login_user_id).await.unwrap();
        assert_eq!(result.len(), 2);
        // ORDER BY created_ad DESC
        assert_eq!(result[0].id, room_id2);
        assert_eq!(result[1].id, room_id1);
        db.clean_up().await;
    }

    #[tokio::test]
    async fn test_update() {
        let mut db = TestConnection::new().await;
        let params = RoomFactoryParams {
            title: "title".to_string(),
            user_id: None,
            ..Faker.fake()
        };
        let id = RoomFactory::create(&db.pool, params.clone()).await;

        let update_room_params = UpdateRoom {
            id,
            title: "new_title".to_string(),
            price: params.price,
            place_id: params.place_id,
            formatted_address: params.formatted_address,
            address_components: Json(vec![]),
            is_furnished: params.is_furnished,
            is_pet_friendly: params.is_pet_friendly,
            email: params.email,
            description: params.description,
        };
        let result = Room::update(&db.pool, update_room_params).await.unwrap();
        let room = Room::get(&db.pool, id.to_string()).await.unwrap().unwrap();
        assert!(result.is_some());
        assert_eq!(room.title, "new_title".to_string());
        db.clean_up().await;
    }

    #[tokio::test]
    async fn test_update_not_found() {
        let mut db = TestConnection::new().await;
        let params = UpdateRoom {
            id: Uuid::new_v4(),
            title: "title".to_string(),
            ..Default::default()
        };
        let result = Room::update(&db.pool, params).await.unwrap();
        assert!(result.is_none());
        db.clean_up().await;
    }

    #[tokio::test]
    async fn test_delete() {
        let mut db = TestConnection::new().await;
        let id = RoomFactory::create(
            &db.pool,
            RoomFactoryParams {
                user_id: None,
                ..Faker.fake()
            },
        )
        .await;
        let result = Room::delete(&db.pool, id.to_string()).await.unwrap();
        assert!(result.is_some());
        db.clean_up().await;
    }

    #[tokio::test]
    async fn test_delete_not_found() {
        let mut db = TestConnection::new().await;
        let result = Room::delete(&db.pool, "invalid_id".to_string())
            .await
            .unwrap();
        assert!(result.is_none());
        db.clean_up().await;
    }

    mod get {
        use super::*;

        #[tokio::test]
        async fn test_get() {
            let mut db = TestConnection::new().await;
            let user_id = UserFactory::create(&db.pool, Faker.fake()).await;
            let params = RoomFactoryParams {
                title: "title".to_string(),
                price: 10000,
                place_id: "place_id".to_string(),
                formatted_address: "formatted_address".to_string(),
                is_furnished: true,
                is_pet_friendly: false,
                email: "email".to_string(),
                description: "description".to_string(),
                user_id: Some(user_id),
            };
            let id = RoomFactory::create(&db.pool, params).await;
            let room_image_params = RoomImageFactoryParams {
                room_id: id,
                ..Faker.fake()
            };
            RoomImageFactory::create_many(&db.pool, room_image_params, 2).await;
            let result = Room::get(&db.pool, id.to_string()).await.unwrap().unwrap();
            assert!(!result.id.to_string().is_empty());
            assert_eq!(result.title, "title".to_string());
            assert_eq!(result.price, 10000);
            assert_eq!(result.place_id, "place_id".to_string());
            assert_eq!(result.formatted_address, "formatted_address".to_string());
            assert_eq!(result.address_components.len(), 1);
            assert!(result.is_furnished);
            assert!(!result.is_pet_friendly);
            assert_eq!(result.s3_keys.len(), 2);
            assert_eq!(result.description, "description".to_string());
            assert_eq!(result.email, "email".to_string());
            assert_eq!(result.user_id, user_id);
            assert!(!result.created_at.to_string().is_empty());
            assert!(!result.updated_at.to_string().is_empty());
            db.clean_up().await;
        }

        #[tokio::test]
        async fn test_get_not_found() {
            let mut db = TestConnection::new().await;
            let id = "random_id".to_string();
            let result = Room::get(&db.pool, id).await.unwrap();
            assert!(result.is_none());
            db.clean_up().await;
        }
    }

    mod list {
        use super::*;

        #[tokio::test]
        async fn test_list_sorted_by_updated_at() {
            let mut db = TestConnection::new().await;
            let room_id1 = RoomFactory::create(
                &db.pool,
                RoomFactoryParams {
                    user_id: None,
                    ..Faker.fake()
                },
            )
            .await;
            let room_id2 = RoomFactory::create(
                &db.pool,
                RoomFactoryParams {
                    user_id: None,
                    ..Faker.fake()
                },
            )
            .await;

            let filter = Filter {
                ..Default::default()
            };
            let result = Room::list(
                &db.pool,
                Some(SortBy::UpdatedAt),
                Some(Order::Desc),
                filter,
                None,
                Pagination::new(None, None),
            )
            .await
            .unwrap();
            assert_eq!(result.len(), 2);
            // ORDER BY updated_at DESC
            assert_eq!(result[0].id, room_id2);
            assert_eq!(result[1].id, room_id1);
            db.clean_up().await;
        }

        #[tokio::test]
        async fn test_list_sorted_by_price() {
            let mut db = TestConnection::new().await;
            let room_id1 = RoomFactory::create(
                &db.pool,
                RoomFactoryParams {
                    user_id: None,
                    price: 1000,
                    ..Faker.fake()
                },
            )
            .await;
            let room_id2 = RoomFactory::create(
                &db.pool,
                RoomFactoryParams {
                    user_id: None,
                    price: 500,
                    ..Faker.fake()
                },
            )
            .await;

            let filter = Filter {
                ..Default::default()
            };
            let result = Room::list(
                &db.pool,
                Some(SortBy::Price),
                Some(Order::Desc),
                filter,
                None,
                Pagination::new(None, None),
            )
            .await
            .unwrap();
            assert_eq!(result.len(), 2);
            // ORDER BY price DESC
            assert_eq!(result[0].id, room_id1);
            assert_eq!(result[1].id, room_id2);
            db.clean_up().await;
        }

        #[tokio::test]
        async fn test_filtered_list() {
            let mut db = TestConnection::new().await;
            RoomFactory::create(
                &db.pool,
                RoomFactoryParams {
                    price: 1000,
                    is_furnished: true,
                    is_pet_friendly: true,
                    user_id: None,
                    ..Faker.fake()
                },
            )
            .await;
            RoomFactory::create(
                &db.pool,
                RoomFactoryParams {
                    price: 500,
                    is_furnished: false,
                    is_pet_friendly: false,
                    user_id: None,
                    ..Faker.fake()
                },
            )
            .await;
            RoomFactory::create(
                &db.pool,
                RoomFactoryParams {
                    price: 1500,
                    is_furnished: true,
                    is_pet_friendly: true,
                    user_id: None,
                    ..Faker.fake()
                },
            )
            .await;

            let filter = Filter {
                is_furnished: Some(true),
                is_pet_friendly: Some(true),
                price_min: Some(800),
                price_max: Some(2000),
            };
            let result = Room::list(
                &db.pool,
                Some(SortBy::Price),
                Some(Order::Desc),
                filter,
                None,
                Pagination::new(None, None),
            )
            .await
            .unwrap();
            assert_eq!(result.len(), 2);
            db.clean_up().await;
        }

        #[tokio::test]
        async fn test_list_pagination() {
            let mut db = TestConnection::new().await;
            RoomFactory::create(
                &db.pool,
                RoomFactoryParams {
                    user_id: None,
                    ..Faker.fake()
                },
            )
            .await;
            RoomFactory::create(
                &db.pool,
                RoomFactoryParams {
                    user_id: None,
                    ..Faker.fake()
                },
            )
            .await;
            let room_id = RoomFactory::create(
                &db.pool,
                RoomFactoryParams {
                    user_id: None,
                    ..Faker.fake()
                },
            )
            .await;

            let filter = Filter {
                ..Default::default()
            };
            let pagination = Pagination {
                page: 0,
                per_page: 1,
            };
            let result = Room::list(&db.pool, None, None, filter, None, pagination)
                .await
                .unwrap();
            assert_eq!(result.len(), 1);
            assert_eq!(result[0].id, room_id);
            assert_eq!(result[0].count, 3);
            db.clean_up().await;
        }

        #[tokio::test]
        async fn test_wishlist() {
            let mut db = TestConnection::new().await;
            let room_id = RoomFactory::create(
                &db.pool,
                RoomFactoryParams {
                    user_id: None,
                    ..Faker.fake()
                },
            )
            .await;
            let login_user_id = UserFactory::create(&db.pool, Faker.fake()).await;
            WishlistFactory::create(&db.pool, {
                WishlistFactoryParams {
                    user_id: login_user_id,
                    room_id,
                }
            })
            .await;

            let filter = Filter {
                ..Default::default()
            };
            let result = Room::list(
                &db.pool,
                None,
                None,
                filter,
                Some(login_user_id),
                Pagination::new(None, None),
            )
            .await
            .unwrap();
            assert_eq!(result.len(), 1);
            assert!(result[0].is_favorite);
            db.clean_up().await;
        }
    }
}

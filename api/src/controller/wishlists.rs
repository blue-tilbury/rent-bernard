pub mod private {
    use rocket::{http::Status, serde::json::Json};
    use uuid::Uuid;

    use crate::{controller::DB, model::wishlist::model::Wishlist, utils::auth::LoginUser};
    use serde::{Deserialize, Serialize};

    #[derive(Serialize, Deserialize)]
    pub struct WishlistParams {
        pub room_id: String,
    }

    #[post("/wishlists", data = "<wishlist>")]
    pub async fn create(wishlist: Json<WishlistParams>, db: &DB, user: LoginUser) -> Status {
        let room_id = match Uuid::parse_str(&wishlist.room_id) {
            Ok(uuid) => uuid,
            Err(_) => return Status::NotFound,
        };
        match Wishlist::create(db, room_id, user.user_id).await {
            Ok(_) => Status::Created,
            Err(_) => Status::InternalServerError,
        }
    }
}

pub mod public {
    use std::env;

    use rocket::{
        http::{CookieJar, Status},
        serde::json::Json,
    };
    use uuid::Uuid;

    use crate::{
        controller::DB,
        model::{
            room::model::{Filter, Order, Room, SortBy},
            Pagination,
        },
        utils::{auth::Session, s3::S3Client},
        view,
    };

    #[get("/rooms/<id>")]
    pub async fn show(id: String, db: &DB) -> Result<Json<view::room::Get>, Status> {
        let room = match Room::get(db, id.clone()).await {
            Ok(option_room) => match option_room {
                Some(room) => room,
                None => {
                    eprintln!("Room Not Found(id: {id})");
                    return Err(Status::NotFound);
                }
            },
            Err(err) => {
                eprintln!("{err}");
                return Err(Status::InternalServerError);
            }
        };
        let bucket_name = match env::var("ROOMS_BUCKET") {
            Ok(name) => name,
            Err(err) => {
                eprintln!("{err}");
                return Err(Status::InternalServerError);
            }
        };
        let client = S3Client::new(bucket_name).await?;
        let response = view::room::Get::generate(room, client).await?;
        Ok(response)
    }

    #[get("/rooms?<sort_by>&<order>&<is_furnished>&<is_pet_friendly>&<price_min>&<price_max>&<page>&<per_page>")]
    #[allow(clippy::too_many_arguments)]
    pub async fn index(
        db: &DB,
        cookies: &CookieJar<'_>,
        sort_by: Option<SortBy>,
        order: Option<Order>,
        is_furnished: Option<bool>,
        is_pet_friendly: Option<bool>,
        price_min: Option<i32>,
        price_max: Option<i32>,
        page: Option<usize>,
        per_page: Option<usize>,
    ) -> Result<Json<view::room::public::List>, Status> {
        let session = match Session::get(cookies).await {
            Ok(option) => option,
            Err(err) => {
                eprintln!("{err}");
                return Err(Status::InternalServerError);
            }
        };
        let user_id = session.and_then(|session| Uuid::parse_str(&session.user_id).ok());
        let bucket_name = match env::var("ROOMS_BUCKET") {
            Ok(name) => name,
            Err(err) => {
                eprintln!("{err}");
                return Err(Status::InternalServerError);
            }
        };
        let client = S3Client::new(bucket_name).await?;
        match Room::list(
            db,
            sort_by,
            order,
            Filter {
                is_furnished,
                is_pet_friendly,
                price_min,
                price_max,
            },
            user_id,
            Pagination::new(page, per_page),
        )
        .await
        {
            Ok(rooms) => Ok(view::room::public::List::generate(rooms, client).await?),
            Err(err) => {
                eprintln!("{err}");
                Err(Status::InternalServerError)
            }
        }
    }
}

pub mod private {

    use std::env;

    use rocket::{http::Status, serde::json::Json};
    use serde::{Deserialize, Serialize};
    use uuid::Uuid;

    use crate::{
        controller::DB,
        model::{
            room::model::{CreateRoom, Room, UpdateRoom},
            room_image::model::RoomImage,
        },
        utils::{auth::LoginUser, s3::S3Client},
        view,
    };

    #[derive(Serialize, Deserialize)]
    pub struct RoomParams {
        pub title: String,
        pub price: i32,
        pub city: String,
        pub street: Option<String>,
        pub is_furnished: bool,
        pub is_pet_friendly: bool,
        pub s3_keys: Vec<String>,
        pub email: String,
        pub description: String,
    }

    #[put("/private/rooms/<id>", data = "<room>")]
    pub async fn update(id: String, room: Json<RoomParams>, db: &DB, _user: LoginUser) -> Status {
        let room_id = match Uuid::parse_str(&id) {
            Ok(uuid) => uuid,
            Err(_) => return Status::NotFound,
        };
        let RoomParams {
            title,
            price,
            city,
            street,
            is_furnished,
            is_pet_friendly,
            s3_keys,
            description,
            email,
            ..
        } = room.0;
        let update_room_params = UpdateRoom {
            id: room_id,
            title,
            price,
            city,
            street,
            is_furnished,
            is_pet_friendly,
            email,
            description,
        };
        // TODO: transaction
        if RoomImage::delete_many(db, room_id).await.is_err() {
            eprintln!("Failed to delete room images");
            return Status::InternalServerError;
        }
        if RoomImage::create_many(db, room_id, s3_keys).await.is_err() {
            eprintln!("Failed to create room images");
            return Status::InternalServerError;
        }
        let option = match Room::update(db, update_room_params).await {
            Ok(option) => option,
            Err(err) => {
                eprintln!("{err}");
                return Status::InternalServerError;
            }
        };
        match option {
            Some(_) => Status::NoContent,
            None => Status::NotFound,
        }
    }

    #[delete("/private/rooms/<id>")]
    pub async fn delete(id: String, db: &DB, _user: LoginUser) -> Status {
        match Room::delete(db, id).await {
            Ok(option) => {
                if option.is_some() {
                    Status::NoContent
                } else {
                    eprintln!("Room Not Found");
                    Status::NotFound
                }
            }
            Err(err) => {
                eprintln!("{err}");
                Status::InternalServerError
            }
        }
    }

    #[post("/private/rooms", data = "<room>")]
    pub async fn create(
        room: Json<RoomParams>,
        db: &DB,
        user: LoginUser,
    ) -> Result<Json<view::Id>, Status> {
        let RoomParams {
            title,
            price,
            city,
            street,
            is_furnished,
            is_pet_friendly,
            s3_keys,
            description,
            email,
        } = room.0;
        let create_room_params = CreateRoom {
            title,
            price,
            city,
            street,
            is_furnished,
            is_pet_friendly,
            description,
            email,
            user_id: user.user_id,
        };
        let room_id = match Room::create(db, create_room_params).await {
            Ok(id) => id,
            Err(err) => {
                eprintln!("{err}");
                return Err(Status::InternalServerError);
            }
        };
        match RoomImage::create_many(db, room_id, s3_keys).await {
            Ok(_) => Ok(view::Id::to_json(room_id.to_string())),
            Err(err) => {
                eprintln!("{err}");
                Err(Status::InternalServerError)
            }
        }
    }

    #[get("/private/rooms")]
    pub async fn index(
        db: &DB,
        user: LoginUser,
    ) -> Result<Json<view::room::private::List>, Status> {
        let bucket_name = match env::var("ROOMS_BUCKET") {
            Ok(name) => name,
            Err(err) => {
                eprintln!("{err}");
                return Err(Status::InternalServerError);
            }
        };
        let client = S3Client::new(bucket_name).await?;
        match Room::filter_by_user(db, user.user_id).await {
            Ok(rooms) => Ok(view::room::private::List::generate(rooms, client).await?),
            Err(err) => {
                eprintln!("{err}");
                Err(Status::InternalServerError)
            }
        }
    }

    #[get("/private/rooms/wishlist")]
    pub async fn wishlist(
        db: &DB,
        user: LoginUser,
    ) -> Result<Json<view::room::private::List>, Status> {
        let bucket_name = match env::var("ROOMS_BUCKET") {
            Ok(name) => name,
            Err(err) => {
                eprintln!("{err}");
                return Err(Status::InternalServerError);
            }
        };
        let client = S3Client::new(bucket_name).await?;
        match Room::get_wishlists(db, user.user_id).await {
            Ok(rooms) => Ok(view::room::private::List::generate(rooms, client).await?),
            Err(err) => {
                eprintln!("{err}");
                Err(Status::InternalServerError)
            }
        }
    }
}

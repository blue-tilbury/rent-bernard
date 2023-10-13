use std::env;

use rocket::{http::Status, serde::json::Json};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::{
    model::{
        room::model::{CreateRoom, Room, UpdateRoom},
        room_image::model::RoomImage,
    },
    utils::s3::S3Client,
    view,
};

use super::DB;

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

#[get("/rooms?<username>")]
pub async fn index(username: Option<String>, db: &DB) -> Result<Json<view::room::List>, Status> {
    // TODO: filter by username
    println!("{}", username.unwrap_or("".to_string()));
    let bucket_name = match env::var("ROOMS_BUCKET") {
        Ok(name) => name,
        Err(err) => {
            eprintln!("{err}");
            return Err(Status::InternalServerError);
        }
    };
    let client = S3Client::new(bucket_name).await?;
    match Room::list(db).await {
        Ok(rooms) => Ok(view::room::List::generate(rooms, client).await?),
        Err(err) => {
            eprintln!("{err}");
            Err(Status::InternalServerError)
        }
    }
}

#[put("/room/<id>", data = "<room>")]
pub async fn update(id: String, room: Json<RoomParams>, db: &DB) -> Status {
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

#[delete("/room/<id>")]
pub async fn delete(id: String, db: &DB) -> Status {
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

#[post("/rooms", data = "<room>")]
pub async fn create(room: Json<RoomParams>, db: &DB) -> Result<Json<view::Id>, Status> {
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

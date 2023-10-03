use std::env;

use rocket::{http::Status, serde::json::Json, State};
use serde::{Deserialize, Serialize};
use surrealdb::{engine::remote::ws::Client, Surreal};

use crate::{
    model::room::model::{ContactInformation, CreateRoom, Room, UpdateRoom},
    utils::s3::S3Client,
    view,
};

#[derive(Serialize, Deserialize)]
pub struct RoomParams {
    pub title: String,
    pub price: i64,
    pub city: String,
    pub street: Option<String>,
    pub is_furnished: bool,
    pub is_pet_friendly: bool,
    pub s3_keys: Vec<String>,
    pub contact_information: PostContactInformation,
    pub description: String,
}

#[derive(Serialize, Deserialize)]
pub struct PostContactInformation {
    pub email: String,
}

type DB = State<Surreal<Client>>;

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

#[get("/rooms")]
pub async fn index(db: &DB) -> Result<Json<view::room::List>, Status> {
    match Room::list(db).await {
        Ok(rooms) => Ok(view::room::List::generate(rooms)),
        Err(err) => {
            eprintln!("{err}");
            Err(Status::InternalServerError)
        }
    }
}

#[put("/room/<id>", data = "<room>")]
pub async fn update(
    id: String,
    room: Json<RoomParams>,
    db: &DB,
) -> Result<Json<view::room::Get>, Status> {
    let RoomParams {
        title,
        price,
        city,
        street,
        is_furnished,
        is_pet_friendly,
        s3_keys,
        contact_information,
        description,
    } = room.0;
    let update_room_params = UpdateRoom {
        id,
        title,
        price,
        city,
        street,
        is_furnished,
        is_pet_friendly,
        s3_keys,
        contact_information: ContactInformation {
            email: contact_information.email,
        },
        description,
    };
    let room = match Room::update(db, update_room_params).await {
        Ok(option_room) => match option_room {
            Some(room) => room,
            None => {
                eprintln!("Room Not Found");
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
    view::room::Get::generate(room, client).await
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
pub async fn create(room: Json<RoomParams>, db: &DB) -> Result<Json<view::room::Get>, Status> {
    let RoomParams {
        title,
        price,
        city,
        street,
        is_furnished,
        is_pet_friendly,
        s3_keys,
        contact_information,
        description,
    } = room.0;
    let create_room_params = CreateRoom {
        title,
        price,
        city,
        street,
        is_furnished,
        is_pet_friendly,
        s3_keys,
        contact_information: ContactInformation {
            email: contact_information.email,
        },
        description,
    };
    match Room::create(db.inner(), create_room_params).await {
        Ok(room) => {
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
        Err(err) => {
            eprintln!("{err}");
            Err(Status::InternalServerError)
        }
    }
}

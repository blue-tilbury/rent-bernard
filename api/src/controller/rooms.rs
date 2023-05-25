use rocket::{http::Status, serde::json::Json, State};
use serde::Deserialize;
use surrealdb::{engine::remote::ws::Client, Surreal};

use crate::{
    model::room::model::{CreateRoom, Room},
    view::room::GetRoom,
};

#[derive(Deserialize)]
pub struct PostRoom {
    pub title: String,
    pub price: i64,
    pub area: String,
    pub street: Option<String>,
    pub is_furnished: bool,
    pub is_pet_friendly: bool,
    pub description: String,
}

type DB = State<Surreal<Client>>;

#[get("/rooms/<id>")]
pub async fn show(id: String, db: &DB) -> Result<Json<GetRoom>, Status> {
    match Room::get(db, id).await {
        Ok(room) => {
            if let Some(room) = room {
                let response = GetRoom::get_room(room);
                Ok(response)
            } else {
                eprintln!("Room Not Found");
                Err(Status::NotFound)
            }
        }
        Err(err) => {
            eprintln!("{err}");
            Err(Status::InternalServerError)
        }
    }
}

#[post("/rooms", data = "<room>")]
pub async fn create(room: Json<PostRoom>, db: &DB) -> Result<Json<GetRoom>, Status> {
    let PostRoom {
        title,
        price,
        area,
        street,
        is_furnished,
        is_pet_friendly,
        description,
    } = room.0;
    let create_room_params = CreateRoom {
        title,
        price,
        area,
        street,
        is_furnished,
        is_pet_friendly,
        description,
    };
    match Room::create(db.inner(), create_room_params).await {
        Ok(room) => {
            let response = GetRoom::get_room(room);
            Ok(response)
        }
        Err(err) => {
            eprintln!("{err}");
            Err(Status::InternalServerError)
        }
    }
}

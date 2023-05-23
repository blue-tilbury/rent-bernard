use rocket::{http::Status, serde::json::Json};
use serde::Deserialize;

use crate::{
    fairing::db::DbConn,
    model::room::{CreateRoom, Room},
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

#[get("/rooms/<id>")]
pub async fn show(id: String, db: DbConn) -> Result<Json<GetRoom>, Status> {
    match db.run(|conn| Room::get(conn, id)).await {
        Ok(room) => Ok(GetRoom::get_room(room)),
        Err(e) => {
            if let diesel::result::Error::NotFound = e {
                return Err(Status::NotFound);
            }
            println!("{e}");
            Err(Status::InternalServerError)
        }
    }
}

#[post("/rooms", data = "<room>")]
pub async fn create(room: Json<PostRoom>, db: DbConn) -> Status {
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
    match db.run(|conn| Room::create(conn, create_room_params)).await {
        Ok(_) => Status::Created,
        Err(e) => {
            println!("{e}");
            Status::InternalServerError
        }
    }
}

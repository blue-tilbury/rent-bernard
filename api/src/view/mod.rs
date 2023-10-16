use rocket::serde::json::Json;

use serde::Serialize;

pub mod photo;
pub mod room;
pub mod user;

#[derive(Serialize)]
pub struct Id {
    id: String,
}

impl Id {
    pub fn to_json(id: String) -> Json<Id> {
        Json(Id { id })
    }
}

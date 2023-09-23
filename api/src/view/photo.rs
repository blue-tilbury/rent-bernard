use rocket::serde::json::Json;

use serde::Serialize;

#[derive(Serialize)]
pub struct Upload {
    url: String,
    key: String,
}

impl Upload {
    pub fn generate(url: String, key: String) -> Json<Upload> {
        Json(Upload { url, key })
    }
}

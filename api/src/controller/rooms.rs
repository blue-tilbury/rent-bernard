use rocket::{http::Status, serde::json::Json, State};
use serde::{Deserialize, Serialize};
use surrealdb::{engine::remote::ws::Client, Surreal};

use crate::{
    model::room::model::{CreateRoom, Image, Room},
    view::room::GetRoom,
};

#[derive(Serialize, Deserialize)]
pub struct PostRoom {
    pub title: String,
    pub price: i64,
    pub area: String,
    pub street: Option<String>,
    pub is_furnished: bool,
    pub is_pet_friendly: bool,
    pub images: Vec<PostImage>,
    pub description: String,
}

#[derive(Serialize, Deserialize)]
pub struct PostImage {
    pub url: String,
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
        images,
        description,
    } = room.0;
    let create_room_params = CreateRoom {
        title,
        price,
        area,
        street,
        is_furnished,
        is_pet_friendly,
        images: images
            .into_iter()
            .map(|image| Image { url: image.url })
            .collect(),
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

#[cfg(test)]
mod tests {
    use crate::controller::tests::create_client;

    use super::*;

    #[test]
    fn test_create() {
        let client = create_client(routes![create]);
        let image = PostImage {
            url: "url".to_string(),
        };
        let body = PostRoom {
            title: "title".to_string(),
            price: 10000,
            area: "area".to_string(),
            street: None,
            is_furnished: true,
            is_pet_friendly: false,
            images: vec![image],
            description: "description".to_string(),
        };
        let uri = uri!(create);
        let response = client.post(uri).json(&body).dispatch();
        assert_eq!(response.status(), Status::Ok);
        let json: String = response.into_string().unwrap();
        assert!(!json.is_empty())
    }

    #[test]
    fn test_show() {
        let client = create_client(routes![create, show]);
        let image = PostImage {
            url: "url".to_string(),
        };
        let body = PostRoom {
            title: "title".to_string(),
            price: 10000,
            area: "area".to_string(),
            street: None,
            is_furnished: true,
            is_pet_friendly: false,
            images: vec![image],
            description: "description".to_string(),
        };
        let uri = uri!(create);
        let response = client.post(uri).json(&body).dispatch();

        let GetRoom { id, .. } = response.into_json().unwrap();
        let uri = uri!(show(id));

        let response = client.get(uri).dispatch();
        assert_eq!(response.status(), Status::Ok);
        let json = response.into_string().unwrap();
        assert!(!json.is_empty());
    }
}

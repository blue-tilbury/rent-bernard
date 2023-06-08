use rocket::{http::Status, serde::json::Json, State};
use serde::{Deserialize, Serialize};
use surrealdb::{engine::remote::ws::Client, Surreal};

use crate::{
    model::room::model::{ContactInformation, CreateRoom, Image, Room, UpdateRoom},
    view,
};

#[derive(Serialize, Deserialize)]
pub struct RoomParams {
    pub title: String,
    pub price: i64,
    pub area: String,
    pub street: Option<String>,
    pub is_furnished: bool,
    pub is_pet_friendly: bool,
    pub images: Vec<PostImage>,
    pub contact_information: PostContactInformation,
    pub description: String,
}

#[derive(Serialize, Deserialize)]
pub struct PostImage {
    pub url: String,
}

#[derive(Serialize, Deserialize)]
pub struct PostContactInformation {
    pub email: String,
}

type DB = State<Surreal<Client>>;

#[get("/rooms/<id>")]
pub async fn show(id: String, db: &DB) -> Result<Json<view::room::Get>, Status> {
    match Room::get(db, id).await {
        Ok(room) => {
            if let Some(room) = room {
                let response = view::room::Get::generate(room);
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
pub async fn update(id: String, room: Json<RoomParams>, db: &DB) -> Result<Json<view::room::Get>, Status> {
    let RoomParams {
        title,
        price,
        area,
        street,
        is_furnished,
        is_pet_friendly,
        images,
        contact_information,
        description,
    } = room.0;
    let update_room_params = UpdateRoom {
        id,
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
        contact_information: ContactInformation {
            email: contact_information.email,
        },
        description,
    };
    match Room::update(db, update_room_params).await {
        Ok(room) => Ok(view::room::Get::generate(room)),
        Err(err) => {
            eprintln!("{err}");
            Err(Status::InternalServerError)
        }
    }
}

#[post("/rooms", data = "<room>")]
pub async fn create(room: Json<RoomParams>, db: &DB) -> Result<Json<view::room::Get>, Status> {
    let RoomParams {
        title,
        price,
        area,
        street,
        is_furnished,
        is_pet_friendly,
        images,
        contact_information,
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
        contact_information: ContactInformation {
            email: contact_information.email,
        },
        description,
    };
    match Room::create(db.inner(), create_room_params).await {
        Ok(room) => {
            let response = view::room::Get::generate(room);
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
    use crate::{controller::tests::create_client, view};

    use super::*;

    #[test]
    fn test_create() {
        let client = create_client(routes![create]);
        let image = PostImage {
            url: "url".to_string(),
        };
        let body = RoomParams {
            title: "title".to_string(),
            price: 10000,
            area: "area".to_string(),
            street: None,
            is_furnished: true,
            is_pet_friendly: false,
            images: vec![image],
            contact_information: PostContactInformation {
                email: "email".to_string(),
            },
            description: "description".to_string(),
        };
        let uri = uri!(create);
        let response = client.post(uri).json(&body).dispatch();
        assert_eq!(response.status(), Status::Ok);
        let json: String = response.into_string().unwrap();
        assert!(!json.is_empty());
    }

    #[test]
    fn test_show() {
        let client = create_client(routes![create, show]);
        let image = PostImage {
            url: "url".to_string(),
        };
        let body = RoomParams {
            title: "title".to_string(),
            price: 10000,
            area: "area".to_string(),
            street: None,
            is_furnished: true,
            is_pet_friendly: false,
            images: vec![image],
            contact_information: PostContactInformation {
                email: "email".to_string(),
            },
            description: "description".to_string(),
        };
        let uri = uri!(create);
        let response = client.post(uri).json(&body).dispatch();

        let view::room::Get { id, .. } = response.into_json().unwrap();
        let uri = uri!(show(id));

        let response = client.get(uri).dispatch();
        assert_eq!(response.status(), Status::Ok);
        let json = response.into_string().unwrap();
        assert!(!json.is_empty());
    }

    #[test]
    fn test_index() {
        let client = create_client(routes![create, index]);
        let image = PostImage {
            url: "url".to_string(),
        };
        let body = RoomParams {
            title: "title".to_string(),
            price: 10000,
            area: "area".to_string(),
            street: None,
            is_furnished: true,
            is_pet_friendly: false,
            images: vec![image],
            contact_information: PostContactInformation {
                email: "email".to_string(),
            },
            description: "description".to_string(),
        };
        let uri = uri!(create);
        client.post(uri).json(&body).dispatch();

        let uri = uri!(index);

        let response = client.get(uri).dispatch();
        assert_eq!(response.status(), Status::Ok);
        let json = response.into_string().unwrap();
        assert!(!json.is_empty());
    }

    #[test]
    fn test_update() {
        let client = create_client(routes![create, update]);
        let image = PostImage {
            url: "url".to_string(),
        };
        let body = RoomParams {
            title: "title".to_string(),
            price: 10000,
            area: "area".to_string(),
            street: None,
            is_furnished: true,
            is_pet_friendly: false,
            images: vec![image],
            contact_information: PostContactInformation {
                email: "email".to_string(),
            },
            description: "description".to_string(),
        };
        let uri = uri!(create);
        let response = client.post(uri).json(&body).dispatch();
        let view::room::Get { id, .. } = response.into_json().unwrap();
        let uri = uri!(update(id));

        let new_image = PostImage {
            url: "new_url".to_string(),
        };
        let new_body = RoomParams {
            title: "title".to_string(),
            price: 10000,
            area: "area".to_string(),
            street: None,
            is_furnished: true,
            is_pet_friendly: false,
            images: vec![new_image],
            contact_information: PostContactInformation {
                email: "email".to_string(),
            },
            description: "description".to_string(),
        };
        let response = client.put(uri).json(&new_body).dispatch();

        assert_eq!(response.status(), Status::Ok);
        let json = response.into_string().unwrap();
        assert!(!json.is_empty());
    }
}

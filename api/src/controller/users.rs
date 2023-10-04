use jsonwebtoken::{decode, Algorithm, DecodingKey, Validation};
use rocket::{http::Status, serde::json::Json, State};
use serde::{Deserialize, Serialize};

use crate::{
    fairing::db::DBClient,
    model::user::model::{CreateUser, User},
    view,
};

#[derive(Serialize, Deserialize)]
pub struct UserParams {
    pub token: String,
}

type DB = State<DBClient>;

#[post("/users", data = "<params>")]
pub async fn create(params: Json<UserParams>, db: &DB) -> Result<Json<view::user::Get>, Status> {
    let key = DecodingKey::from_secret(&[]);
    let mut validation = Validation::new(Algorithm::HS256);
    validation.insecure_disable_signature_validation();

    let decoded_token = match decode::<CreateUser>(&params.token, &key, &validation) {
        Ok(user) => user,
        Err(err) => {
            eprintln!("{err}");
            return Err(Status::InternalServerError);
        }
    };
    let user = decoded_token.claims;
    match User::create(db.inner(), user).await {
        Ok(room) => {
            let response = view::user::Get::generate(room);
            Ok(response)
        }
        Err(err) => {
            eprintln!("{err}");
            Err(Status::InternalServerError)
        }
    }
}

use jsonwebtoken::{decode, Algorithm, DecodingKey, Validation};
use rocket::{http::Status, serde::json::Json};
use serde::{Deserialize, Serialize};

use crate::{
    model::user::model::{CreateUser, User},
    view,
};

use super::DB;

#[derive(Serialize, Deserialize)]
pub struct UserParams {
    pub token: String,
}

#[post("/users", data = "<params>")]
pub async fn create(params: Json<UserParams>, db: &DB) -> Result<Json<view::Id>, Status> {
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
    let id = match User::create(db, user).await {
        Ok(id) => id,
        Err(err) => {
            eprintln!("{err}");
            return Err(Status::InternalServerError);
        }
    };
    Ok(view::Id::to_json(id.to_string()))
}

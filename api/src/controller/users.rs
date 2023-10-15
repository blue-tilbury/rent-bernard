use jsonwebtoken::{decode, Algorithm, DecodingKey, Validation};
use rocket::{
    http::{CookieJar, Status},
    serde::json::Json,
};
use serde::{Deserialize, Serialize};

use crate::{
    model::user::model::{CreateUser, User},
    utils::auth::Session,
};

use super::DB;

#[derive(Serialize, Deserialize)]
pub struct UserParams {
    pub token: String,
}

#[post("/login", data = "<params>")]
pub async fn login(params: Json<UserParams>, db: &DB, cookies: &CookieJar<'_>) -> Status {
    let key = DecodingKey::from_secret(&[]);
    let mut validation = Validation::new(Algorithm::HS256);
    validation.insecure_disable_signature_validation();

    let decoded_token = match decode::<CreateUser>(&params.token, &key, &validation) {
        Ok(user) => user,
        Err(err) => {
            eprintln!("{err}");
            return Status::InternalServerError;
        }
    };
    let user = decoded_token.claims;
    let user_exists = match User::find_by_email(db, user.clone().email).await {
        Ok(option) => option,
        Err(err) => {
            eprintln!("{err}");
            return Status::InternalServerError;
        }
    };
    let user_id = match user_exists {
        Some(user) => user.id,
        None => match User::create(db, user).await {
            Ok(id) => id,
            Err(err) => {
                eprintln!("{err}");
                return Status::InternalServerError;
            }
        },
    };
    if Session::set(user_id.to_string(), cookies).await.is_err() {
        eprintln!("Failed to set session in redis");
        return Status::InternalServerError;
    }
    Status::Ok
}

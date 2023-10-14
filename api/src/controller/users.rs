use jsonwebtoken::{decode, Algorithm, DecodingKey, Validation};
use rocket::{
    http::{Cookie, CookieJar, Status},
    serde::json::Json,
};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::{
    model::user::model::{CreateUser, User},
    utils::redis::RedisClient,
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
    let mut client = RedisClient::new().await;
    if client
        .set("user_id", user_id.to_string().as_str())
        .await
        .is_err()
    {
        eprintln!("Failed to set user_id in redis");
        return Status::InternalServerError;
    }
    let session_id = Uuid::new_v4().to_string();
    if client.set("session_id", session_id.as_str()).await.is_err() {
        eprintln!("Failed to set session_id in redis");
        return Status::InternalServerError;
    }
    cookies.add_private(Cookie::new("session_id", session_id));
    Status::Ok
}

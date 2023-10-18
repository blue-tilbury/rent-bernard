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
pub struct LoginParams {
    pub token: String,
}

#[post("/login", data = "<params>")]
pub async fn login(params: Json<LoginParams>, db: &DB, cookies: &CookieJar<'_>) -> Status {
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
    if let Err(err) = Session::set(user_id.to_string(), cookies).await {
        eprintln!("{err}");
        return Status::InternalServerError;
    }
    Status::Ok
}

#[post("/logout")]
pub async fn logout(cookies: &CookieJar<'_>) -> Status {
    if let Err(err) = Session::delete(cookies).await {
        eprintln!("{err}");
        return Status::InternalServerError;
    }
    Status::Ok
}

pub mod private {
    use rocket::{http::Status, serde::json::Json};

    use crate::{controller::DB, model::user::model::User, utils::auth::LoginUser, view};

    #[get("/private/login_user")]
    pub async fn login_user(db: &DB, user: LoginUser) -> Result<Json<view::user::Get>, Status> {
        let user = match User::find_by_id(db, user.user_id)
            .await
            .map_err(|_| Status::InternalServerError)?
        {
            Some(user) => user,
            None => return Err(Status::Unauthorized),
        };
        Ok(view::user::Get::generate(user))
    }
}

use rocket::http::{Cookie, CookieJar, Status};
use uuid::Uuid;

use super::redis::RedisClient;

const SESSION_KEY: &str = "session_id";

pub struct Session {
    pub user_id: String,
}

impl Session {
    pub async fn set(user_id: String, cookies: &CookieJar<'_>) -> Result<(), Status> {
        let mut client = RedisClient::new().await;
        let session_id = Uuid::new_v4().to_string();
        if client.set(&session_id, user_id).await.is_err() {
            eprintln!("Failed to set session in redis");
            return Err(Status::InternalServerError);
        }
        cookies.add_private(Cookie::new(SESSION_KEY, session_id));
        Ok(())
    }

    pub async fn get(cookies: &CookieJar<'_>) -> Result<Self, Status> {
        let session_id = match cookies.get_private(SESSION_KEY) {
            Some(cookie) => cookie.value().to_string(),
            None => return Err(Status::Unauthorized),
        };
        let mut client = RedisClient::new().await;
        let user_id = match client.get::<String>(session_id.as_str()).await {
            Ok(user_id) => user_id,
            Err(_) => return Err(Status::Unauthorized),
        };
        Ok(Self { user_id })
    }
}

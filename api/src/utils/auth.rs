use std::time::Duration;

use redis::RedisError;
use rocket::{
    http::{Cookie, CookieJar},
    time::OffsetDateTime,
};
use uuid::Uuid;

use super::redis::RedisClient;

const SESSION_KEY: &str = "session_id";
const EXPIRES_IN: usize = 3600;

pub struct Session {
    pub user_id: String,
}

impl Session {
    pub async fn set(user_id: String, cookies: &CookieJar<'_>) -> Result<(), RedisError> {
        let mut client = RedisClient::new().await;
        let session_id = Uuid::new_v4().to_string();
        client.set(&session_id, user_id, EXPIRES_IN).await?;
        let mut cookie = Cookie::new(SESSION_KEY, session_id);
        let expires_at = OffsetDateTime::now_utc() + Duration::from_secs(EXPIRES_IN as u64);
        cookie.set_expires(expires_at);
        cookies.add_private(cookie);
        Ok(())
    }

    pub async fn get(cookies: &CookieJar<'_>) -> Result<Option<Self>, RedisError> {
        let session_id = match cookies.get_private(SESSION_KEY) {
            Some(cookie) => cookie.value().to_string(),
            None => return Ok(None),
        };
        let mut client = RedisClient::new().await;
        if !client.exists(&session_id).await? {
            return Ok(None);
        }
        let user_id = client.get::<String>(&session_id).await?;
        Ok(Some(Self { user_id }))
    }

    pub async fn delete(cookies: &CookieJar<'_>) -> Result<(), RedisError> {
        let session_id = match cookies.get_private(SESSION_KEY) {
            Some(cookie) => cookie.value().to_string(),
            None => return Ok(()),
        };
        let mut client = RedisClient::new().await;
        client.del(session_id.as_str()).await?;
        cookies.remove_private(Cookie::named(SESSION_KEY));
        Ok(())
    }
}

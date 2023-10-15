use redis::{AsyncCommands, FromRedisValue, ToRedisArgs};
use std::env;

pub struct RedisClient {
    conn: redis::aio::Connection,
}

impl RedisClient {
    pub async fn new() -> Self {
        let uri = env::var("REDIS_URL").expect("REDIS_URL must be set");
        let client = redis::Client::open(uri).expect("Failed to open redis");
        let conn = client
            .get_async_connection()
            .await
            .expect("Failed to connect to redis");
        RedisClient { conn }
    }

    pub async fn get<T: FromRedisValue>(&mut self, key: &str) -> redis::RedisResult<T> {
        self.conn.get(key).await
    }

    pub async fn set<T: ToRedisArgs + Send + Sync>(
        &mut self,
        key: &str,
        value: T,
    ) -> redis::RedisResult<()> {
        self.conn.set(key, value).await
    }
}

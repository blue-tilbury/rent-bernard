use std::env;

use rocket::{
    fairing::{Fairing, Info, Kind, Result},
    Build, Rocket,
};
use sqlx::postgres::PgPoolOptions;

pub struct Connection;

#[rocket::async_trait]
impl Fairing for Connection {
    fn info(&self) -> Info {
        Info {
            name: "DB Connection",
            kind: Kind::Ignite,
        }
    }

    async fn on_ignite(&self, rocket: Rocket<Build>) -> Result {
        let url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
        let pool = PgPoolOptions::new()
            .max_connections(5)
            .connect(url.as_str())
            .await
            .unwrap();
        Ok(rocket.manage(pool))
    }
}

#[cfg(test)]
pub mod tests {
    use std::env;

    use sqlx::{postgres::PgPoolOptions, PgPool};
    pub struct TestConnection {
        pub pool: PgPool,
        database_name: String,
        is_cleaned_up: bool,
    }

    impl TestConnection {
        /// ## WARNING
        /// Don't forget to run `clean_up` at the end of each test
        pub async fn new() -> Self {
            let url = env::var("TEST_DATABASE_URL").expect("DATABASE_URL must be set");
            let pool = PgPoolOptions::new().connect(url.as_str()).await.unwrap();
            let database_name =
                format!("test_{}", uuid::Uuid::new_v4().to_string().replace('-', ""));
            sqlx::query(format!("CREATE DATABASE {}", database_name).as_str())
                .execute(&pool)
                .await
                .unwrap();
            let pool = PgPoolOptions::new()
                .connect(format!("{}/{}", url, database_name).as_str())
                .await
                .unwrap();
            sqlx::migrate!().run(&pool).await.unwrap();
            Self {
                pool,
                database_name,
                is_cleaned_up: false,
            }
        }

        pub async fn clean_up(&mut self) {
            let url = env::var("TEST_DATABASE_URL").expect("DATABASE_URL must be set");
            let pool = PgPoolOptions::new().connect(url.as_str()).await.unwrap();
            sqlx::query(
                format!(
                    "DROP DATABASE IF EXISTS {} WITH (FORCE)",
                    self.database_name
                )
                .as_str(),
            )
            .execute(&pool)
            .await
            .unwrap();
            self.is_cleaned_up = true;
        }
    }

    impl Drop for TestConnection {
        fn drop(&mut self) {
            if !self.is_cleaned_up {
                panic!("TestConnection must be cleaned up after each test");
            }
        }
    }
}

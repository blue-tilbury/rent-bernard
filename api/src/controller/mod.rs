use rocket::http::Status;

pub mod rooms;

#[options("/<_..>")]
pub fn cors_handler() -> Status {
    Status::NoContent
}

#[cfg(test)]
mod tests {
    use rocket::{
        figment::providers::{Format, Toml},
        local::blocking::Client,
        Config, Route,
    };

    use crate::fairing::db::TestDbMiddleware;

    pub fn create_client(controllers: Vec<Route>) -> Client {
        let figment = Config::figment().merge(Toml::file("App.toml").nested());
        let rocket = rocket::custom(figment)
            .mount("/", controllers)
            .attach(TestDbMiddleware);
        Client::tracked(rocket).unwrap()
    }
}

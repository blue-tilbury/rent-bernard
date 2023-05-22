#![warn(clippy::all, clippy::pedantic)]

use fairing::cors::Cors;
use rocket::{
    figment::providers::{Format, Toml},
    http::Status,
    serde::json::Json,
    Config,
};
use serde::Serialize;

#[macro_use]
extern crate rocket;
mod fairing;

// TODO: delete after testing
#[derive(Serialize)]
pub struct Test {
    pub success: bool,
}

// TODO: delete after testing
#[get("/")]
pub async fn test() -> Json<Test> {
    let res = Test { success: true };
    Json(res)
}

#[options("/<_..>")]
fn cors_handler() -> Status {
    Status::NoContent
}

#[launch]
fn rocket() -> _ {
    let apis = routes![test, cors_handler];
    let figment = Config::figment().merge(Toml::file("App.toml").nested());
    rocket::custom(figment).mount("/", apis).attach(Cors)
}

#![warn(clippy::all, clippy::pedantic)]

use controller::{cors_handler, rooms};
use fairing::{cors::Cors, db::DbConn};
use rocket::{
    figment::providers::{Format, Toml},
    Config,
};

#[macro_use]
extern crate rocket;
mod controller;
mod fairing;
mod model;
mod schema;
mod view;

#[launch]
fn rocket() -> _ {
    let apis = routes![rooms::show, rooms::create, cors_handler];
    let figment = Config::figment().merge(Toml::file("App.toml").nested());
    rocket::custom(figment)
        .mount("/", apis)
        .attach(Cors)
        .attach(DbConn::fairing())
}

#![warn(clippy::all)]

use controller::{cors_handler, photos, rooms, users};
use fairing::{cors::Cors, db};
use rocket::{
    figment::{
        providers::{Format, Toml},
        Figment,
    },
    Build, Config, Rocket, Route,
};

#[macro_use]
extern crate rocket;
mod controller;
mod fairing;
mod model;
mod utils;
mod view;

#[launch]
fn rocket() -> Rocket<Build> {
    let apis: Vec<Route> = routes![
        rooms::show,
        rooms::create,
        rooms::index,
        rooms::update,
        rooms::delete,
        photos::upload,
        users::create,
        cors_handler
    ];
    let figment: Figment = Config::figment().merge(Toml::file("App.toml").nested());
    rocket::custom(figment)
        .mount("/", apis)
        .attach(Cors)
        .attach(db::Connection)
}

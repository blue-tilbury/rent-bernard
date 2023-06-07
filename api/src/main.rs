#![warn(clippy::all)]

use controller::{cors_handler, rooms};
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
mod view;

#[launch]
fn rocket() -> Rocket<Build> {
    let apis: Vec<Route> = routes![rooms::show, rooms::create, rooms::index, rooms::update, cors_handler];
    let figment: Figment = Config::figment().merge(Toml::file("App.toml").nested());
    rocket::custom(figment)
        .mount("/", apis)
        .attach(Cors)
        .attach(db::Connection)
}

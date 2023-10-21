#![warn(clippy::all)]

use controller::{cors_handler, photos, rooms, users, wishlists};
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
        rooms::public::show,
        rooms::public::index,
        rooms::private::create,
        rooms::private::update,
        rooms::private::delete,
        rooms::private::index,
        photos::private::upload,
        users::login,
        users::logout,
        users::private::login_user,
        wishlists::private::create,
        wishlists::private::delete,
        cors_handler
    ];
    let figment: Figment = Config::figment().merge(Toml::file("App.toml").nested());
    rocket::custom(figment)
        .mount("/", apis)
        .attach(Cors)
        .attach(db::Connection)
}

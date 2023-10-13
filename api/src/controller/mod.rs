use rocket::{http::Status, State};
use sqlx::PgPool;

pub mod photos;
pub mod rooms;
pub mod users;

type DB = State<PgPool>;

#[options("/<_..>")]
pub fn cors_handler() -> Status {
    Status::NoContent
}

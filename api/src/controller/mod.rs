use rocket::http::Status;

pub mod photos;
pub mod rooms;
pub mod users;

#[options("/<_..>")]
pub fn cors_handler() -> Status {
    Status::NoContent
}

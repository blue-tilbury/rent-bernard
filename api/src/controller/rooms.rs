use rocket::serde::json::Json;

use crate::{fairing::db::DbConn, model::room::Room, view::room::GetRoom};

#[get("/rooms/<id>")]
pub async fn show(id: String, db: DbConn) -> Json<GetRoom> {
    let room = db.run(|conn| Room::get(conn, id)).await;
    GetRoom::get_room(room)
}

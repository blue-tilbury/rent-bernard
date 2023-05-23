use crate::schema::rooms::dsl::*;

use chrono::NaiveDateTime;
use diesel::prelude::*;

#[derive(Queryable)]
pub struct Room {
    pub id: String,
    pub title: String,
    pub price: i64,
    pub area: String,
    pub street: Option<String>,
    pub is_furnished: bool,
    pub is_pet_friendly: bool,
    pub description: String,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

impl Room {
    pub fn get(conn: &mut MysqlConnection, room_id: String) -> Room {
        rooms.filter(id.eq(room_id)).first::<Room>(conn).unwrap()
    }
}

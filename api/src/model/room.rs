use crate::schema::rooms;
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

#[derive(Insertable)]
#[diesel(table_name = rooms)]
pub struct CreateRoom {
    pub title: String,
    pub price: i64,
    pub area: String,
    pub street: Option<String>,
    pub is_furnished: bool,
    pub is_pet_friendly: bool,
    pub description: String,
}

impl Room {
    pub fn get(conn: &mut MysqlConnection, room_id: String) -> Result<Room, diesel::result::Error> {
        rooms.filter(id.eq(room_id)).first::<Room>(conn)
    }

    pub fn create(
        conn: &mut MysqlConnection,
        params: CreateRoom,
    ) -> Result<(), diesel::result::Error> {
        diesel::insert_into(rooms).values(&params).execute(conn)?;
        Ok(())
    }
}

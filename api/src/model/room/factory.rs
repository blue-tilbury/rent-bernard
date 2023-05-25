#[cfg(test)]
pub mod tests {
    use chrono::Local;

    use crate::fairing::db::DB;
    use crate::model::room::model::Room;
    use crate::model::room::RoomResource;
    use crate::model::room::TABLE_NAME;

    #[derive(Default)]
    pub struct RoomFactoryParams {
        pub id: Option<String>,
        pub title: Option<String>,
        pub price: Option<i64>,
        pub area: Option<String>,
        pub street: Option<String>,
        pub is_furnished: Option<bool>,
        pub is_pet_friendly: Option<bool>,
        pub description: Option<String>,
    }

    pub struct RoomFactory {}

    impl RoomFactory {
        pub async fn create(db: &DB, params: RoomFactoryParams) -> Room {
            let content = RoomResource {
                id: None,
                title: params.title.unwrap_or_default(),
                price: params.price.unwrap_or_default(),
                area: params.area.unwrap_or_default(),
                street: params.street,
                is_furnished: params.is_furnished.unwrap_or_default(),
                is_pet_friendly: params.is_pet_friendly.unwrap_or_default(),
                description: params.description.unwrap_or_default(),
                created_at: Local::now().naive_local(),
                updated_at: Local::now().naive_local(),
            };
            let room = db.create(TABLE_NAME).content(content).await.unwrap();
            Self::to_raw_id(room)
        }

        fn to_raw_id(room: RoomResource) -> Room {
            let id = room.id.clone().unwrap().id.to_raw();
            Room {
                id,
                title: room.title,
                price: room.price,
                area: room.area,
                street: room.street,
                is_furnished: room.is_furnished,
                is_pet_friendly: room.is_pet_friendly,
                description: room.description,
                created_at: room.created_at,
                updated_at: room.updated_at,
            }
        }
    }
}

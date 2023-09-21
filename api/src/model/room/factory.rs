#[cfg(test)]
pub mod tests {
    use chrono::Local;

    use crate::fairing::db::DB;
    use crate::model::room::model::ContactInformation;
    use crate::model::room::model::Image;
    use crate::model::room::model::Room;
    use crate::model::room::RoomResource;
    use crate::model::room::TABLE_NAME;
    use crate::model::IdConverter;

    #[derive(Default, Clone)]
    pub struct RoomFactoryParams {
        pub id: Option<String>,
        pub title: Option<String>,
        pub price: Option<i64>,
        pub city: Option<String>,
        pub street: Option<String>,
        pub is_furnished: Option<bool>,
        pub is_pet_friendly: Option<bool>,
        pub images: Option<Vec<Image>>,
        pub contact_information: Option<ContactInformation>,
        pub description: Option<String>,
    }

    pub struct RoomFactory {}

    impl RoomFactory {
        pub async fn create(db: &DB, params: RoomFactoryParams) -> Room {
            let content = RoomResource {
                id: None,
                title: params.title.unwrap_or_default(),
                price: params.price.unwrap_or_default(),
                city: params.city.unwrap_or_default(),
                street: params.street,
                is_furnished: params.is_furnished.unwrap_or_default(),
                is_pet_friendly: params.is_pet_friendly.unwrap_or_default(),
                description: params.description.unwrap_or_default(),
                images: params.images.unwrap_or_default(),
                contact_information: params.contact_information.unwrap_or_default(),
                created_at: Local::now().naive_local(),
                updated_at: Local::now().naive_local(),
            };
            let room = db.create(TABLE_NAME).content(content).await.unwrap();
            Room::to_raw_id(room)
        }

        pub async fn create_many(db: &DB, params: RoomFactoryParams, number: usize) -> Vec<Room> {
            let mut rooms: Vec<Room> = Vec::new();
            for _ in 0..number {
                let room = Self::create(db, params.clone()).await;
                rooms.push(room)
            }
            rooms
        }
    }
}

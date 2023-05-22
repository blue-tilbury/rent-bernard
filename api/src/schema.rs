// @generated automatically by Diesel CLI.

diesel::table! {
    room_images (id) {
        id -> Varchar,
        url -> Varchar,
        room_id -> Varchar,
        created_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    rooms (id) {
        id -> Varchar,
        title -> Varchar,
        price -> Bigint,
        area -> Varchar,
        street -> Nullable<Varchar>,
        is_furnished -> Bool,
        is_pet_friendly -> Bool,
        description -> Text,
        created_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::joinable!(room_images -> rooms (room_id));

diesel::allow_tables_to_appear_in_same_query!(
    room_images,
    rooms,
);

pub mod room;
pub mod user;

pub trait IdConverter<T, R> {
    fn to_raw_id(resource: T) -> R;
}

pub mod room;
pub mod room_image;
pub mod user;
pub mod wishlist;

const DEFAULT_PER_PAGE: usize = 10;
pub struct Pagination {
    page: usize,
    per_page: usize,
}

impl Pagination {
    pub fn new(page: Option<usize>, per_page: Option<usize>) -> Self {
        Self {
            page: page.unwrap_or(0),
            per_page: per_page.unwrap_or(DEFAULT_PER_PAGE),
        }
    }

    fn to_sql(&self) -> String {
        format!(
            "LIMIT {} OFFSET {}",
            self.per_page,
            self.per_page * self.page
        )
    }
}

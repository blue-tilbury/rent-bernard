use rocket::serde::json::Json;

use crate::model::user::model::User;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Get {
    pub id: String,
    name: String,
    email: String,
    picture: String,
    created_at: String,
    updated_at: String,
}

impl Get {
    pub fn generate(user: User) -> Json<Get> {
        Json(Self::to_get(user))
    }

    fn to_get(user: User) -> Get {
        Get {
            id: user.id,
            name: user.name,
            email: user.email,
            picture: user.picture,
            created_at: user.created_at.to_string(),
            updated_at: user.updated_at.to_string(),
        }
    }
}

#[cfg(test)]
mod tests {
    use chrono::Local;

    use super::*;

    #[test]
    fn test_get_room() {
        let user = User {
            id: "id".to_string(),
            name: "name".to_string(),
            email: "email".to_string(),
            picture: "picture".to_string(),
            created_at: Local::now().naive_local(),
            updated_at: Local::now().naive_local(),
        };
        let json = Get::generate(user);
        assert_eq!(json.id, "id".to_string());
        assert_eq!(json.name, "name".to_string());
        assert_eq!(json.email, "email".to_string());
        assert_eq!(json.picture, "picture".to_string());
        assert!(!json.created_at.to_string().is_empty());
        assert!(!json.updated_at.to_string().is_empty());
    }
}

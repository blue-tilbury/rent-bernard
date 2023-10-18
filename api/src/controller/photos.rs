pub mod private {
    use std::env;

    use rocket::{http::Status, serde::json::Json};
    use uuid::Uuid;

    use crate::{
        utils::{
            auth::LoginUser,
            s3::{S3Client, S3Operation},
        },
        view,
    };

    #[get("/private/photos/upload")]
    pub async fn upload(_user: LoginUser) -> Result<Json<view::photo::Upload>, Status> {
        let bucket_name = match env::var("ROOMS_BUCKET") {
            Ok(name) => name,
            Err(err) => {
                eprintln!("{err}");
                return Err(Status::InternalServerError);
            }
        };
        let client = S3Client::new(bucket_name).await?;
        let key = Uuid::new_v4().to_string();
        let url = client.get_presigned_upload_url(key.clone()).await?;
        Ok(view::photo::Upload::generate(url, key))
    }
}

use std::{env, time::Duration};

use aws_sdk_s3 as s3;
use rocket::{http::Status, serde::json::Json};
use s3::presigning::PresigningConfig;
use uuid::Uuid;

use crate::view;

const EXPIRES_IN: u64 = 3600;

#[get("/photos/upload")]
pub async fn upload() -> Result<Json<view::photo::Upload>, Status> {
    let endpoint = match env::var("S3_ENDPOINT") {
        Ok(url) => url,
        Err(err) => {
            eprintln!("{err}");
            return Err(Status::InternalServerError);
        }
    };
    let bucket_name = match env::var("ROOMS_BUCKET") {
        Ok(name) => name,
        Err(err) => {
            eprintln!("{err}");
            return Err(Status::InternalServerError);
        }
    };
    let sdk_config = aws_config::from_env().endpoint_url(endpoint).load().await;
    let config = s3::config::Builder::from(&sdk_config)
        .force_path_style(true)
        .build();
    let client = s3::Client::from_conf(config);
    let key = Uuid::new_v4().to_string();
    let presigning_config = match PresigningConfig::expires_in(Duration::from_secs(EXPIRES_IN)) {
        Ok(presigning_config) => presigning_config,
        Err(err) => {
            eprintln!("{err}");
            return Err(Status::InternalServerError);
        }
    };
    match client
        .put_object()
        .bucket(bucket_name)
        .key(key.clone())
        .presigned(presigning_config)
        .await
    {
        Ok(presigned) => Ok(view::photo::Upload::generate(
            presigned.uri().to_string(),
            key,
        )),
        Err(err) => {
            eprintln!("{err}");
            Err(Status::InternalServerError)
        }
    }
}

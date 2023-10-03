use aws_sdk_s3 as s3;
use s3::{presigning::PresigningConfig, Client};
use std::{env, time::Duration};

use rocket::http::Status;

const EXPIRES_IN: u64 = 3600;

pub struct S3Client {
    pub connection: Client,
    pub bucket_name: String,
}

#[rocket::async_trait]
pub trait S3Operation {
    async fn get_presigned_upload_url(&self, key: String) -> Result<String, Status>;
    async fn get_object(&self, key: String) -> Result<String, Status>;
}

impl S3Client {
    pub async fn new(bucket_name: String) -> Result<Self, Status> {
        let endpoint = match env::var("S3_ENDPOINT") {
            Ok(url) => url,
            Err(err) => {
                eprintln!("{err}");
                return Err(Status::InternalServerError);
            }
        };
        let sdk_config = aws_config::from_env().endpoint_url(endpoint).load().await;
        let config = s3::config::Builder::from(&sdk_config)
            .force_path_style(true)
            .build();
        Ok(S3Client {
            connection: s3::Client::from_conf(config),
            bucket_name,
        })
    }
}

#[rocket::async_trait]
impl S3Operation for S3Client {
    async fn get_presigned_upload_url(&self, key: String) -> Result<String, Status> {
        let presigning_config = match PresigningConfig::expires_in(Duration::from_secs(EXPIRES_IN))
        {
            Ok(presigning_config) => presigning_config,
            Err(err) => {
                eprintln!("{err}");
                return Err(Status::InternalServerError);
            }
        };
        match self
            .connection
            .put_object()
            .bucket(self.bucket_name.clone())
            .key(key.clone())
            .presigned(presigning_config)
            .await
        {
            Ok(presigned) => Ok(presigned.uri().to_string()),
            Err(err) => {
                eprintln!("{err}");
                Err(Status::InternalServerError)
            }
        }
    }

    async fn get_object(&self, key: String) -> Result<String, Status> {
        let presigning_config = match PresigningConfig::expires_in(Duration::from_secs(EXPIRES_IN))
        {
            Ok(presigning_config) => presigning_config,
            Err(err) => {
                eprintln!("{err}");
                return Err(Status::InternalServerError);
            }
        };
        match self
            .connection
            .get_object()
            .bucket(self.bucket_name.clone())
            .key(key.clone())
            .presigned(presigning_config)
            .await
        {
            Ok(presigned) => Ok(presigned.uri().to_string()),
            Err(err) => {
                eprintln!("{err}");
                Err(Status::InternalServerError)
            }
        }
    }
}

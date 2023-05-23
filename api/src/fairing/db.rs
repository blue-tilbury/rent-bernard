use rocket_sync_db_pools::database;

#[database("mysql")]
pub struct DbConn(diesel::MysqlConnection);

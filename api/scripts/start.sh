#!/bin/sh
sqlx migrate run && cargo watch -x run

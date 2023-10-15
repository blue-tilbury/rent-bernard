API_CONTAINER_NAME := $(shell docker ps | grep api | cut -d ' ' -f1)

# NAME is the name of the migration file
migrate_add:
	docker exec $(API_CONTAINER_NAME) sqlx migrate add $(NAME)

migrate_run:
	docker exec $(API_CONTAINER_NAME) sqlx migrate run

test:
	docker exec $(API_CONTAINER_NAME) cargo test

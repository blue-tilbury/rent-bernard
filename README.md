# Rent Bernard

## Introduction

Welcome to Rent Bernard, a web application designed for seamless and efficient searching of rooms or houses for rent. Modeled on the simplicity and convenience of platforms like Craigslist, Rent Bernard offers a user-friendly interface for both renters and property owners.

## Features

### For Renters

- **Search Listings**: Find rooms or houses for rent by location.
- **Filter Options**: Narrow down your search with filters like price range, pet-friendliness, and more.
- **User-Friendly Interface**: A smooth and intuitive browsing experience.

### For Owners

- **Post Ads**: Property owners can log in to the app to post their housing advertisements.
- **Manage Listings**: Edit or remove your listings with ease.

## Technology Stack

- **Backend**: Rust with the Rocket framework.
- **Frontend**: React.
- **Database**: PostgreSQL.
- **Image Storage**: Amazon S3 for storing room/house images.
- **Session Management**: Redis.

## Local Environment Setup

- **Starting the Application**: Simply run `docker compose up -d` in your terminal. This command sets up all the components needed to run Rent Bernard locally. The application will be available at [localhost:43000](http://localhost:43000).

## Data Migration

- **sqlx**: Used for managing data migration.
- **Makefile**: Provided to easily handle migration files.

### Migration Commands

- **Add Migration**: To add a new migration file, type `NAME=${name_of_migration_file} make migrate_add` in your shell.
- **Run Migration**: To execute a new migration file, enter `make migrate_run`.

## Testing

- **Unit Tests**: Run `make test` to execute unit tests inside the docker container.

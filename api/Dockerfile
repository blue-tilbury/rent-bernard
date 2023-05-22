FROM rust:1
WORKDIR /app
EXPOSE 58000
RUN cargo install cargo-watch
RUN cargo install diesel_cli
CMD ["cargo", "watch", "-x", "run"]

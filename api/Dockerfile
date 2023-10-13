FROM rust:1
WORKDIR /app
EXPOSE 58000
RUN cargo install sqlx-cli --no-default-features --features native-tls,postgres
RUN cargo install cargo-watch
CMD ["cargo", "watch", "-x", "run"]

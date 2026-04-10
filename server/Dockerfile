# Build stage
FROM rust:slim AS builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y pkg-config libssl-dev && rm -rf /var/lib/apt/lists/*

# Cache dependencies
COPY Cargo.toml Cargo.lock ./
COPY migration/Cargo.toml migration/
RUN mkdir -p src migration/src && \
    echo "fn main() {}" > src/main.rs && \
    echo "" > src/lib.rs && \
    echo "" > migration/src/lib.rs && \
    cargo build --release && \
    rm -rf src migration/src

# Build the real app
COPY . .
RUN touch src/main.rs src/lib.rs migration/src/lib.rs && \
    cargo build --release

# Runtime stage
FROM debian:bookworm-slim

WORKDIR /app

RUN apt-get update && apt-get install -y ca-certificates libssl3 && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/target/release/fairroom ./fairroom
COPY --from=builder /app/settings ./settings

ENV PORT=3000

EXPOSE 3000

CMD ["./fairroom"]

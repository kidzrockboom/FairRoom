#!/usr/bin/env bash

set -x
set -eo pipefail

# Check if a custom user has been set, otherwise default to 'postgres'
DB_USER="${POSTGRES_USER:=postgres}"
# Check if a custom password has been set, otherwise default to 'password'
DB_PASSWORD="${POSTGRES_PASSWORD:=password}"
# Check if a custom database name has been set, otherwise default to 'fair_room'
DB_NAME="${POSTGRES_DB:=fair_room}"
# Check if a custom port has been set, otherwise default to '5432'
DB_PORT="${POSTGRES_PORT:=5432}"

# Allow to skip Docker if a dockerized Postgres database is already running
if [[ -z "${SKIP_DOCKER}" ]]
then
  # if a postgres container is running, print instructions to kill it and exit
  RUNNING_POSTGRES_CONTAINER=$(docker ps --filter 'name=postgres' --format '{{.ID}}')
  if [[ -n $RUNNING_POSTGRES_CONTAINER ]]; then
    echo >&2 "there is a postgres container already running, kill it with"
    echo >&2 "    docker kill ${RUNNING_POSTGRES_CONTAINER}"
    exit 1
  fi
  CONTAINER_NAME="postgres_$(date '+%s')"
  # Launch postgres using Docker
  docker run \
      --env POSTGRES_USER="${DB_USER}" \
      --env POSTGRES_PASSWORD="${DB_PASSWORD}" \
      --env POSTGRES_DB="${DB_NAME}" \
      --health-cmd="pg_isready -U ${DB_USER} || exit 1" \
      --health-interval=1s \
      --health-timeout=5s \
      --health-retries=5 \
      --publish "${DB_PORT}":5432 \
      --detach \
      --name "${CONTAINER_NAME}" \
      postgres -N 1000
      # ^ Increased maximum number of connections for testing purposes
      
  until [ \
    "$(docker inspect -f "{{.State.Health.Status}}" ${CONTAINER_NAME})" == \
    "healthy" \
  ]; do     
    >&2 echo "Postgres is still unavailable - sleeping"
    sleep 1 
  done
fi

# Keep pinging Postgres until it's ready to accept commands
export PGPASSWORD="${DB_PASSWORD}"
until psql -h "localhost" -U "${DB_USER}" -p "${DB_PORT}" -d "postgres" -c '\q'; do
	>&2 echo "Postgres is still unavailable - sleeping"
	sleep 1
done

>&2 echo "Postgres is up and running on port ${DB_PORT}!"
export DATABASE_URL="postgres://${DB_USER}:${DB_PASSWORD}@localhost:${DB_PORT}/${DB_NAME}"
sea-orm-cli migrate up

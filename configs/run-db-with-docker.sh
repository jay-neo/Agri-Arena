#!/bin/bash

MAIN_DIR=$(realpath "$(dirname "$(realpath "$0")")/..")
WORKING_DIR="$MAIN_DIR/apps/web"

DATABASE_CONFIG_FILE="$MAIN_DIR/configs/database-config.json"
DATABASE_CONTAINER_NAME="agri-arena"

if [ -f "$DATABASE_CONFIG_FILE" ]; then
    DATABASE_USER=$(jq -r '.DATABASE_USER' $DATABASE_CONFIG_FILE)
    DATABASE_PASSWORD=$(jq -r '.DATABASE_PASSWORD' $DATABASE_CONFIG_FILE)
    DATABASE_NAME=$(jq -r '.DATABASE_NAME' $DATABASE_CONFIG_FILE)
    DATABASE_SERVER=$(jq -r '.DATABASE_SERVER' $DATABASE_CONFIG_FILE)
else
    read -p "Enter database username: " DATABASE_USER
    read -s -p "Enter database password: " DATABASE_PASSWORD
    read -p "Enter database name [arena]: " DATABASE_NAME
    read -p "Enter database server name [localhost:5432]: " DATABASE_SERVER
    echo "{
    \"DATABASE_USER\": \"$DATABASE_USER\",
    \"DATABASE_PASSWORD\": \"$DATABASE_PASSWORD\",
    \"DATABASE_NAME\": \"$DATABASE_NAME\",
    \"DATABASE_SERVER\": \"$DATABASE_SERVER\"
    }" > $DATABASE_CONFIG_FILE
fi

if [ "$(docker ps -aq -f name=$DATABASE_CONTAINER_NAME)" ]; then
    echo "Container '$DATABASE_CONTAINER_NAME' already exists. Starting the container..."
    docker start $DATABASE_CONTAINER_NAME
else
    echo "Container '$DATABASE_CONTAINER_NAME' does not exist. Creating and starting a new container..."
    docker run --name $DATABASE_CONTAINER_NAME -d -p 5432:5432 \
        -e POSTGRES_USER=$DATABASE_USER \
        -e POSTGRES_PASSWORD=$DATABASE_PASSWORD \
        -e POSTGRES_DB=$DATABASE_NAME \
        postgres:16
fi

if [ $? -eq 0 ] && [ -d "$WORKING_DIR/node_modules/prisma" ]; then
    if npx prisma studio; then
        open http://localhost:5555 > /dev/null 2>&1 &
    fi
fi

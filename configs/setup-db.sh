#!/bin/bash

MAIN_DIR=$(realpath "$(dirname "$(realpath "$0")")/..")

DATABASE_CONFIG_FILE="$MAIN_DIR/configs/database-config.json"
SAMPLE_ENV_FILE="$MAIN_DIR/apps/web/env.neo"
LOCAL_ENV_FILE="$MAIN_DIR/apps/web/env.local"

if [ -f "$SAMPLE_ENV_FILE" ]; then
    if [ ! -f "$LOCAL_ENV_FILE" ]; then
        touch "$LOCAL_ENV_FILE"
    fi
    cp -f "$SAMPLE_ENV_FILE" "$LOCAL_ENV_FILE"
else
    echo "$SAMPLE_ENV_FILE file does not exist!"
fi


read -p "Enter database username: " DATABASE_USER
read -s -p "Enter database password: " DATABASE_PASSWORD
read -p "Enter database name [arena]: " DATABASE_NAME
read -p "Enter database server name [localhost:5432]: " DATABASE_SERVER

read -p "Do you want to use docker for database? (y/N): " answer
answer=${answer:-n} # Set default value to 'n' if no input is given

if [[ "$answer" =~ ^[Yy]$ ]]; then
    echo "{
    \"DATABASE_USER\": \"$DATABASE_USER\",
    \"DATABASE_PASSWORD\": \"$DATABASE_PASSWORD\",
    \"DATABASE_NAME\": \"$DATABASE_NAME\",
    \"DATABASE_SERVER\": \"$DATABASE_SERVER\"
    }" > $DATABASE_CONFIG_FILE
elif [[ "$answer" =~ ^[Nn]$ ]]; then
    echo "You chose No!"
fi

if [ -f "$LOCAL_ENV_FILE" ]; then
    sed -i "s|^DATABASE_URL=.*|DATABASE_URL=\"postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@l$DATABASE_SERVER/$POSTGRES_DB?schema=public\"|" $LOCAL_ENV_FILE
    if ! grep -q "^DATABASE_URL=" $LOCAL_ENV_FILE; then
        echo "DATABASE_URL=\"postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@$DATABASE_SERVER/$POSTGRES_DB?schema=public\"" >> $LOCAL_ENV_FILE
    fi
else
    echo "$LOCAL_ENV_FILE file not found!"
fi


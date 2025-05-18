#!/bin/bash


if [ "$(docker ps -aq -f name=crawl4ai)" ]; then
    echo "Container crawl4ai already exists. Removing it..."
    docker rm -f crawl4ai
fi

echo "Starting crawl4ai container..."
docker run -d \
    -p 11235:11235 \
    --name crawl4ai \
    --env-file .env \
    --shm-size=1g \
    unclecode/crawl4ai:latest

# Wait a moment for the container to initialize
sleep 2

echo "Showing container logs..."
docker logs -f crawl4ai
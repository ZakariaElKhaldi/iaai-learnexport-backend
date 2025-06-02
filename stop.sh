#!/bin/bash

# Stop the backend services using Docker Compose
echo "Stopping LearnExpert backend services..."
docker-compose down

echo "All services have been stopped." 
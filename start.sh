#!/bin/bash

# Start the backend services using Docker Compose
echo "Starting LearnExpert backend services..."
docker-compose up -d

# Check if services are running
echo "Checking service status..."
docker-compose ps

echo "API Gateway is available at http://localhost:8080"
echo "Auth Service API is available at http://localhost:8080/api/auth" 
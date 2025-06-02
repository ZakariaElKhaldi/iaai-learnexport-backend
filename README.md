# LearnExpert Backend

This is the backend for the LearnExpert platform, implemented using a microservices architecture with NGINX as the API gateway.

## Architecture Overview

The backend consists of the following components:

1. **NGINX API Gateway** - Routes requests to appropriate microservices
2. **Auth Service** - Handles user authentication and management using Express.js and Supabase
3. **Courses Service** - Manages course content and learning materials (to be implemented)
4. **User Service** - Handles user profiles and preferences (to be implemented)

Each microservice is containerized using Docker and can be deployed independently.

## Directory Structure

```
backend/
├── nginx/                # NGINX API Gateway configuration
│   ├── Dockerfile
│   ├── nginx.conf        # Main NGINX configuration
│   └── default.conf      # API routes configuration
├── auth-service/         # Authentication service (Express.js + TypeScript + Supabase)
│   ├── src/              # TypeScript source code
│   ├── Dockerfile
│   └── package.json
├── courses-service/      # Courses service (to be implemented)
├── user-service/         # User service (to be implemented)
└── docker-compose.yml    # Docker Compose configuration for local development
```

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Supabase account and project

### Setup

1. Clone the repository
2. Configure environment variables:
   - Create `.env` files in each service directory based on the provided `.env.example` files
3. Start the services:

```bash
cd backend
docker-compose up
```

This will start all services defined in the `docker-compose.yml` file.

### Accessing the Services

- API Gateway: http://localhost:8080
- Auth Service: http://localhost:8080/api/auth
- Courses Service: http://localhost:8080/api/courses (when implemented)
- User Service: http://localhost:8080/api/users (when implemented)

## Development Workflow

Each microservice can be developed independently:

1. Make changes to the service code
2. Rebuild the Docker image: `docker-compose build <service-name>`
3. Restart the service: `docker-compose up -d <service-name>`

## Adding New Microservices

To add a new microservice:

1. Create a new directory for the service
2. Add the service configuration to `docker-compose.yml`
3. Configure the NGINX API gateway to route requests to the new service

## License

MIT 
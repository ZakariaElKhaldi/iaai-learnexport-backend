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

### Setup Environment Variables

1. Create a `.env` file in the root of the `backend` directory with the following contents:

```
NODE_ENV=development
PORT=3000

# Supabase configuration
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key

# JWT configuration
JWT_SECRET=your_jwt_secret
```

Replace the placeholder values with your actual Supabase credentials.

### Running with Docker Compose

1. Start the services:

```bash
cd backend
sudo docker compose up -d
```

2. Check if the services are running:

```bash
sudo docker compose ps
```

You should see both the `backend-nginx-1` and `backend-auth-service-1` containers running.

### Stopping the Services

```bash
cd backend
sudo docker compose down
```

## Accessing the Services

- API Gateway: http://localhost:8080
- Auth Service: http://localhost:3000
- Auth Service via Gateway: http://localhost:8080/api/auth

### Available Endpoints

#### API Gateway
- `GET /` - Returns a welcome message from the gateway

#### Auth Service
- `GET /health` - Health check endpoint (returns status 200 if service is up)
- `POST /register` - Register a new user
- `POST /login` - Sign in with email and password
- `POST /logout` - Sign out the current user
- `GET /me` - Get current user info (protected route)
- `GET /protected` - Example of a protected route

### Testing the Services

1. Test the API Gateway:

```bash
curl http://localhost:8080
```
Expected response: `LearnExpert API Gateway`

2. Test the Auth Service health check:

```bash
curl http://localhost:8080/api/auth/health
```
Expected response: `{"status":"ok","service":"auth-service"}`

3. Test user registration (note: may fail if Supabase setup is incomplete):

```bash
curl -X POST -H "Content-Type: application/json" http://localhost:8080/api/auth/register -d '{"email":"test@example.com", "password":"password123", "name":"Test User"}'
```

## Development Workflow

Each microservice can be developed independently:

1. Make changes to the service code
2. Rebuild the Docker image: `sudo docker compose build <service-name>`
3. Restart the service: `sudo docker compose up -d <service-name>`

## Troubleshooting

### Viewing Container Logs

To view logs for a specific service:

```bash
sudo docker logs backend-auth-service-1
sudo docker logs backend-nginx-1
```

### Testing Supabase Connection

To test if your Supabase connection is working correctly:

```bash
node auth-service/test-connection.js
```

### Common Issues

1. **Permission denied errors**: Make sure you're using `sudo` with Docker commands if not in the Docker group
2. **Database connection issues**: Verify your Supabase URL and key in the `.env` file
3. **NGINX gateway errors**: Check the NGINX configuration in `nginx/default.conf`

## License

MIT 
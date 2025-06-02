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
│   ├── default.conf      # API routing configuration
│   └── nginx.conf        # Main NGINX configuration
├── auth-service/         # Authentication microservice
│   ├── src/              # TypeScript source code
│   ├── dist/             # Compiled JavaScript code
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml    # Docker Compose configuration
├── .env                  # Environment variables for Docker Compose
└── README.md             # This file
```

## Prerequisites

- Docker
- Docker Compose
- Node.js (for local development)
- NPM or Yarn
- Supabase account and project

## Environment Variables

Create a `.env` file in the root of the backend directory with the following variables:

```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
JWT_SECRET=your_jwt_secret
```

## Running the Services

### Using Docker Compose

1. Make sure Docker and Docker Compose are installed
2. Create the `.env` file with required environment variables
3. Run the services:

```bash
docker compose up -d
```

4. To stop the services:

```bash
docker compose down
```

### Local Development

For local development of individual services:

1. Navigate to the service directory (e.g., `auth-service`)
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

## API Endpoints

### Auth Service

| Endpoint                | Method | Description              | Required Parameters         |
|-------------------------|--------|--------------------------|----------------------------|
| /api/auth/register      | POST   | Register new user        | email, password, name      |
| /api/auth/login         | POST   | Log in existing user     | email, password            |
| /api/auth/logout        | POST   | Log out user             | -                          |
| /api/auth/me            | GET    | Get current user details | Authorization header       |
| /api/auth/protected     | GET    | Example protected route  | Authorization header       |
| /api/auth/health        | GET    | Health check endpoint    | -                          |

## Testing the API

You can use curl or Postman to test the API endpoints. For example:

### Register a new user
```bash
curl -X POST \
  http://localhost:8080/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "user@gmail.com",
    "password": "password123",
    "name": "Test User"
}'
```

> **Important Note**: When testing registration, you must use a valid email domain (like gmail.com). The domain "example.com" is rejected by Supabase's authentication system.

### Login
```bash
curl -X POST \
  http://localhost:8080/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "user@gmail.com",
    "password": "password123"
}'
```

### Check health status
```bash
curl http://localhost:8080/api/auth/health
```

## Troubleshooting

### Docker Issues
- Make sure Docker daemon is running
- Check container logs with `docker compose logs`
- Verify that ports are not in use by other applications

### Supabase Issues
- Ensure your Supabase URL and key are correct in the .env file
- Check that email authentication is enabled in your Supabase project
- For testing, use email domains like gmail.com instead of example.com
- If you're having issues with database triggers, check the SQL schema in db-setup.sql

## Database Schema

The auth service uses a Supabase database with the following tables:

- user_profiles - Extends the Supabase auth.users table
- user_settings - Stores user preferences
- user_roles - Maps users to their roles
- roles - Defines available roles
- permissions - Defines available permissions
- role_permissions - Maps roles to permissions 
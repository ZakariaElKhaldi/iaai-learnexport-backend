# LearnExpert Backend

This is the backend for the LearnExpert platform, implemented using a microservices architecture with NGINX as the API gateway and Supabase for authentication and database services.

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
│   │   ├── index.ts      # Main entry point
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Middleware functions
│   │   └── types/        # TypeScript type definitions
│   ├── dist/             # Compiled JavaScript code
│   ├── __tests__/        # Unit and integration tests
│   ├── db-setup.sql      # Database schema setup
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml    # Docker Compose configuration
├── start.sh              # Script to start services
├── stop.sh               # Script to stop services
├── .env                  # Environment variables for Docker Compose
└── README.md             # This file
```

## Prerequisites

- Docker (v20.10+)
- Docker Compose (v2.0+)
- Node.js (v16+) (for local development)
- NPM (v7+) or Yarn (v1.22+)
- Supabase account and project

## Complete Setup Guide

### 1. Supabase Setup

1. Create a Supabase account at [https://supabase.com](https://supabase.com) if you don't have one
2. Create a new project in Supabase
3. Note your project URL and anon key (found in Project Settings > API)
4. Set up the database schema:
   - Go to the SQL Editor in your Supabase project
   - Copy the contents of `auth-service/db-setup.sql` and execute it in the SQL Editor
   - This will create all necessary tables, functions, and triggers

### 2. Environment Configuration

Create a `.env` file in the root of the backend directory with the following variables:

```
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
JWT_SECRET=your_secure_jwt_secret
```

Replace the placeholders with your actual values:
- `your_supabase_project_url`: The URL of your Supabase project (e.g., https://xyzproject.supabase.co)
- `your_supabase_anon_key`: The anon/public key from your Supabase project
- `your_secure_jwt_secret`: A secure random string for JWT token signing (generate one with `openssl rand -base64 32`)

### 3. Running the Services

#### Using Docker Compose (Recommended for Production)

1. Make sure Docker and Docker Compose are installed and the Docker daemon is running
2. Ensure you've created the `.env` file with required environment variables
3. Make the start/stop scripts executable:
   ```bash
   chmod +x start.sh stop.sh
   ```
4. Start the services:
   ```bash
   ./start.sh
   ```
   Alternatively, you can use:
   ```bash
   docker compose up -d
   ```
5. To stop the services:
   ```bash
   ./stop.sh
   ```
   Or:
   ```bash
   docker compose down
   ```

#### Local Development Setup

For local development of individual services:

1. Navigate to the service directory (e.g., `auth-service`)
2. Create a `.env` file in the service directory with the same environment variables
3. Install dependencies:
   ```bash
   npm install
   ```
4. Build the TypeScript code:
   ```bash
   npm run build
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

### 4. Verifying the Setup

Once your services are running, verify that everything is working:

1. Check if the services are running:
   ```bash
   docker compose ps
   ```
   You should see both `backend-nginx-1` and `backend-auth-service-1` containers running.

2. Test the health endpoint:
   ```bash
   curl http://localhost:8080/api/auth/health
   ```
   Expected response: `{"status":"success","message":"Auth service is healthy"}`

## Database Schema

The auth service uses a Supabase database with the following tables:

- **auth.users** - Managed by Supabase, stores user credentials (passwords are securely hashed)
- **user_profiles** - Extends the Supabase auth.users table with additional user information
- **user_settings** - Stores user preferences
- **user_subscriptions** - Manages subscription information
- **user_sessions** - Tracks user login sessions
- **password_reset_tokens** - Manages password reset tokens
- **roles** - Defines available roles (user, admin, creator, consultant)
- **permissions** - Defines available permissions
- **role_permissions** - Maps roles to permissions
- **user_roles** - Maps users to their roles

### Database Triggers

The system uses a trigger function to automatically create user profiles when new users register:

- `handle_new_user()` - Creates user profile, settings, and assigns default role on signup

## API Endpoints

### Auth Service

| Endpoint                | Method | Description              | Required Parameters         | Returns                                  |
|-------------------------|--------|--------------------------|----------------------------|------------------------------------------|
| /api/auth/register      | POST   | Register new user        | email, password, name      | User object with ID                      |
| /api/auth/login         | POST   | Log in existing user     | email, password            | User object and session token            |
| /api/auth/logout        | POST   | Log out user             | -                          | Success message                          |
| /api/auth/me            | GET    | Get current user details | Authorization header       | User profile details                     |
| /api/auth/protected     | GET    | Example protected route  | Authorization header       | Protected resource                       |
| /api/auth/health        | GET    | Health check endpoint    | -                          | Service status                           |

## Testing the API

You can use curl, Postman, or any API client to test the endpoints:

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

### Access protected endpoint
```bash
curl -X GET \
  http://localhost:8080/api/auth/protected \
  -H 'Authorization: Bearer your_token_here'
```

### Check health status
```bash
curl http://localhost:8080/api/auth/health
```

## Running Tests

The auth service includes comprehensive tests:

```bash
cd auth-service
npm test
```

For test coverage report:
```bash
npm run test:coverage
```

## Security Considerations

1. **Password Storage**: Passwords are never stored in plaintext. Supabase handles password hashing securely.
2. **JWT Authentication**: The system uses JWT tokens for authentication.
3. **Environment Variables**: Sensitive information is stored in environment variables, not in code.
4. **Row Level Security**: Supabase RLS policies ensure users can only access their own data.

## Troubleshooting

### Docker Issues
- Make sure Docker daemon is running: `systemctl status docker`
- Check container logs: `docker compose logs` or `docker logs backend-auth-service-1`
- Verify that ports 8080 and 3000 are not in use by other applications
- If you encounter permission issues, use `sudo` with Docker commands or add your user to the Docker group

### Supabase Issues
- Ensure your Supabase URL and key are correct in the .env file
- Check that email authentication is enabled in your Supabase project (Authentication > Providers > Email)
- For testing, use email domains like gmail.com instead of example.com
- If you're having issues with database triggers, check the SQL schema in db-setup.sql
- Verify that the database tables were created correctly in the Supabase dashboard

### Connection Issues
- Test the Supabase connection directly: `node auth-service/test-connection.js`
- Check if the auth-service can connect to Supabase: `docker logs backend-auth-service-1`
- Ensure your firewall allows outbound connections to Supabase

## Extending the Backend

To add new services:

1. Create a new directory for your service
2. Add a Dockerfile and necessary code
3. Update the docker-compose.yml file to include your service
4. Add appropriate routing in nginx/default.conf

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests for your changes
5. Submit a pull request

## License

MIT 
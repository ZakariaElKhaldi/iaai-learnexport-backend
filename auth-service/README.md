# Auth Service

This microservice handles authentication and user management for the LearnExpert platform using Express.js, TypeScript, and Supabase.

## Features

- User registration
- User login
- User logout
- User profile management
- JWT-based authentication
- Protected routes

## Tech Stack

- Node.js
- Express.js
- TypeScript
- Supabase (Authentication & Database)
- Docker

## Setup

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- Supabase account and project

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
NODE_ENV=development
PORT=3000
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
JWT_SECRET=your_jwt_secret_key
```

### Installation

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Run in production mode
npm start
```

### Docker

```bash
# Build the Docker image
docker build -t auth-service .

# Run the container
docker run -p 3000:3000 auth-service
```

## API Endpoints

### Authentication

- `POST /register` - Register a new user
- `POST /login` - Login a user
- `POST /logout` - Logout a user
- `GET /me` - Get current user info (protected)
- `GET /protected` - Example protected route

## License

MIT 
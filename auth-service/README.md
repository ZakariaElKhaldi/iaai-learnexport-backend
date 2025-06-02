# Auth Service

Authentication and authorization microservice for the IAAI Learning Platform.

## Overview

This service handles:
- User registration
- User login/logout
- Token validation
- Protected route access
- Integration with Supabase Auth

## Technology Stack

- TypeScript
- Express.js
- Supabase Auth
- Jest (testing)
- Docker

## Local Development

### Prerequisites

- Node.js v16+
- npm or yarn
- Supabase account and project

### Environment Setup

Create a `.env` file in the root of this directory:

```
SUPABASE_URL=https://your-supabase-project.supabase.co
SUPABASE_KEY=your-supabase-service-role-key
JWT_SECRET=your-jwt-secret
PORT=3000
```

### Installation

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Run development server
npm run dev
```

## Testing

This service uses Jest for testing. The tests are located in the `src/__tests__` directory.

### Running Tests

```bash
# Run all tests
npm test

# Run tests with watch mode
npm run test:watch

# Generate test coverage report
npm run test:coverage
```

### Test Structure

- `src/__tests__/routes/`: Tests for API routes
- `src/__tests__/middleware/`: Tests for middleware functions
- `src/__tests__/`: General tests

### Writing Tests

When writing tests:
1. Use descriptive test names
2. Mock external dependencies (Supabase)
3. Test both success and failure cases
4. Test edge cases

Example:

```typescript
describe('Auth Routes', () => {
  it('should register a new user successfully', async () => {
    // Test code here
  });
  
  it('should return 400 with invalid input', async () => {
    // Test code here
  });
});
```

## API Endpoints

### POST /auth/register

Register a new user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "username": "username",
  "fullName": "Full Name"
}
```

**Response:**
```json
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "username": "username"
  },
  "token": "jwt-token"
}
```

### POST /auth/login

Login with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "user": {
    "id": "user-id",
    "email": "user@example.com"
  },
  "token": "jwt-token"
}
```

### POST /auth/logout

Logout the current user.

**Headers:**
```
Authorization: Bearer jwt-token
```

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

### GET /auth/me

Get the current user's profile.

**Headers:**
```
Authorization: Bearer jwt-token
```

**Response:**
```json
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "username": "username",
    "fullName": "Full Name"
  }
}
```

## Database Integration

This service uses Supabase for authentication and database operations. See the `DB-SETUP-README.md` file for details on the database schema and setup. 
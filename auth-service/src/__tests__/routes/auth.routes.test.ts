import request from 'supertest';
import express from 'express';
import { createClient } from '@supabase/supabase-js';
import authRoutes from '../../routes/auth.routes';

// Mock Supabase client
jest.mock('@supabase/supabase-js');

describe('Auth Routes', () => {
  let app: express.Application;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Create Express app for testing
    app = express();
    app.use(express.json());
    app.use('/auth', authRoutes);
  });
  
  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      // Mock successful registration
      const mockSignUp = jest.fn().mockResolvedValue({
        data: { user: { id: 'user-123' }, session: { access_token: 'test-token' } },
        error: null
      });
      
      (createClient as jest.Mock).mockReturnValue({
        auth: {
          signUp: mockSignUp
        }
      });
      
      const response = await request(app)
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Password123!',
          username: 'testuser',
          fullName: 'Test User'
        });
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Password123!',
        options: {
          data: {
            username: 'testuser',
            full_name: 'Test User'
          }
        }
      });
    });
    
    it('should return 400 with invalid input', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          email: 'invalid-email',
          password: '123', // Too short
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
    
    it('should return 500 when Supabase returns an error', async () => {
      // Mock Supabase error
      const mockSignUp = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Email already registered' }
      });
      
      (createClient as jest.Mock).mockReturnValue({
        auth: {
          signUp: mockSignUp
        }
      });
      
      const response = await request(app)
        .post('/auth/register')
        .send({
          email: 'existing@example.com',
          password: 'Password123!',
          username: 'existinguser',
          fullName: 'Existing User'
        });
      
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });
  
  describe('POST /auth/login', () => {
    it('should login a user successfully', async () => {
      // Mock successful login
      const mockSignIn = jest.fn().mockResolvedValue({
        data: { user: { id: 'user-123' }, session: { access_token: 'test-token' } },
        error: null
      });
      
      (createClient as jest.Mock).mockReturnValue({
        auth: {
          signInWithPassword: mockSignIn
        }
      });
      
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password123!'
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(mockSignIn).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Password123!'
      });
    });
    
    it('should return 401 with invalid credentials', async () => {
      // Mock failed login
      const mockSignIn = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Invalid login credentials' }
      });
      
      (createClient as jest.Mock).mockReturnValue({
        auth: {
          signInWithPassword: mockSignIn
        }
      });
      
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'wrong@example.com',
          password: 'WrongPassword123!'
        });
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });
  
  describe('POST /auth/logout', () => {
    it('should logout a user successfully', async () => {
      // Mock successful logout
      const mockSignOut = jest.fn().mockResolvedValue({
        error: null
      });
      
      (createClient as jest.Mock).mockReturnValue({
        auth: {
          signOut: mockSignOut
        }
      });
      
      const response = await request(app)
        .post('/auth/logout')
        .set('Authorization', 'Bearer test-token');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Logged out successfully');
      expect(mockSignOut).toHaveBeenCalled();
    });
  });
}); 
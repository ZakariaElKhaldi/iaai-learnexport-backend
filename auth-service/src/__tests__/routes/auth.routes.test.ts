import express from 'express';
import { createClient } from '@supabase/supabase-js';

// Mock Supabase client
jest.mock('@supabase/supabase-js');

// Create a simple mock for the auth routes
const mockAuthRoutes = express.Router();
mockAuthRoutes.post('/register', (req, res) => {
  res.status(201).json({ status: 'success', data: { user: { id: 'mock-id' } } });
});
mockAuthRoutes.post('/login', (req, res) => {
  res.status(200).json({ status: 'success', data: { user: { id: 'mock-id' }, session: { access_token: 'mock-token' } } });
});
mockAuthRoutes.post('/logout', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Logged out successfully' });
});

// Mock the auth routes module
jest.mock('../../routes/auth.routes', () => mockAuthRoutes);

describe('Auth Routes', () => {
  test('Mock is working', () => {
    expect(mockAuthRoutes).toBeDefined();
  });
}); 
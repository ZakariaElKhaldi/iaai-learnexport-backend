// This file contains setup code for Jest tests

// Set environment variables for testing
process.env.NODE_ENV = 'test';
process.env.PORT = '3001'; // Use a different port for tests

// Mock Supabase - using global Jest object
jest.mock('@supabase/supabase-js', () => {
  const mockAuth = {
    signUp: jest.fn(),
    signInWithPassword: jest.fn(),
    signOut: jest.fn(),
    getUser: jest.fn(),
    getSession: jest.fn(),
  };
  
  return {
    createClient: jest.fn(() => ({
      auth: mockAuth,
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(),
            data: [],
            error: null,
          })),
          data: [],
          error: null,
        })),
        insert: jest.fn(() => ({
          data: { id: 'mock-id' },
          error: null,
        })),
        update: jest.fn(() => ({
          eq: jest.fn(() => ({
            data: { id: 'mock-id' },
            error: null,
          })),
        })),
        delete: jest.fn(() => ({
          eq: jest.fn(() => ({
            data: null,
            error: null,
          })),
        })),
      })),
    })),
  };
});

// Global afterAll
afterAll(async () => {
  // Clean up resources after all tests
}); 
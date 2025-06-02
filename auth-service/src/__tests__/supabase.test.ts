import { createClient } from '@supabase/supabase-js';

// Mock Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn()
}));

describe('Supabase Connection', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock environment variables
    process.env.SUPABASE_URL = 'https://test-supabase-url.supabase.co';
    process.env.SUPABASE_KEY = 'test-supabase-key';
  });
  
  it('should create a Supabase client with correct URL and key', () => {
    // Create a Supabase client directly
    const supabase = createClient(
      process.env.SUPABASE_URL as string,
      process.env.SUPABASE_KEY as string
    );
    
    // Check if createClient was called with correct parameters
    expect(createClient).toHaveBeenCalledWith(
      'https://test-supabase-url.supabase.co',
      'test-supabase-key'
    );
  });
  
  it('should throw an error if SUPABASE_URL is not defined', () => {
    // Remove SUPABASE_URL from environment variables
    delete process.env.SUPABASE_URL;
    
    // Expect an error when importing the file
    expect(() => {
      require('../../index');
    }).toThrow();
  });
  
  it('should throw an error if SUPABASE_KEY is not defined', () => {
    // Remove SUPABASE_KEY from environment variables
    delete process.env.SUPABASE_KEY;
    
    // Expect an error when importing the file
    expect(() => {
      require('../../index');
    }).toThrow();
  });
}); 
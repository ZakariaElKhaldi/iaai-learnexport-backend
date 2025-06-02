import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Mock fs and supabase
jest.mock('fs');
jest.mock('@supabase/supabase-js');
jest.mock('dotenv', () => ({
  config: jest.fn(),
}));

describe('Database Setup Script', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock environment variables
    process.env.SUPABASE_URL = 'https://test-supabase-url.supabase.co';
    process.env.SUPABASE_KEY = 'test-supabase-key';
    
    // Mock fs.readFileSync
    (fs.readFileSync as jest.Mock).mockReturnValue(
      'CREATE TABLE test_table (id SERIAL PRIMARY KEY);'
    );
    
    // Mock Supabase client
    (createClient as jest.Mock).mockReturnValue({
      rpc: jest.fn().mockReturnValue({
        data: null,
        error: null,
      }),
    });
  });
  
  it('should read the SQL file and execute statements', async () => {
    // Import the setup-db script
    const setupDb = require('../../setup-db');
    
    // Check if fs.readFileSync was called with correct path
    expect(fs.readFileSync).toHaveBeenCalledWith(
      expect.stringContaining('db-setup.sql'),
      'utf8'
    );
    
    // Check if createClient was called with correct parameters
    expect(createClient).toHaveBeenCalledWith(
      'https://test-supabase-url.supabase.co',
      'test-supabase-key'
    );
    
    // Check if rpc was called with exec_sql
    const supabaseClient = (createClient as jest.Mock).mock.results[0].value;
    expect(supabaseClient.rpc).toHaveBeenCalledWith(
      'exec_sql',
      { sql: 'CREATE TABLE test_table (id SERIAL PRIMARY KEY);' }
    );
  });
  
  it('should throw an error if SUPABASE_URL is not defined', async () => {
    // Remove SUPABASE_URL from environment variables
    delete process.env.SUPABASE_URL;
    
    // Expect an error when importing the file
    expect(() => {
      require('../../setup-db');
    }).toThrow();
  });
  
  it('should throw an error if SUPABASE_KEY is not defined', async () => {
    // Remove SUPABASE_KEY from environment variables
    delete process.env.SUPABASE_KEY;
    
    // Expect an error when importing the file
    expect(() => {
      require('../../setup-db');
    }).toThrow();
  });
  
  it('should handle SQL execution errors', async () => {
    // Mock Supabase client to return an error
    (createClient as jest.Mock).mockReturnValue({
      rpc: jest.fn().mockReturnValue({
        data: null,
        error: { message: 'SQL execution error' },
      }),
    });
    
    // Spy on console.error
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    
    // Import the setup-db script
    require('../../setup-db');
    
    // Check if console.error was called with the error message
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Error executing statement'),
      expect.objectContaining({ message: 'SQL execution error' })
    );
    
    // Restore console.error
    consoleErrorSpy.mockRestore();
  });
}); 
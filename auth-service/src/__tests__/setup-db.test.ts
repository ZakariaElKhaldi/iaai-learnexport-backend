import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Mock fs and supabase
jest.mock('fs', () => ({
  readFileSync: jest.fn().mockReturnValue('CREATE TABLE test_table (id SERIAL PRIMARY KEY)')
}));

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn().mockReturnValue({
    rpc: jest.fn().mockReturnValue({
      data: null,
      error: null
    })
  })
}));

// Mock dotenv
jest.mock('dotenv', () => ({
  config: jest.fn()
}));

// Mock process.exit
const mockExit = jest.spyOn(process, 'exit').mockImplementation((code) => {
  throw new Error(`Process.exit(${code})`);
});

describe('Database Setup Script', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock environment variables
    process.env.SUPABASE_URL = 'https://test-supabase-url.supabase.co';
    process.env.SUPABASE_KEY = 'test-supabase-key';
  });
  
  afterAll(() => {
    mockExit.mockRestore();
  });
  
  it('should read the SQL file and execute statements', () => {
    // Import the setup-db script
    jest.isolateModules(() => {
      require('../../setup-db');
    });
    
    // Check if fs.readFileSync was called
    expect(fs.readFileSync).toHaveBeenCalled();
    
    // Check if createClient was called with correct parameters
    expect(createClient).toHaveBeenCalledWith(
      'https://test-supabase-url.supabase.co',
      'test-supabase-key'
    );
    
    // Check if rpc was called
    const supabaseClient = (createClient as jest.Mock).mock.results[0].value;
    expect(supabaseClient.rpc).toHaveBeenCalledWith(
      'exec_sql',
      { sql: expect.any(String) }
    );
  });
  
  it('should throw an error if SUPABASE_URL is not defined', () => {
    // Remove SUPABASE_URL from environment variables
    delete process.env.SUPABASE_URL;
    
    // Expect an error when importing the file
    expect(() => {
      jest.isolateModules(() => {
        require('../../setup-db');
      });
    }).toThrow();
  });
  
  it('should throw an error if SUPABASE_KEY is not defined', () => {
    // Reset environment variables
    process.env.SUPABASE_URL = 'https://test-supabase-url.supabase.co';
    delete process.env.SUPABASE_KEY;
    
    // Expect an error when importing the file
    expect(() => {
      jest.isolateModules(() => {
        require('../../setup-db');
      });
    }).toThrow();
  });
}); 
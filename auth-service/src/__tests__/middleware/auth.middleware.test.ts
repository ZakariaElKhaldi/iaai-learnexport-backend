import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import { authMiddleware } from '../../middleware/auth.middleware';

// Mock Supabase client
jest.mock('@supabase/supabase-js');

describe('Auth Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup request and response objects
    mockRequest = {
      headers: {},
    };
    
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    
    nextFunction = jest.fn();
  });
  
  it('should return 401 if no authorization header is present', async () => {
    await authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);
    
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Unauthorized: No token provided' });
    expect(nextFunction).not.toHaveBeenCalled();
  });
  
  it('should return 401 if token format is invalid', async () => {
    mockRequest.headers = {
      authorization: 'InvalidTokenFormat',
    };
    
    await authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);
    
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Unauthorized: Invalid token format' });
    expect(nextFunction).not.toHaveBeenCalled();
  });
  
  it('should return 401 if token verification fails', async () => {
    mockRequest.headers = {
      authorization: 'Bearer invalid-token',
    };
    
    // Mock Supabase getUser to return an error
    const mockGetUser = jest.fn().mockResolvedValue({
      data: { user: null },
      error: { message: 'Invalid token' },
    });
    
    (createClient as jest.Mock).mockReturnValue({
      auth: {
        getUser: mockGetUser,
      },
    });
    
    await authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);
    
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Unauthorized: Invalid token' });
    expect(nextFunction).not.toHaveBeenCalled();
  });
  
  it('should add user to request and call next if token is valid', async () => {
    mockRequest.headers = {
      authorization: 'Bearer valid-token',
    };
    
    const mockUser = { id: 'user-123', email: 'test@example.com' };
    
    // Mock Supabase getUser to return a valid user
    const mockGetUser = jest.fn().mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });
    
    (createClient as jest.Mock).mockReturnValue({
      auth: {
        getUser: mockGetUser,
      },
    });
    
    await authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);
    
    expect(mockRequest.user).toEqual(mockUser);
    expect(nextFunction).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
  });
}); 
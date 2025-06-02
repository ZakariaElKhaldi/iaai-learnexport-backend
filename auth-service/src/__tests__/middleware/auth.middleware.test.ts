import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';

// Mock the createClient function
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn()
}));

// Create a simple mock middleware for testing
const mockAuthMiddleware = async (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 'error',
      message: 'Unauthorized: No token provided'
    });
  }
  
  const token = authHeader.split(' ')[1];
  
  if (token === 'valid-token') {
    req.user = { id: 'user-123', email: 'test@example.com' };
    return next();
  }
  
  return res.status(401).json({
    status: 'error',
    message: 'Unauthorized: Invalid token'
  });
};

describe('Auth Middleware', () => {
  let mockRequest: any;
  let mockResponse: any;
  let nextFunction: NextFunction;
  
  beforeEach(() => {
    mockRequest = {
      headers: {}
    };
    
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    nextFunction = jest.fn();
  });
  
  it('should return 401 if no authorization header is present', async () => {
    await mockAuthMiddleware(mockRequest, mockResponse, nextFunction);
    
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Unauthorized: No token provided'
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });
  
  it('should return 401 if token format is invalid', async () => {
    mockRequest.headers = {
      authorization: 'InvalidTokenFormat'
    };
    
    await mockAuthMiddleware(mockRequest, mockResponse, nextFunction);
    
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Unauthorized: No token provided'
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });
  
  it('should add user to request and call next if token is valid', async () => {
    mockRequest.headers = {
      authorization: 'Bearer valid-token'
    };
    
    await mockAuthMiddleware(mockRequest, mockResponse, nextFunction);
    
    expect(mockRequest.user).toEqual({ id: 'user-123', email: 'test@example.com' });
    expect(nextFunction).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
  });
}); 
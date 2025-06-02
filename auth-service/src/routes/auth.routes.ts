import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { supabase } from '../index';
import { isAuthenticated, AuthRequest } from '../middleware/auth.middleware';

const router = express.Router();

// Register a new user
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Email and password are required' 
      });
    }
    
    // Register user with Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        }
      }
    });
    
    if (error) {
      return res.status(400).json({ 
        status: 'error', 
        message: error.message 
      });
    }
    
    return res.status(201).json({
      status: 'success',
      message: 'Registration successful. Please check your email for confirmation.',
      data: {
        user: data.user
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ 
      status: 'error', 
      message: 'An error occurred during registration' 
    });
  }
});

// Login user
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Email and password are required' 
      });
    }
    
    // Sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      return res.status(401).json({ 
        status: 'error', 
        message: 'Invalid credentials' 
      });
    }
    
    return res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        user: data.user,
        session: data.session
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      status: 'error', 
      message: 'An error occurred during login' 
    });
  }
});

// Logout user
router.post('/logout', async (req: Request, res: Response) => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return res.status(400).json({ 
        status: 'error', 
        message: error.message 
      });
    }
    
    return res.status(200).json({
      status: 'success',
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ 
      status: 'error', 
      message: 'An error occurred during logout' 
    });
  }
});

// Get current user
router.get('/me', isAuthenticated, async (req: AuthRequest, res: Response) => {
  try {
    // User is already attached to the request by the middleware
    return res.status(200).json({
      status: 'success',
      data: {
        user: req.user
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({ 
      status: 'error', 
      message: 'An error occurred while fetching user data' 
    });
  }
});

// Protected route example
router.get('/protected', isAuthenticated, (req: AuthRequest, res: Response) => {
  return res.status(200).json({
    status: 'success',
    message: 'You have access to this protected route',
    data: {
      user: req.user
    }
  });
});

export default router; 
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

/**
 * Authentication Middleware
 * Purpose: Protect routes by verifying JWT tokens and ensuring only authenticated users can access
 * 
 * How it works:
 * 1. Extracts token from Authorization header (Bearer <token>)
 * 2. Validates token format and existence
 * 3. Verifies token signature using JWT_SECRET
 * 4. Fetches user data from database
 * 5. Attaches user to request object for downstream handlers
 * 
 * Usage: router.get('/protected-route', protect, controller)
 */
export const protect = async (req, res, next) => {
  // Extract JWT token from Authorization header
  // Expected format: "Bearer <token>"
  let token = req.headers.authorization?.startsWith('Bearer')
    ? req.headers.authorization.split(' ')[1]
    : null;

  // Check if token exists
  if (!token) {
    return res.status(401).json({ message: 'Not authorized. No token.' });
  }

  try {
    // Verify token signature and decode it
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user in database by ID from decoded token (exclude password for security)
    const user = await User.findById(decoded.id).select('-password');
    
    // Check if user still exists in database
    if (!user) {
      return res.status(401).json({ message: 'User not found.' });
    }
    
    // Attach user object to request so handlers can access it
    req.user = user;
    
    // Call next middleware/route handler
    next();
  } catch (err) {
    // Token verification failed (invalid, expired, tampered, etc.)
    return res.status(401).json({ message: 'Not authorized. Invalid token.' });
  }
};

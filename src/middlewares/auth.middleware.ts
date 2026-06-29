import { Request, Response, NextFunction } from 'express';
import { auth } from '../config/firebase';

/**
 * Extended Express Request interface that includes the authenticated user payload.
 */
export interface AuthRequest extends Request {
  user?: {
    /** Firebase UID of the authenticated user */
    uid: string;
    /** Email address of the authenticated user */
    email: string;
    /** Role assigned via Firebase custom claims: 'admin' or 'member' */
    role: string;
  };
}

/**
 * Middleware to verify Firebase Authentication Bearer tokens.
 * Extracts the token from the Authorization header, verifies it with Firebase Auth,
 * and attaches the decoded user payload to req.user for use in downstream handlers.
 * @param req - Express request extended with user field
 * @param res - Express response
 * @param next - Next middleware function
 * @returns {Promise<void>} Calls next() on success or returns 401 on failure
 */
export const verifyToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  // Reject requests without a Bearer token in the Authorization header
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: No token provided' });
    return;
  }

  // Extract the raw token from "Bearer <token>"
  const token = authHeader.split('Bearer ')[1];

  try {
    // Verify the token cryptographic signature and expiry with Firebase
    const decoded = await auth.verifyIdToken(token);

    // Attach user info to the request for use in controllers
    req.user = {
      uid: decoded.uid,
      email: decoded.email || '',
      // Fall back to 'member' if no custom claim role was set
      role: (decoded.role as string) || 'member',
    };

    next();
  } catch {
    // Token is expired, malformed, or revoked
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

/**
 * Middleware to restrict endpoint access to admin users only.
 * Must be used after verifyToken middleware in the middleware chain.
 * @param req - Express request with authenticated user payload
 * @param res - Express response
 * @param next - Next middleware function
 * @returns {void} Calls next() for admins or returns 403 for non-admins
 */
export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.role !== 'admin') {
    res.status(403).json({ error: 'Forbidden: Admin access required' });
    return;
  }
  next();
};

/**
 * Middleware factory that restricts access to users with a specific role.
 * Admin users always pass regardless of the required role.
 * @param role - The minimum role required to access the endpoint
 * @returns Express middleware function that enforces the role check
 */
export const requireRole = (role: 'admin' | 'member') => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Admins bypass all role restrictions
    if (req.user.role !== role && req.user.role !== 'admin') {
      res.status(403).json({ error: `Forbidden: ${role} access required` });
      return;
    }

    next();
  };
};
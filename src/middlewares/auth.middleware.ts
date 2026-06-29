import { Request, Response, NextFunction } from 'express';
import { auth } from '../config/firebase';

export interface AuthRequest extends Request {
  user?: {
    uid: string;
    email: string;
    role: string;
  };
}

/**
 * Middleware to verify Firebase Auth Bearer token
 * @param req - Express request with user field
 * @param res - Express response
 * @param next - Next middleware
 */
export const verifyToken = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: No token provided' });
    return;
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decoded = await auth.verifyIdToken(token);
    req.user = {
      uid: decoded.uid,
      email: decoded.email || '',
      role: (decoded.role as string) || 'member',
    };
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

/**
 * Middleware to restrict access to admin role only
 * @param req - Express request with user field
 * @param res - Express response
 * @param next - Next middleware
 */
export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user?.role !== 'admin') {
    res.status(403).json({ error: 'Forbidden: Admin access required' });
    return;
  }
  next();
};

/**
 * Middleware factory to require a specific role
 * @param role - Required role ('admin' or 'member')
 */
export const requireRole = (role: 'admin' | 'member') => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    if (req.user.role !== role && req.user.role !== 'admin') {
      res.status(403).json({ error: `Forbidden: ${role} access required` });
      return;
    }
    next();
  };
};
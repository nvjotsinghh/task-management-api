import { Request, Response } from 'express';
import * as authService from '../services/auth.service';

/**
 * POST /auth/register - Register a new user
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (err: unknown) {
    const e = err as { status?: number; message?: string; response?: { data?: { error?: { message?: string } } } };
    const message = e.response?.data?.error?.message || e.message || 'Registration failed';
    res.status(e.status || 400).json({ error: message });
  }
};

/**
 * POST /auth/login - Login an existing user
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await authService.login(req.body);
    res.status(200).json(result);
  } catch (err: unknown) {
    const e = err as { status?: number; message?: string; response?: { data?: { error?: { message?: string } } } };
    const message = e.response?.data?.error?.message || e.message || 'Login failed';
    res.status(401).json({ error: message });
  }
};
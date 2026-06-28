import { Request, Response } from 'express';
import * as authController from '../../controllers/auth.controller';
import * as authService from '../../services/auth.service';

jest.mock('../../services/auth.service');

const mockAuthResponse = {
  uid: 'user123',
  email: 'test@test.com',
  token: 'mock-token',
  role: 'admin',
};

const mockReq = (body = {}): Request => ({ body } as Request);
const mockRes = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Auth Controller', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('register', () => {
    it('should return 201 on successful registration', async () => {
      (authService.register as jest.Mock).mockResolvedValue(mockAuthResponse);
      const req = mockReq({ email: 'test@test.com', password: '123456', role: 'admin' });
      const res = mockRes();
      await authController.register(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockAuthResponse);
    });

    it('should return 400 on registration failure', async () => {
      (authService.register as jest.Mock).mockRejectedValue({ message: 'Email already exists' });
      const req = mockReq({ email: 'test@test.com', password: '123456' });
      const res = mockRes();
      await authController.register(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Email already exists' });
    });
  });

  describe('login', () => {
    it('should return 200 on successful login', async () => {
      (authService.login as jest.Mock).mockResolvedValue(mockAuthResponse);
      const req = mockReq({ email: 'test@test.com', password: '123456' });
      const res = mockRes();
      await authController.login(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockAuthResponse);
    });

    it('should return 401 on login failure', async () => {
      (authService.login as jest.Mock).mockRejectedValue({ message: 'Invalid credentials' });
      const req = mockReq({ email: 'test@test.com', password: 'wrong' });
      const res = mockRes();
      await authController.login(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
    });
  });
});
import * as authService from '../auth.service';
import { auth } from '../../config/firebase';
import axios from 'axios';

jest.mock('../../config/firebase');
jest.mock('axios');

const mockUserRecord = {
  uid: 'user123',
  email: 'test@test.com',
  customClaims: { role: 'admin' },
};

describe('Auth Service', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('register', () => {
    it('should register a user and return auth response', async () => {
      (auth.createUser as jest.Mock).mockResolvedValue(mockUserRecord);
      (auth.setCustomUserClaims as jest.Mock).mockResolvedValue(undefined);
      (axios.post as jest.Mock).mockResolvedValue({
        data: { idToken: 'mock-token' },
      });

      const result = await authService.register({
        email: 'test@test.com',
        password: '123456',
        role: 'admin',
      });

      expect(result.uid).toBe('user123');
      expect(result.email).toBe('test@test.com');
      expect(result.token).toBe('mock-token');
      expect(result.role).toBe('admin');
    });

    it('should default role to member if not provided', async () => {
      (auth.createUser as jest.Mock).mockResolvedValue(mockUserRecord);
      (auth.setCustomUserClaims as jest.Mock).mockResolvedValue(undefined);
      (axios.post as jest.Mock).mockResolvedValue({
        data: { idToken: 'mock-token' },
      });

      const result = await authService.register({
        email: 'test@test.com',
        password: '123456',
      });

      expect(auth.setCustomUserClaims).toHaveBeenCalledWith('user123', { role: 'member' });
      expect(result.role).toBe('member');
    });

    it('should throw if createUser fails', async () => {
      (auth.createUser as jest.Mock).mockRejectedValue(new Error('Email already exists'));
      await expect(authService.register({ email: 'test@test.com', password: '123456' }))
        .rejects.toThrow('Email already exists');
    });
  });

  describe('login', () => {
    it('should login and return auth response', async () => {
      (axios.post as jest.Mock).mockResolvedValue({
        data: { localId: 'user123', idToken: 'mock-token' },
      });
      (auth.getUser as jest.Mock).mockResolvedValue(mockUserRecord);

      const result = await authService.login({
        email: 'test@test.com',
        password: '123456',
      });

      expect(result.uid).toBe('user123');
      expect(result.token).toBe('mock-token');
      expect(result.role).toBe('admin');
    });

    it('should default role to member if no custom claims', async () => {
      (axios.post as jest.Mock).mockResolvedValue({
        data: { localId: 'user123', idToken: 'mock-token' },
      });
      (auth.getUser as jest.Mock).mockResolvedValue({ ...mockUserRecord, customClaims: {} });

      const result = await authService.login({
        email: 'test@test.com',
        password: '123456',
      });

      expect(result.role).toBe('member');
    });

    it('should throw if login fails', async () => {
      (axios.post as jest.Mock).mockRejectedValue(new Error('Invalid credentials'));
      await expect(authService.login({ email: 'test@test.com', password: 'wrong' }))
        .rejects.toThrow('Invalid credentials');
    });
  });
});
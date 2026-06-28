import { auth } from '../config/firebase';
import { RegisterDto, AuthResponse } from '../models/auth.model';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY || '';

/**
 * Register a new user with Firebase Auth
 * @param data - Registration data including email, password, and optional role
 * @returns Auth response with uid, email, token, and role
 */
export const register = async (data: RegisterDto): Promise<AuthResponse> => {
  const { email, password, role = 'member' } = data;

  // Create user in Firebase Auth
  const userRecord = await auth.createUser({ email, password });

  // Set custom claims for role
  await auth.setCustomUserClaims(userRecord.uid, { role });

  // Sign in to get token via Firebase REST API
  const response = await axios.post(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
    { email, password, returnSecureToken: true }
  );

  return {
    uid: userRecord.uid,
    email: userRecord.email || '',
    token: response.data.idToken,
    role,
  };
};

/**
 * Login an existing user via Firebase REST API
 * @param data - Login credentials
 * @returns Auth response with uid, email, token, and role
 */
export const login = async (data: { email: string; password: string }): Promise<AuthResponse> => {
  const { email, password } = data;

  // Sign in via Firebase REST API to get ID token
  const response = await axios.post(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
    { email, password, returnSecureToken: true }
  );

  const { localId: uid, idToken: token } = response.data;

  // Get user record to retrieve custom claims (role)
  const userRecord = await auth.getUser(uid);
  const role = (userRecord.customClaims?.role as string) || 'member';

  return { uid, email, token, role };
};
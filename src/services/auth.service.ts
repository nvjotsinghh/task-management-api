import { auth } from '../config/firebase';
import { RegisterDto, AuthResponse } from '../models/auth.model';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY || '';

/**
 * Registers a new user in Firebase Authentication and assigns a role via custom claims.
 * Uses Firebase Admin SDK to create the user and Firebase REST API to get the ID token.
 * @param data - Registration data including email, password, and optional role
 * @returns {Promise<AuthResponse>} Auth response containing uid, email, token, and role
 * @throws {Error} If email already exists or Firebase auth fails
 */
export const register = async (data: RegisterDto): Promise<AuthResponse> => {
  const { email, password, role = 'member' } = data;

  // Create the user account in Firebase Authentication
  const userRecord = await auth.createUser({ email, password });

  // Assign role as a custom claim so it's included in the decoded token
  await auth.setCustomUserClaims(userRecord.uid, { role });

  // Use Firebase REST API to sign in and retrieve the ID token
  // Admin SDK cannot generate ID tokens directly — only the client REST API can
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
 * Authenticates an existing user via Firebase REST API and retrieves their role from custom claims.
 * @param data - Login credentials containing email and password
 * @returns {Promise<AuthResponse>} Auth response containing uid, email, token, and role
 * @throws {Error} If credentials are invalid or user does not exist
 */
export const login = async (data: { email: string; password: string }): Promise<AuthResponse> => {
  const { email, password } = data;

  // Authenticate via Firebase REST API to get a signed ID token
  const response = await axios.post(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
    { email, password, returnSecureToken: true }
  );

  const { localId: uid, idToken: token } = response.data;

  // Fetch the user record to read custom claims (role) set during registration
  const userRecord = await auth.getUser(uid);

  // Default to 'member' if no custom claims have been set
  const role = (userRecord.customClaims?.role as string) || 'member';

  return { uid, email, token, role };
};
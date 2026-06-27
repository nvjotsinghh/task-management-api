import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './serviceAccountKey.json';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const serviceAccount = require(path.resolve(serviceAccountPath));

let app: App;

if (!getApps().length) {
  app = initializeApp({
    credential: cert(serviceAccount),
  });
} else {
  app = getApps()[0];
}

export const db: Firestore = getFirestore(app);
export const auth: Auth = getAuth(app);
export default app;
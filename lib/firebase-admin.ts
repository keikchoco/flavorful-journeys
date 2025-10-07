import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
const firebaseAdminConfig = {
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
};

// Initialize the app if it hasn't been initialized yet
const adminApp = admin.apps.length === 0 
  ? admin.initializeApp(firebaseAdminConfig) 
  : admin.app();

export const adminAuth = admin.auth(adminApp);
export const adminDatabase = admin.database(adminApp);
export { adminApp };
import { initializeApp } from "firebase/app";

import { getFirestore, collection } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const clientCredentials = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(clientCredentials);

const db = getFirestore(app);
const database = getDatabase(app);
const auth = getAuth(app);
const storage = getStorage(app);

const adminCollection = collection(db, "admins");
const skinsCollection = collection(db, "skins");
const usersCollection = collection(db, "users");

export {
  app,
  db,
  database,
  auth,
  storage,
  adminCollection,
  skinsCollection,
  usersCollection,
};
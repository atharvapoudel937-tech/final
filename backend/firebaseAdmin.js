import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccountPath = path.join(__dirname, "ServiceAccountKey.json");

let db = null;

try {
  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    db = admin.firestore();
    console.log("Firebase Admin initialized successfully.");
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    // Allows loading credentials from Render Environment Variables
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    db = admin.firestore();
    console.log("Firebase Admin initialized from Environment Variables.");
  } else {
    console.warn("ServiceAccountKey.json not found. Falling back to local database mode.");
  }
} catch (err) {
  console.warn("Firebase initialization skipped:", err.message);
}

export { db };
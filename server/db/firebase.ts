import { initializeApp, getApps } from "firebase/app";
import { getFirestore, Firestore, connectFirestoreEmulator } from "firebase/firestore";
import { initializeApp as initializeAdminApp, getApps as getAdminApps, cert } from "firebase-admin/app";
import { getFirestore as getAdminFirestore, Firestore as AdminFirestore } from "firebase-admin/firestore";

let clientApp: any = null;
let adminApp: any = null;
let clientDb: Firestore | null = null;
let adminDb: AdminFirestore | null = null;

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export function getFirebaseConfig(): FirebaseConfig {
  const config = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
  };

  // Validate required fields
  const requiredFields = ['projectId', 'apiKey', 'authDomain', 'appId'];
  for (const field of requiredFields) {
    if (!config[field as keyof FirebaseConfig]) {
      throw new Error(`Firebase configuration missing: ${field.toUpperCase()}`);
    }
  }

  return config as FirebaseConfig;
}

export async function initializeFirebase(): Promise<{ clientDb: Firestore; adminDb: AdminFirestore }> {
  try {
    const config = getFirebaseConfig();

    // Initialize client app
    if (!clientApp) {
      const existingApps = getApps();
      if (existingApps.length === 0) {
        clientApp = initializeApp(config);
      } else {
        clientApp = existingApps[0];
      }
    }

    // Initialize admin app
    if (!adminApp) {
      const existingAdminApps = getAdminApps();
      if (existingAdminApps.length === 0) {
        // Check if we have service account credentials
        const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
        if (serviceAccount) {
          const serviceAccountKey = JSON.parse(serviceAccount);
          adminApp = initializeAdminApp({
            credential: cert(serviceAccountKey),
            projectId: config.projectId,
          });
        } else {
          // Use default credentials (useful in production)
          adminApp = initializeAdminApp({
            projectId: config.projectId,
          });
        }
      } else {
        adminApp = existingAdminApps[0];
      }
    }

    // Get Firestore instances
    if (!clientDb) {
      clientDb = getFirestore(clientApp);
      
      // Connect to emulator in development
      if (process.env.NODE_ENV === "development" && process.env.FIREBASE_EMULATOR_HOST) {
        const [host, port] = process.env.FIREBASE_EMULATOR_HOST.split(":");
        connectFirestoreEmulator(clientDb, host, parseInt(port));
      }
    }

    if (!adminDb) {
      adminDb = getAdminFirestore(adminApp);
    }

    console.log("Successfully initialized Firebase");
    return { clientDb, adminDb };
  } catch (error) {
    console.error("Failed to initialize Firebase:", error);
    throw error;
  }
}

export async function getFirestoreClient(): Promise<Firestore> {
  if (!clientDb) {
    const { clientDb: db } = await initializeFirebase();
    return db;
  }
  return clientDb;
}

export async function getFirestoreAdmin(): Promise<AdminFirestore> {
  if (!adminDb) {
    const { adminDb: db } = await initializeFirebase();
    return db;
  }
  return adminDb;
}

export async function healthCheck(): Promise<boolean> {
  try {
    const db = await getFirestoreAdmin();
    // Try to read from a system collection to test connectivity
    await db.collection("_health").limit(1).get();
    return true;
  } catch (error) {
    console.error("Firebase health check failed:", error);
    return false;
  }
}

// Graceful shutdown
export async function closeFirebase(): Promise<void> {
  // Firebase connections are automatically managed
  // No explicit cleanup needed for Firestore
  console.log("Firebase connections closed");
}

process.on("SIGINT", async () => {
  await closeFirebase();
});

process.on("SIGTERM", async () => {
  await closeFirebase();
});
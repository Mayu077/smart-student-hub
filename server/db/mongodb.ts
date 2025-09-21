import { MongoClient, Db } from "mongodb";

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectMongoDB(): Promise<Db> {
  if (db) {
    return db;
  }

  const uri = process.env.MONGODB_URI;
  const dbName = process.env.DB_NAME || "smart_student_hub";

  if (!uri) {
    throw new Error("MONGODB_URI environment variable is required");
  }

  try {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
    
    // Test the connection
    await db.admin().ping();
    console.log("Successfully connected to MongoDB");
    
    return db;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
}

export async function getDatabase(): Promise<Db> {
  if (!db) {
    return await connectMongoDB();
  }
  return db;
}

export async function healthCheck(): Promise<boolean> {
  try {
    if (!db) {
      await connectMongoDB();
    }
    await db!.admin().ping();
    return true;
  } catch (error) {
    console.error("MongoDB health check failed:", error);
    return false;
  }
}

export async function closeMongoDB(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log("MongoDB connection closed");
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  await closeMongoDB();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await closeMongoDB();
  process.exit(0);
});
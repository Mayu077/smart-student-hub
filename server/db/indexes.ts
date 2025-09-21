import { Db } from "mongodb";

export async function createIndexes(db: Db): Promise<void> {
  try {
    console.log("Creating MongoDB indexes...");

    // Users collection indexes
    await db.collection("users").createIndex({ username: 1 }, { unique: true });
    await db.collection("users").createIndex({ email: 1 }, { unique: true });
    await db.collection("users").createIndex({ studentId: 1 }, { unique: true });

    // Courses collection indexes
    await db.collection("courses").createIndex({ userId: 1 });
    await db.collection("courses").createIndex({ userId: 1, isActive: 1 });

    // Activities collection indexes
    await db.collection("activities").createIndex({ userId: 1 });
    await db.collection("activities").createIndex({ userId: 1, status: 1 });
    await db.collection("activities").createIndex({ approvedBy: 1 });

    // Tasks collection indexes - compound index for better performance
    await db.collection("tasks").createIndex({ userId: 1, completed: 1, dueDate: 1 });
    await db.collection("tasks").createIndex({ courseId: 1 });

    // Portfolios collection indexes
    await db.collection("portfolios").createIndex({ userId: 1 });
    await db.collection("portfolios").createIndex({ userId: 1, status: 1 });

    // Study Hours collection indexes - unique to prevent duplicate entries per day
    await db.collection("study_hours").createIndex({ userId: 1, date: 1 }, { unique: true });

    console.log("MongoDB indexes created successfully");
  } catch (error) {
    console.error("Error creating MongoDB indexes:", error);
    throw error;
  }
}
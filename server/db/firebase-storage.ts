import { 
  type User, 
  type InsertUser,
  type Activity,
  type InsertActivity,
  type Course,
  type InsertCourse,
  type Task,
  type InsertTask,
  type Portfolio,
  type InsertPortfolio,
  type StudyHours,
  type InsertStudyHours
} from "@shared/schema";
import type { IStorage } from "../storage";
import { getFirestoreAdmin } from "./firebase";
import { randomUUID } from "crypto";
import { Timestamp, FieldValue } from "firebase-admin/firestore";

/**
 * Firebase Composite Indexes Required:
 * 
 * Collection: tasks
 * - Index: userId (Ascending), completed (Ascending), dueDate (Ascending)
 *   Required for: getUpcomingTasks query
 * 
 * Collection: study_hours  
 * - Index: userId (Ascending), date (Ascending)
 *   Required for: getStudyHours with date filters
 * 
 * Collection: courses
 * - Index: userId (Ascending), isActive (Ascending), createdAt (Descending)
 *   Required for: getDashboardStats current course query
 * 
 * Note: Firebase will automatically prompt to create these indexes when the queries
 * are first executed. Follow the provided links in the Firebase Console.
 */

export class FirebaseStorage implements IStorage {
  private async getDb() {
    return await getFirestoreAdmin();
  }

  // Helper function to convert Firestore document to our types
  private convertDocToType<T>(docData: any, docId: string): T {
    const result: any = { id: docId };
    
    // Convert Firestore data to our expected format
    Object.keys(docData).forEach(key => {
      const value = docData[key];
      if (value instanceof Timestamp) {
        // Convert Firestore Timestamp to Date using proper instanceof check
        result[key] = value.toDate();
      } else if (value && typeof value === 'object' && value._seconds && value._nanoseconds) {
        // Fallback for serialized Timestamp objects (e.g., from JSON)
        result[key] = new Date(value._seconds * 1000 + value._nanoseconds / 1000000);
      } else {
        result[key] = value;
      }
    });
    
    return result as T;
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const db = await this.getDb();
    const userDoc = await db.collection("users").doc(id).get();
    
    if (!userDoc.exists) {
      return undefined;
    }
    
    return this.convertDocToType<User>(userDoc.data(), userDoc.id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const db = await this.getDb();
    const querySnapshot = await db.collection("users")
      .where("username", "==", username)
      .limit(1)
      .get();
    
    if (querySnapshot.empty) {
      return undefined;
    }
    
    const userDoc = querySnapshot.docs[0];
    return this.convertDocToType<User>(userDoc.data(), userDoc.id);
  }

  async createUser(user: InsertUser): Promise<User> {
    const db = await this.getDb();
    const id = randomUUID();
    const newUser = {
      ...user,
      createdAt: FieldValue.serverTimestamp(),
    };
    
    await db.collection("users").doc(id).set(newUser);
    
    // Return the created user with current timestamp
    return {
      id,
      ...user,
      gpa: user.gpa || "0.0",
      totalCredits: user.totalCredits || 0,
      completedCredits: user.completedCredits || 0,
      attendance: user.attendance || 0,
      createdAt: new Date(),
    };
  }

  async createUserWithId(id: string, user: InsertUser): Promise<User> {
    const db = await this.getDb();
    const newUser = {
      ...user,
      createdAt: FieldValue.serverTimestamp(),
    };
    
    await db.collection("users").doc(id).set(newUser);
    
    // Return the created user with current timestamp
    return {
      id,
      ...user,
      gpa: user.gpa || "0.0",
      totalCredits: user.totalCredits || 0,
      completedCredits: user.completedCredits || 0,
      attendance: user.attendance || 0,
      createdAt: new Date(),
    };
  }

  // Activity methods
  async getActivities(userId: string): Promise<Activity[]> {
    const db = await this.getDb();
    const querySnapshot = await db.collection("activities")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();
    
    return querySnapshot.docs.map(doc => 
      this.convertDocToType<Activity>(doc.data(), doc.id)
    );
  }

  async getRecentActivities(userId: string, limit_count: number = 5): Promise<Activity[]> {
    const db = await this.getDb();
    const querySnapshot = await db.collection("activities")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .limit(limit_count)
      .get();
    
    return querySnapshot.docs.map(doc => 
      this.convertDocToType<Activity>(doc.data(), doc.id)
    );
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const db = await this.getDb();
    const id = randomUUID();
    const newActivity = {
      ...activity,
      status: "pending",
      createdAt: FieldValue.serverTimestamp(),
    };
    
    await db.collection("activities").doc(id).set(newActivity);
    
    return {
      id,
      ...activity,
      status: "pending",
      description: activity.description || null,
      endDate: activity.endDate || null,
      fileUrl: null,
      userId: activity.userId || null,
      approvedBy: null,
      createdAt: new Date(),
    };
  }

  async createActivityWithId(id: string, activity: InsertActivity): Promise<Activity> {
    const db = await this.getDb();
    const newActivity = {
      ...activity,
      status: "pending",
      createdAt: FieldValue.serverTimestamp(),
    };
    
    await db.collection("activities").doc(id).set(newActivity);
    
    return {
      id,
      ...activity,
      status: "pending",
      description: activity.description || null,
      endDate: activity.endDate || null,
      fileUrl: null,
      userId: activity.userId || null,
      approvedBy: null,
      createdAt: new Date(),
    };
  }

  async updateActivity(id: string, updates: Partial<Activity>): Promise<Activity | undefined> {
    const db = await this.getDb();
    const { id: _, ...updateFields } = updates;
    
    const activityRef = db.collection("activities").doc(id);
    await activityRef.update(updateFields);
    
    const updatedDoc = await activityRef.get();
    if (!updatedDoc.exists) {
      return undefined;
    }
    
    return this.convertDocToType<Activity>(updatedDoc.data(), updatedDoc.id);
  }

  async updateActivityStatus(id: string, status: string, approvedBy?: string): Promise<Activity | undefined> {
    const db = await this.getDb();
    const updateFields: any = { status };
    if (approvedBy) {
      updateFields.approvedBy = approvedBy;
    }
    
    const activityRef = db.collection("activities").doc(id);
    await activityRef.update(updateFields);
    
    const updatedDoc = await activityRef.get();
    if (!updatedDoc.exists) {
      return undefined;
    }
    
    return this.convertDocToType<Activity>(updatedDoc.data(), updatedDoc.id);
  }

  // Course methods
  async getCourses(userId: string): Promise<Course[]> {
    const db = await this.getDb();
    const querySnapshot = await db.collection("courses")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();
    
    return querySnapshot.docs.map(doc => 
      this.convertDocToType<Course>(doc.data(), doc.id)
    );
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const db = await this.getDb();
    const id = randomUUID();
    const newCourse = {
      ...course,
      createdAt: FieldValue.serverTimestamp(),
    };
    
    await db.collection("courses").doc(id).set(newCourse);
    
    return {
      id,
      ...course,
      description: course.description || null,
      userId: course.userId || null,
      credits: course.credits || null,
      progress: course.progress || null,
      isActive: course.isActive || null,
      createdAt: new Date(),
    };
  }

  async createCourseWithId(id: string, course: InsertCourse): Promise<Course> {
    const db = await this.getDb();
    const newCourse = {
      ...course,
      createdAt: FieldValue.serverTimestamp(),
    };
    
    await db.collection("courses").doc(id).set(newCourse);
    
    return {
      id,
      ...course,
      description: course.description || null,
      userId: course.userId || null,
      credits: course.credits || null,
      progress: course.progress || null,
      isActive: course.isActive || null,
      createdAt: new Date(),
    };
  }

  async updateCourseProgress(id: string, progress: number): Promise<Course | undefined> {
    const db = await this.getDb();
    const courseRef = db.collection("courses").doc(id);
    await courseRef.update({ progress });
    
    const updatedDoc = await courseRef.get();
    if (!updatedDoc.exists) {
      return undefined;
    }
    
    return this.convertDocToType<Course>(updatedDoc.data(), updatedDoc.id);
  }

  // Task methods
  async getTasks(userId: string): Promise<Task[]> {
    const db = await this.getDb();
    const querySnapshot = await db.collection("tasks")
      .where("userId", "==", userId)
      .orderBy("dueDate", "asc")
      .get();
    
    return querySnapshot.docs.map(doc => 
      this.convertDocToType<Task>(doc.data(), doc.id)
    );
  }

  async getUpcomingTasks(userId: string, limit_count: number = 5): Promise<Task[]> {
    try {
      const db = await this.getDb();
      const now = Timestamp.now();
      
      // Composite query requiring index: (userId, completed, dueDate)
      // Firebase Console will prompt to create this index on first run
      const querySnapshot = await db.collection("tasks")
        .where("userId", "==", userId)
        .where("completed", "==", false)
        .where("dueDate", ">=", now)
        .orderBy("dueDate", "asc")
        .limit(limit_count)
        .get();
      
      return querySnapshot.docs.map(doc => 
        this.convertDocToType<Task>(doc.data(), doc.id)
      );
    } catch (error) {
      if (error instanceof Error && error.message.includes('index')) {
        console.error('Firebase composite index required for getUpcomingTasks query. Please create index for collection: tasks, fields: userId (Ascending), completed (Ascending), dueDate (Ascending)');
        throw new Error('Database index required. Please check console for details.');
      }
      console.error('Error in getUpcomingTasks:', error);
      throw error;
    }
  }

  async createTask(task: InsertTask): Promise<Task> {
    const db = await this.getDb();
    const id = randomUUID();
    const newTask = {
      ...task,
      dueDate: Timestamp.fromDate(new Date(task.dueDate)),
      createdAt: FieldValue.serverTimestamp(),
    };
    
    await db.collection("tasks").doc(id).set(newTask);
    
    return {
      id,
      ...task,
      description: task.description || null,
      userId: task.userId || null,
      completed: task.completed || null,
      courseId: task.courseId || null,
      createdAt: new Date(),
    };
  }

  async createTaskWithId(id: string, task: InsertTask): Promise<Task> {
    const db = await this.getDb();
    const newTask = {
      ...task,
      dueDate: Timestamp.fromDate(new Date(task.dueDate)),
      createdAt: FieldValue.serverTimestamp(),
    };
    
    await db.collection("tasks").doc(id).set(newTask);
    
    return {
      id,
      ...task,
      description: task.description || null,
      userId: task.userId || null,
      completed: task.completed || null,
      courseId: task.courseId || null,
      createdAt: new Date(),
    };
  }

  async updateTaskStatus(id: string, completed: boolean): Promise<Task | undefined> {
    const db = await this.getDb();
    const taskRef = db.collection("tasks").doc(id);
    await taskRef.update({ completed });
    
    const updatedDoc = await taskRef.get();
    if (!updatedDoc.exists) {
      return undefined;
    }
    
    return this.convertDocToType<Task>(updatedDoc.data(), updatedDoc.id);
  }

  // Portfolio methods
  async getPortfolios(userId: string): Promise<Portfolio[]> {
    const db = await this.getDb();
    const querySnapshot = await db.collection("portfolios")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();
    
    return querySnapshot.docs.map(doc => 
      this.convertDocToType<Portfolio>(doc.data(), doc.id)
    );
  }

  async createPortfolio(portfolio: InsertPortfolio): Promise<Portfolio> {
    const db = await this.getDb();
    const id = randomUUID();
    const newPortfolio = {
      ...portfolio,
      status: "draft",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };
    
    await db.collection("portfolios").doc(id).set(newPortfolio);
    
    return {
      id,
      ...portfolio,
      status: "draft",
      generatedContent: null,
      userId: portfolio.userId || null,
      targetField: portfolio.targetField || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async createPortfolioWithId(id: string, portfolio: InsertPortfolio): Promise<Portfolio> {
    const db = await this.getDb();
    const newPortfolio = {
      ...portfolio,
      status: "draft",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };
    
    await db.collection("portfolios").doc(id).set(newPortfolio);
    
    return {
      id,
      ...portfolio,
      status: "draft",
      generatedContent: null,
      userId: portfolio.userId || null,
      targetField: portfolio.targetField || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async updatePortfolio(id: string, updates: Partial<Portfolio>): Promise<Portfolio | undefined> {
    const db = await this.getDb();
    const { id: _, ...updateFields } = updates;
    (updateFields as any).updatedAt = FieldValue.serverTimestamp();
    
    const portfolioRef = db.collection("portfolios").doc(id);
    await portfolioRef.update(updateFields);
    
    const updatedDoc = await portfolioRef.get();
    if (!updatedDoc.exists) {
      return undefined;
    }
    
    return this.convertDocToType<Portfolio>(updatedDoc.data(), updatedDoc.id);
  }

  // Study Hours methods
  async getStudyHours(userId: string, startDate?: Date, endDate?: Date): Promise<StudyHours[]> {
    try {
      const db = await this.getDb();
      let query = db.collection("study_hours").where("userId", "==", userId);
      
      if (startDate) {
        query = query.where("date", ">=", Timestamp.fromDate(startDate));
      }
      if (endDate) {
        query = query.where("date", "<=", Timestamp.fromDate(endDate));
      }
      
      // Composite query requiring index when date filters are used: (userId, date)
      // Firebase Console will prompt to create this index on first run
      const querySnapshot = await query.orderBy("date", "desc").get();
      
      return querySnapshot.docs.map(doc => 
        this.convertDocToType<StudyHours>(doc.data(), doc.id)
      );
    } catch (error) {
      if (error instanceof Error && error.message.includes('index')) {
        console.error('Firebase composite index required for getStudyHours query. Please create index for collection: study_hours, fields: userId (Ascending), date (Ascending or Descending)');
        throw new Error('Database index required. Please check console for details.');
      }
      console.error('Error in getStudyHours:', error);
      throw error;
    }
  }

  async createStudyHours(studyHours: InsertStudyHours): Promise<StudyHours> {
    const db = await this.getDb();
    const id = randomUUID();
    const newStudyHours = {
      ...studyHours,
      date: Timestamp.fromDate(new Date(studyHours.date)),
      createdAt: FieldValue.serverTimestamp(),
    };
    
    await db.collection("study_hours").doc(id).set(newStudyHours);
    
    return {
      id,
      ...studyHours,
      userId: studyHours.userId || null,
      createdAt: new Date(),
    };
  }

  async createStudyHoursWithId(id: string, studyHours: InsertStudyHours): Promise<StudyHours> {
    const db = await this.getDb();
    const newStudyHours = {
      ...studyHours,
      date: Timestamp.fromDate(new Date(studyHours.date)),
      createdAt: FieldValue.serverTimestamp(),
    };
    
    await db.collection("study_hours").doc(id).set(newStudyHours);
    
    return {
      id,
      ...studyHours,
      userId: studyHours.userId || null,
      createdAt: new Date(),
    };
  }

  // Dashboard stats
  async getDashboardStats(userId: string): Promise<{
    studyHoursPercentage: number;
    studyHoursWeek: string;
    currentCourse: { title: string; progress: number } | null;
    assignments: { completed: number; total: number };
  }> {
    try {
      const db = await this.getDb();
    
    // Get study hours for current week
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    
    // Composite query requiring index: (userId, date)
    const weeklyHoursSnapshot = await db.collection("study_hours")
      .where("userId", "==", userId)
      .where("date", ">=", Timestamp.fromDate(startOfWeek))
      .where("date", "<=", Timestamp.fromDate(endOfWeek))
      .get();
    
    const totalHours = weeklyHoursSnapshot.docs.reduce((sum, doc) => {
      return sum + (doc.data().hours || 0);
    }, 0);
    const studyHoursPercentage = Math.min(Math.round((totalHours / 40) * 100), 100);
    
    // Get current course
    // Composite query requiring index: (userId, isActive, createdAt)
    const currentCourseSnapshot = await db.collection("courses")
      .where("userId", "==", userId)
      .where("isActive", "==", true)
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();
    
    let currentCourse = null;
    if (!currentCourseSnapshot.empty) {
      const courseData = currentCourseSnapshot.docs[0].data();
      currentCourse = {
        title: courseData.title,
        progress: courseData.progress || 0
      };
    }
    
    // Get task statistics
    const allTasksSnapshot = await db.collection("tasks")
      .where("userId", "==", userId)
      .get();
    
    const completedTasks = allTasksSnapshot.docs.filter(doc => doc.data().completed).length;
    
    return {
      studyHoursPercentage,
      studyHoursWeek: `${totalHours}h this week`,
      currentCourse,
      assignments: {
        completed: completedTasks,
        total: allTasksSnapshot.docs.length
      }
    };
    } catch (error) {
      if (error instanceof Error && error.message.includes('index')) {
        console.error('Firebase composite indexes required for getDashboardStats queries. Please create indexes for collections: study_hours (userId, date), courses (userId, isActive, createdAt)');
        throw new Error('Database indexes required. Please check console for details.');
      }
      console.error('Error in getDashboardStats:', error);
      throw error;
    }
  }
}
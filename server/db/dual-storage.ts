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
import { MongoStorage } from "./mongo-storage";
import { FirebaseStorage } from "./firebase-storage";

export interface DualStorageOptions {
  primaryStorage: "mongo" | "firebase";
  enableSync: boolean;
  fallbackOnError: boolean;
  syncDirection: "bidirectional" | "mongo-to-firebase" | "firebase-to-mongo";
}

export class DualStorage implements IStorage {
  private mongoStorage: MongoStorage;
  private firebaseStorage: FirebaseStorage;
  private options: DualStorageOptions;

  constructor(options: Partial<DualStorageOptions> = {}) {
    this.mongoStorage = new MongoStorage();
    this.firebaseStorage = new FirebaseStorage();
    this.options = {
      primaryStorage: "mongo",
      enableSync: true,
      fallbackOnError: true,
      syncDirection: "bidirectional",
      ...options
    };
  }

  private async executeWithFallback<T>(
    operation: "read" | "write",
    primaryFn: () => Promise<T>,
    fallbackFn?: () => Promise<T>
  ): Promise<T> {
    try {
      const result = await primaryFn();
      
      // For write operations, sync to secondary storage if enabled
      if (operation === "write" && this.options.enableSync && fallbackFn) {
        this.syncToSecondary(fallbackFn).catch(error => {
          console.warn("Failed to sync to secondary storage:", error);
        });
      }
      
      return result;
    } catch (error) {
      console.error(`Primary storage operation failed:`, error);
      
      if (this.options.fallbackOnError && fallbackFn) {
        console.log("Attempting fallback to secondary storage...");
        return await fallbackFn();
      }
      
      throw error;
    }
  }

  private async executeCreateWithSync<T extends { id: string }>(
    createPayload: any,
    primaryCreateFn: (payload: any) => Promise<T>,
    secondaryCreateWithIdFn: (id: string, payload: any) => Promise<T>,
    fallbackCreateFn: (payload: any) => Promise<T>
  ): Promise<T> {
    try {
      // Create in primary storage first
      const result = await primaryCreateFn(createPayload);
      
      // If sync is enabled, replicate to secondary storage with same ID
      if (this.options.enableSync) {
        this.replicateToSecondary(result.id, createPayload, secondaryCreateWithIdFn).catch(error => {
          console.warn("Failed to replicate to secondary storage:", error);
        });
      }
      
      return result;
    } catch (error) {
      console.error(`Primary storage create operation failed:`, error);
      
      if (this.options.fallbackOnError) {
        console.log("Attempting fallback to secondary storage...");
        return await fallbackCreateFn(createPayload);
      }
      
      throw error;
    }
  }

  private async replicateToSecondary<T>(
    id: string,
    payload: any,
    createWithIdFn: (id: string, payload: any) => Promise<T>
  ): Promise<void> {
    try {
      await createWithIdFn(id, payload);
    } catch (error) {
      console.warn("Secondary storage replication failed:", error);
    }
  }

  private async syncToSecondary<T>(fallbackFn: () => Promise<T>): Promise<void> {
    try {
      await fallbackFn();
    } catch (error) {
      console.warn("Secondary storage sync failed:", error);
    }
  }

  private getPrimaryStorage(): IStorage {
    return this.options.primaryStorage === "mongo" ? this.mongoStorage : this.firebaseStorage;
  }

  private getSecondaryStorage(): IStorage {
    return this.options.primaryStorage === "mongo" ? this.firebaseStorage : this.mongoStorage;
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const primary = this.getPrimaryStorage();
    const secondary = this.getSecondaryStorage();
    
    return this.executeWithFallback(
      "read",
      () => primary.getUser(id),
      () => secondary.getUser(id)
    );
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const primary = this.getPrimaryStorage();
    const secondary = this.getSecondaryStorage();
    
    return this.executeWithFallback(
      "read",
      () => primary.getUserByUsername(username),
      () => secondary.getUserByUsername(username)
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    const primary = this.getPrimaryStorage();
    const secondary = this.getSecondaryStorage();
    
    return this.executeCreateWithSync(
      user,
      (payload) => primary.createUser(payload),
      (id, payload) => secondary.createUserWithId(id, payload),
      (payload) => secondary.createUser(payload)
    );
  }

  // Activity methods
  async getActivities(userId: string): Promise<Activity[]> {
    const primary = this.getPrimaryStorage();
    const secondary = this.getSecondaryStorage();
    
    return this.executeWithFallback(
      "read",
      () => primary.getActivities(userId),
      () => secondary.getActivities(userId)
    );
  }

  async getRecentActivities(userId: string, limit?: number): Promise<Activity[]> {
    const primary = this.getPrimaryStorage();
    const secondary = this.getSecondaryStorage();
    
    return this.executeWithFallback(
      "read",
      () => primary.getRecentActivities(userId, limit),
      () => secondary.getRecentActivities(userId, limit)
    );
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const primary = this.getPrimaryStorage();
    const secondary = this.getSecondaryStorage();
    
    return this.executeCreateWithSync(
      activity,
      (payload) => primary.createActivity(payload),
      (id, payload) => secondary.createActivityWithId(id, payload),
      (payload) => secondary.createActivity(payload)
    );
  }

  async updateActivity(id: string, updates: Partial<Activity>): Promise<Activity | undefined> {
    const primary = this.getPrimaryStorage();
    const secondary = this.getSecondaryStorage();
    
    return this.executeWithFallback(
      "write",
      () => primary.updateActivity(id, updates),
      () => secondary.updateActivity(id, updates)
    );
  }

  async updateActivityStatus(id: string, status: string, approvedBy?: string): Promise<Activity | undefined> {
    const primary = this.getPrimaryStorage();
    const secondary = this.getSecondaryStorage();
    
    return this.executeWithFallback(
      "write",
      () => primary.updateActivityStatus(id, status, approvedBy),
      () => secondary.updateActivityStatus(id, status, approvedBy)
    );
  }

  // Course methods
  async getCourses(userId: string): Promise<Course[]> {
    const primary = this.getPrimaryStorage();
    const secondary = this.getSecondaryStorage();
    
    return this.executeWithFallback(
      "read",
      () => primary.getCourses(userId),
      () => secondary.getCourses(userId)
    );
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const primary = this.getPrimaryStorage();
    const secondary = this.getSecondaryStorage();
    
    return this.executeCreateWithSync(
      course,
      (payload) => primary.createCourse(payload),
      (id, payload) => secondary.createCourseWithId(id, payload),
      (payload) => secondary.createCourse(payload)
    );
  }

  async updateCourseProgress(id: string, progress: number): Promise<Course | undefined> {
    const primary = this.getPrimaryStorage();
    const secondary = this.getSecondaryStorage();
    
    return this.executeWithFallback(
      "write",
      () => primary.updateCourseProgress(id, progress),
      () => secondary.updateCourseProgress(id, progress)
    );
  }

  // Task methods
  async getTasks(userId: string): Promise<Task[]> {
    const primary = this.getPrimaryStorage();
    const secondary = this.getSecondaryStorage();
    
    return this.executeWithFallback(
      "read",
      () => primary.getTasks(userId),
      () => secondary.getTasks(userId)
    );
  }

  async getUpcomingTasks(userId: string, limit?: number): Promise<Task[]> {
    const primary = this.getPrimaryStorage();
    const secondary = this.getSecondaryStorage();
    
    return this.executeWithFallback(
      "read",
      () => primary.getUpcomingTasks(userId, limit),
      () => secondary.getUpcomingTasks(userId, limit)
    );
  }

  async createTask(task: InsertTask): Promise<Task> {
    const primary = this.getPrimaryStorage();
    const secondary = this.getSecondaryStorage();
    
    return this.executeCreateWithSync(
      task,
      (payload) => primary.createTask(payload),
      (id, payload) => secondary.createTaskWithId(id, payload),
      (payload) => secondary.createTask(payload)
    );
  }

  async updateTaskStatus(id: string, completed: boolean): Promise<Task | undefined> {
    const primary = this.getPrimaryStorage();
    const secondary = this.getSecondaryStorage();
    
    return this.executeWithFallback(
      "write",
      () => primary.updateTaskStatus(id, completed),
      () => secondary.updateTaskStatus(id, completed)
    );
  }

  // Portfolio methods
  async getPortfolios(userId: string): Promise<Portfolio[]> {
    const primary = this.getPrimaryStorage();
    const secondary = this.getSecondaryStorage();
    
    return this.executeWithFallback(
      "read",
      () => primary.getPortfolios(userId),
      () => secondary.getPortfolios(userId)
    );
  }

  async createPortfolio(portfolio: InsertPortfolio): Promise<Portfolio> {
    const primary = this.getPrimaryStorage();
    const secondary = this.getSecondaryStorage();
    
    return this.executeCreateWithSync(
      portfolio,
      (payload) => primary.createPortfolio(payload),
      (id, payload) => secondary.createPortfolioWithId(id, payload),
      (payload) => secondary.createPortfolio(payload)
    );
  }

  async updatePortfolio(id: string, updates: Partial<Portfolio>): Promise<Portfolio | undefined> {
    const primary = this.getPrimaryStorage();
    const secondary = this.getSecondaryStorage();
    
    return this.executeWithFallback(
      "write",
      () => primary.updatePortfolio(id, updates),
      () => secondary.updatePortfolio(id, updates)
    );
  }

  // Study Hours methods
  async getStudyHours(userId: string, startDate?: Date, endDate?: Date): Promise<StudyHours[]> {
    const primary = this.getPrimaryStorage();
    const secondary = this.getSecondaryStorage();
    
    return this.executeWithFallback(
      "read",
      () => primary.getStudyHours(userId, startDate, endDate),
      () => secondary.getStudyHours(userId, startDate, endDate)
    );
  }

  async createStudyHours(studyHours: InsertStudyHours): Promise<StudyHours> {
    const primary = this.getPrimaryStorage();
    const secondary = this.getSecondaryStorage();
    
    return this.executeCreateWithSync(
      studyHours,
      (payload) => primary.createStudyHours(payload),
      (id, payload) => secondary.createStudyHoursWithId(id, payload),
      (payload) => secondary.createStudyHours(payload)
    );
  }

  // Dashboard stats
  async getDashboardStats(userId: string): Promise<{
    studyHoursPercentage: number;
    studyHoursWeek: string;
    currentCourse: { title: string; progress: number } | null;
    assignments: { completed: number; total: number };
  }> {
    const primary = this.getPrimaryStorage();
    const secondary = this.getSecondaryStorage();
    
    return this.executeWithFallback(
      "read",
      () => primary.getDashboardStats(userId),
      () => secondary.getDashboardStats(userId)
    );
  }

  // Sync methods
  async syncAllData(userId: string): Promise<void> {
    console.log(`Starting full data sync for user: ${userId}`);
    
    try {
      // Sync users
      await this.syncUsers(userId);
      
      // Sync all related data
      await Promise.all([
        this.syncActivities(userId),
        this.syncCourses(userId),
        this.syncTasks(userId),
        this.syncPortfolios(userId),
        this.syncStudyHours(userId)
      ]);
      
      console.log(`Full data sync completed for user: ${userId}`);
    } catch (error) {
      console.error(`Full data sync failed for user: ${userId}`, error);
      throw error;
    }
  }

  private async syncUsers(userId: string): Promise<void> {
    const shouldSyncMongoToFirebase = this.options.syncDirection === "bidirectional" || this.options.syncDirection === "mongo-to-firebase";
    const shouldSyncFirebaseToMongo = this.options.syncDirection === "bidirectional" || this.options.syncDirection === "firebase-to-mongo";
    
    const mongoUser = shouldSyncMongoToFirebase || shouldSyncFirebaseToMongo ? await this.mongoStorage.getUser(userId) : null;
    const firebaseUser = shouldSyncFirebaseToMongo || shouldSyncMongoToFirebase ? await this.firebaseStorage.getUser(userId) : null;
    
    if (shouldSyncMongoToFirebase && mongoUser && !firebaseUser) {
      console.log(`Syncing user ${userId} from MongoDB to Firebase`);
      // Convert User to InsertUser for Firebase creation
      const { id, createdAt, ...insertUserData } = mongoUser;
      await this.firebaseStorage.createUserWithId(userId, insertUserData);
    } else if (shouldSyncFirebaseToMongo && firebaseUser && !mongoUser) {
      console.log(`Syncing user ${userId} from Firebase to MongoDB`);
      const { id, createdAt, ...insertUserData } = firebaseUser;
      await this.mongoStorage.createUserWithId(userId, insertUserData);
    }
  }

  private async syncActivities(userId: string): Promise<void> {
    const shouldSyncMongoToFirebase = this.options.syncDirection === "bidirectional" || this.options.syncDirection === "mongo-to-firebase";
    const shouldSyncFirebaseToMongo = this.options.syncDirection === "bidirectional" || this.options.syncDirection === "firebase-to-mongo";
    
    const mongoActivities = shouldSyncMongoToFirebase || shouldSyncFirebaseToMongo ? await this.mongoStorage.getActivities(userId) : [];
    const firebaseActivities = shouldSyncFirebaseToMongo || shouldSyncMongoToFirebase ? await this.firebaseStorage.getActivities(userId) : [];
    
    if (shouldSyncMongoToFirebase) {
      const firebaseIds = new Set(firebaseActivities.map(a => a.id));
      
      // Sync from MongoDB to Firebase
      for (const activity of mongoActivities) {
        if (!firebaseIds.has(activity.id)) {
          const { id, createdAt, ...insertData } = activity;
          await this.firebaseStorage.createActivityWithId(id, insertData);
        }
      }
    }
    
    if (shouldSyncFirebaseToMongo) {
      const mongoIds = new Set(mongoActivities.map(a => a.id));
      
      // Sync from Firebase to MongoDB
      for (const activity of firebaseActivities) {
        if (!mongoIds.has(activity.id)) {
          const { id, createdAt, ...insertData } = activity;
          await this.mongoStorage.createActivityWithId(id, insertData);
        }
      }
    }
  }

  private async syncCourses(userId: string): Promise<void> {
    const shouldSyncMongoToFirebase = this.options.syncDirection === "bidirectional" || this.options.syncDirection === "mongo-to-firebase";
    const shouldSyncFirebaseToMongo = this.options.syncDirection === "bidirectional" || this.options.syncDirection === "firebase-to-mongo";
    
    const mongoCourses = shouldSyncMongoToFirebase || shouldSyncFirebaseToMongo ? await this.mongoStorage.getCourses(userId) : [];
    const firebaseCourses = shouldSyncFirebaseToMongo || shouldSyncMongoToFirebase ? await this.firebaseStorage.getCourses(userId) : [];
    
    if (shouldSyncMongoToFirebase) {
      const firebaseIds = new Set(firebaseCourses.map(c => c.id));
      
      for (const course of mongoCourses) {
        if (!firebaseIds.has(course.id)) {
          const { id, createdAt, ...insertData } = course;
          await this.firebaseStorage.createCourseWithId(id, insertData);
        }
      }
    }
    
    if (shouldSyncFirebaseToMongo) {
      const mongoIds = new Set(mongoCourses.map(c => c.id));
      
      for (const course of firebaseCourses) {
        if (!mongoIds.has(course.id)) {
          const { id, createdAt, ...insertData } = course;
          await this.mongoStorage.createCourseWithId(id, insertData);
        }
      }
    }
  }

  private async syncTasks(userId: string): Promise<void> {
    const shouldSyncMongoToFirebase = this.options.syncDirection === "bidirectional" || this.options.syncDirection === "mongo-to-firebase";
    const shouldSyncFirebaseToMongo = this.options.syncDirection === "bidirectional" || this.options.syncDirection === "firebase-to-mongo";
    
    const mongoTasks = shouldSyncMongoToFirebase || shouldSyncFirebaseToMongo ? await this.mongoStorage.getTasks(userId) : [];
    const firebaseTasks = shouldSyncFirebaseToMongo || shouldSyncMongoToFirebase ? await this.firebaseStorage.getTasks(userId) : [];
    
    if (shouldSyncMongoToFirebase) {
      const firebaseIds = new Set(firebaseTasks.map(t => t.id));
      
      for (const task of mongoTasks) {
        if (!firebaseIds.has(task.id)) {
          const { id, createdAt, ...insertData } = task;
          await this.firebaseStorage.createTaskWithId(id, insertData);
        }
      }
    }
    
    if (shouldSyncFirebaseToMongo) {
      const mongoIds = new Set(mongoTasks.map(t => t.id));
      
      for (const task of firebaseTasks) {
        if (!mongoIds.has(task.id)) {
          const { id, createdAt, ...insertData } = task;
          await this.mongoStorage.createTaskWithId(id, insertData);
        }
      }
    }
  }

  private async syncPortfolios(userId: string): Promise<void> {
    const shouldSyncMongoToFirebase = this.options.syncDirection === "bidirectional" || this.options.syncDirection === "mongo-to-firebase";
    const shouldSyncFirebaseToMongo = this.options.syncDirection === "bidirectional" || this.options.syncDirection === "firebase-to-mongo";
    
    const mongoPortfolios = shouldSyncMongoToFirebase || shouldSyncFirebaseToMongo ? await this.mongoStorage.getPortfolios(userId) : [];
    const firebasePortfolios = shouldSyncFirebaseToMongo || shouldSyncMongoToFirebase ? await this.firebaseStorage.getPortfolios(userId) : [];
    
    if (shouldSyncMongoToFirebase) {
      const firebaseIds = new Set(firebasePortfolios.map(p => p.id));
      
      for (const portfolio of mongoPortfolios) {
        if (!firebaseIds.has(portfolio.id)) {
          const { id, createdAt, updatedAt, ...insertData } = portfolio;
          await this.firebaseStorage.createPortfolioWithId(id, {
            ...insertData,
            content: insertData.content as any // Type assertion for JSON compatibility
          });
        }
      }
    }
    
    if (shouldSyncFirebaseToMongo) {
      const mongoIds = new Set(mongoPortfolios.map(p => p.id));
      
      for (const portfolio of firebasePortfolios) {
        if (!mongoIds.has(portfolio.id)) {
          const { id, createdAt, updatedAt, ...insertData } = portfolio;
          await this.mongoStorage.createPortfolioWithId(id, {
            ...insertData,
            content: insertData.content as any // Type assertion for JSON compatibility
          });
        }
      }
    }
  }

  private async syncStudyHours(userId: string): Promise<void> {
    const shouldSyncMongoToFirebase = this.options.syncDirection === "bidirectional" || this.options.syncDirection === "mongo-to-firebase";
    const shouldSyncFirebaseToMongo = this.options.syncDirection === "bidirectional" || this.options.syncDirection === "firebase-to-mongo";
    
    const mongoStudyHours = shouldSyncMongoToFirebase || shouldSyncFirebaseToMongo ? await this.mongoStorage.getStudyHours(userId) : [];
    const firebaseStudyHours = shouldSyncFirebaseToMongo || shouldSyncMongoToFirebase ? await this.firebaseStorage.getStudyHours(userId) : [];
    
    if (shouldSyncMongoToFirebase) {
      const firebaseIds = new Set(firebaseStudyHours.map(sh => sh.id));
      
      for (const studyHour of mongoStudyHours) {
        if (!firebaseIds.has(studyHour.id)) {
          const { id, createdAt, ...insertData } = studyHour;
          await this.firebaseStorage.createStudyHoursWithId(id, insertData);
        }
      }
    }
    
    if (shouldSyncFirebaseToMongo) {
      const mongoIds = new Set(mongoStudyHours.map(sh => sh.id));
      
      for (const studyHour of firebaseStudyHours) {
        if (!mongoIds.has(studyHour.id)) {
          const { id, createdAt, ...insertData } = studyHour;
          await this.mongoStorage.createStudyHoursWithId(id, insertData);
        }
      }
    }
  }

  // Health check for both databases
  async healthCheck(): Promise<{ mongo: boolean; firebase: boolean }> {
    const mongoHealth = await import("./mongodb").then(m => m.healthCheck()).catch(() => false);
    const firebaseHealth = await import("./firebase").then(f => f.healthCheck()).catch(() => false);
    
    return {
      mongo: mongoHealth,
      firebase: firebaseHealth
    };
  }
}
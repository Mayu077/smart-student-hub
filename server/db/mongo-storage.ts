import { Db, Collection } from "mongodb";
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
import { getDatabase } from "./mongodb";
import { randomUUID } from "crypto";

export class MongoStorage implements IStorage {
  private db: Db | null = null;

  private async getDb(): Promise<Db> {
    if (!this.db) {
      this.db = await getDatabase();
    }
    return this.db;
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const db = await this.getDb();
    const user = await db.collection("users").findOne({ id });
    if (!user) return undefined;
    
    const { _id, ...rest } = user as any;
    return rest as User;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const db = await this.getDb();
    const user = await db.collection("users").findOne({ username });
    if (!user) return undefined;
    
    const { _id, ...rest } = user as any;
    return rest as User;
  }

  async createUser(user: InsertUser): Promise<User> {
    const db = await this.getDb();
    const id = randomUUID();
    const newUser = {
      id,
      ...user,
      createdAt: new Date(),
    };
    
    await db.collection("users").insertOne(newUser);
    const { _id, ...rest } = newUser as any;
    return rest as User;
  }

  async createUserWithId(id: string, user: InsertUser): Promise<User> {
    const db = await this.getDb();
    const newUser = {
      id,
      ...user,
      createdAt: new Date(),
    };
    
    await db.collection("users").insertOne(newUser);
    const { _id, ...rest } = newUser as any;
    return rest as User;
  }

  // Activity methods
  async getActivities(userId: string): Promise<Activity[]> {
    const db = await this.getDb();
    const activities = await db.collection("activities")
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();
    
    return activities.map(doc => {
      const { _id, ...rest } = doc as any;
      return rest as Activity;
    });
  }

  async getRecentActivities(userId: string, limit: number = 5): Promise<Activity[]> {
    const db = await this.getDb();
    const activities = await db.collection("activities")
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();
    
    return activities.map(doc => {
      const { _id, ...rest } = doc as any;
      return rest as Activity;
    });
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const db = await this.getDb();
    const id = randomUUID();
    const newActivity = {
      id,
      ...activity,
      status: "pending",
      createdAt: new Date(),
    };
    
    await db.collection("activities").insertOne(newActivity);
    const { _id, ...rest } = newActivity;
    return rest as Activity;
  }

  async createActivityWithId(id: string, activity: InsertActivity): Promise<Activity> {
    const db = await this.getDb();
    const newActivity = {
      id,
      ...activity,
      status: "pending",
      createdAt: new Date(),
    };
    
    await db.collection("activities").insertOne(newActivity);
    const { _id, ...rest } = newActivity;
    return rest as Activity;
  }

  async updateActivity(id: string, updates: Partial<Activity>): Promise<Activity | undefined> {
    const db = await this.getDb();
    const { id: _, ...updateFields } = updates;
    
    const result = await db.collection("activities").findOneAndUpdate(
      { id },
      { $set: updateFields },
      { returnDocument: "after" }
    );
    
    if (!result || !result.value) return undefined;
    const { _id, ...rest } = result.value as any;
    return rest as Activity;
  }

  async updateActivityStatus(id: string, status: string, approvedBy?: string): Promise<Activity | undefined> {
    const db = await this.getDb();
    const updateFields: any = { status };
    if (approvedBy) {
      updateFields.approvedBy = approvedBy;
    }
    
    const result = await db.collection("activities").findOneAndUpdate(
      { id },
      { $set: updateFields },
      { returnDocument: "after" }
    );
    
    if (!result || !result.value) return undefined;
    const { _id, ...rest } = result.value as any;
    return rest as Activity;
  }

  // Course methods
  async getCourses(userId: string): Promise<Course[]> {
    const db = await this.getDb();
    const courses = await db.collection("courses")
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();
    
    return courses.map(doc => {
      const { _id, ...rest } = doc as any;
      return rest as Course;
    });
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const db = await this.getDb();
    const id = randomUUID();
    const newCourse = {
      id,
      ...course,
      createdAt: new Date(),
    };
    
    await db.collection("courses").insertOne(newCourse);
    const { _id, ...rest } = newCourse;
    return rest as Course;
  }

  async createCourseWithId(id: string, course: InsertCourse): Promise<Course> {
    const db = await this.getDb();
    const newCourse = {
      id,
      ...course,
      createdAt: new Date(),
    };
    
    await db.collection("courses").insertOne(newCourse);
    const { _id, ...rest } = newCourse;
    return rest as Course;
  }

  async updateCourseProgress(id: string, progress: number): Promise<Course | undefined> {
    const db = await this.getDb();
    const result = await db.collection("courses").findOneAndUpdate(
      { id },
      { $set: { progress } },
      { returnDocument: "after" }
    );
    
    if (!result || !result.value) return undefined;
    const { _id, ...rest } = result.value as any;
    return rest as Course;
  }

  // Task methods
  async getTasks(userId: string): Promise<Task[]> {
    const db = await this.getDb();
    const tasks = await db.collection("tasks")
      .find({ userId })
      .sort({ dueDate: 1 })
      .toArray();
    
    return tasks.map(doc => {
      const { _id, ...rest } = doc as any;
      return rest as Task;
    });
  }

  async getUpcomingTasks(userId: string, limit: number = 5): Promise<Task[]> {
    const db = await this.getDb();
    const tasks = await db.collection("tasks")
      .find({ 
        userId, 
        completed: false,
        dueDate: { $gte: new Date() }
      })
      .sort({ dueDate: 1 })
      .limit(limit)
      .toArray();
    
    return tasks.map(doc => {
      const { _id, ...rest } = doc as any;
      return rest as Task;
    });
  }

  async createTask(task: InsertTask): Promise<Task> {
    const db = await this.getDb();
    const id = randomUUID();
    const newTask = {
      id,
      ...task,
      createdAt: new Date(),
    };
    
    await db.collection("tasks").insertOne(newTask);
    const { _id, ...rest } = newTask;
    return rest as Task;
  }

  async createTaskWithId(id: string, task: InsertTask): Promise<Task> {
    const db = await this.getDb();
    const newTask = {
      id,
      ...task,
      createdAt: new Date(),
    };
    
    await db.collection("tasks").insertOne(newTask);
    const { _id, ...rest } = newTask;
    return rest as Task;
  }

  async updateTaskStatus(id: string, completed: boolean): Promise<Task | undefined> {
    const db = await this.getDb();
    const result = await db.collection("tasks").findOneAndUpdate(
      { id },
      { $set: { completed } },
      { returnDocument: "after" }
    );
    
    if (!result || !result.value) return undefined;
    const { _id, ...rest } = result.value as any;
    return rest as Task;
  }

  // Portfolio methods
  async getPortfolios(userId: string): Promise<Portfolio[]> {
    const db = await this.getDb();
    const portfolios = await db.collection("portfolios")
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();
    
    return portfolios.map(doc => {
      const { _id, ...rest } = doc as any;
      return rest as Portfolio;
    });
  }

  async createPortfolio(portfolio: InsertPortfolio): Promise<Portfolio> {
    const db = await this.getDb();
    const id = randomUUID();
    const newPortfolio = {
      id,
      ...portfolio,
      status: "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    await db.collection("portfolios").insertOne(newPortfolio);
    const { _id, ...rest } = newPortfolio;
    return rest as Portfolio;
  }

  async createPortfolioWithId(id: string, portfolio: InsertPortfolio): Promise<Portfolio> {
    const db = await this.getDb();
    const newPortfolio = {
      id,
      ...portfolio,
      status: "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    await db.collection("portfolios").insertOne(newPortfolio);
    const { _id, ...rest } = newPortfolio;
    return rest as Portfolio;
  }

  async updatePortfolio(id: string, updates: Partial<Portfolio>): Promise<Portfolio | undefined> {
    const db = await this.getDb();
    const { id: _, ...updateFields } = updates;
    updateFields.updatedAt = new Date();
    
    const result = await db.collection("portfolios").findOneAndUpdate(
      { id },
      { $set: updateFields },
      { returnDocument: "after" }
    );
    
    if (!result || !result.value) return undefined;
    const { _id, ...rest } = result.value as any;
    return rest as Portfolio;
  }

  // Study Hours methods
  async getStudyHours(userId: string, startDate?: Date, endDate?: Date): Promise<StudyHours[]> {
    const db = await this.getDb();
    const query: any = { userId };
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }
    
    const studyHours = await db.collection("study_hours")
      .find(query)
      .sort({ date: -1 })
      .toArray();
    
    return studyHours.map(doc => {
      const { _id, ...rest } = doc as any;
      return rest as StudyHours;
    });
  }

  async createStudyHours(studyHours: InsertStudyHours): Promise<StudyHours> {
    const db = await this.getDb();
    const id = randomUUID();
    const newStudyHours = {
      id,
      ...studyHours,
      createdAt: new Date(),
    };
    
    await db.collection("study_hours").insertOne(newStudyHours);
    const { _id, ...rest } = newStudyHours;
    return rest as StudyHours;
  }

  async createStudyHoursWithId(id: string, studyHours: InsertStudyHours): Promise<StudyHours> {
    const db = await this.getDb();
    const newStudyHours = {
      id,
      ...studyHours,
      createdAt: new Date(),
    };
    
    await db.collection("study_hours").insertOne(newStudyHours);
    const { _id, ...rest } = newStudyHours;
    return rest as StudyHours;
  }

  // Dashboard stats
  async getDashboardStats(userId: string): Promise<{
    studyHoursPercentage: number;
    studyHoursWeek: string;
    currentCourse: { title: string; progress: number } | null;
    assignments: { completed: number; total: number };
  }> {
    const db = await this.getDb();
    
    // Get study hours for current week
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    
    const weeklyHours = await db.collection("study_hours")
      .find({ 
        userId, 
        date: { $gte: startOfWeek, $lte: endOfWeek }
      })
      .toArray();
    
    const totalHours = weeklyHours.reduce((sum, sh) => sum + (sh.hours || 0), 0);
    const studyHoursPercentage = Math.min(Math.round((totalHours / 40) * 100), 100);
    
    // Get current course
    const currentCourse = await db.collection("courses")
      .findOne({ userId, isActive: true }, { sort: { createdAt: -1 } });
    
    // Get task statistics
    const allTasks = await db.collection("tasks").find({ userId }).toArray();
    const completedTasks = allTasks.filter(task => task.completed).length;
    
    return {
      studyHoursPercentage,
      studyHoursWeek: `${totalHours}h this week`,
      currentCourse: currentCourse ? {
        title: currentCourse.title,
        progress: currentCourse.progress || 0
      } : null,
      assignments: {
        completed: completedTasks,
        total: allTasks.length
      }
    };
  }
}
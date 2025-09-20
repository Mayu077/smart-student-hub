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
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Activity methods
  getActivities(userId: string): Promise<Activity[]>;
  getRecentActivities(userId: string, limit?: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  updateActivity(id: string, updates: Partial<Activity>): Promise<Activity | undefined>;
  updateActivityStatus(id: string, status: string, approvedBy?: string): Promise<Activity | undefined>;
  
  // Course methods
  getCourses(userId: string): Promise<Course[]>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourseProgress(id: string, progress: number): Promise<Course | undefined>;
  
  // Task methods
  getTasks(userId: string): Promise<Task[]>;
  getUpcomingTasks(userId: string, limit?: number): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTaskStatus(id: string, completed: boolean): Promise<Task | undefined>;
  
  // Portfolio methods
  getPortfolios(userId: string): Promise<Portfolio[]>;
  createPortfolio(portfolio: InsertPortfolio): Promise<Portfolio>;
  updatePortfolio(id: string, updates: Partial<Portfolio>): Promise<Portfolio | undefined>;
  
  // Study Hours methods
  getStudyHours(userId: string, startDate?: Date, endDate?: Date): Promise<StudyHours[]>;
  createStudyHours(studyHours: InsertStudyHours): Promise<StudyHours>;
  
  // Dashboard stats
  getDashboardStats(userId: string): Promise<{
    studyHoursPercentage: number;
    studyHoursWeek: string;
    currentCourse: { title: string; progress: number } | null;
    assignments: { completed: number; total: number };
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private activities: Map<string, Activity> = new Map();
  private courses: Map<string, Course> = new Map();
  private tasks: Map<string, Task> = new Map();
  private portfolios: Map<string, Portfolio> = new Map();
  private studyHours: Map<string, StudyHours> = new Map();

  constructor() {
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create sample user
    const sampleUser: User = {
      id: "current-user",
      username: "alexjohnson",
      password: "hashedpassword",
      firstName: "Alex",
      lastName: "Johnson",
      studentId: "2024CS001",
      email: "alex.johnson@university.edu",
      gpa: "3.84",
      totalCredits: 60,
      completedCredits: 45,
      attendance: 94,
      createdAt: new Date(),
    };
    this.users.set(sampleUser.id, sampleUser);

    // Sample courses
    const sampleCourse: Course = {
      id: randomUUID(),
      title: "Biology 101 - Cell Structure",
      code: "BIO101",
      description: "Introduction to cellular biology and structure",
      credits: 4,
      progress: 78,
      isActive: true,
      userId: "current-user",
      createdAt: new Date(),
    };
    this.courses.set(sampleCourse.id, sampleCourse);

    // Sample tasks
    const tasks = [
      {
        title: "Read Chapter 4: Genetics",
        description: "Complete reading assignment for Biology 101",
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        completed: false,
        courseId: sampleCourse.id,
        userId: "current-user",
      },
      {
        title: "Problem Set 3: Organic Chemistry",
        description: "Complete chemistry problem set",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next week
        completed: false,
        courseId: null,
        userId: "current-user",
      },
      {
        title: "Submit Lab Report",
        description: "Physics lab report submission",
        dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
        completed: true,
        courseId: null,
        userId: "current-user",
      },
    ];

    tasks.forEach(task => {
      const taskId = randomUUID();
      this.tasks.set(taskId, {
        ...task,
        id: taskId,
        createdAt: new Date(),
      });
    });

    // Sample activities
    const activities = [
      {
        title: "Python Programming Certificate",
        type: "certification",
        provider: "Coursera • Google",
        description: "Completed comprehensive Python programming course",
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        status: "approved",
        userId: "current-user",
        fileUrl: null,
        approvedBy: null,
      },
      {
        title: "Tech Club Leadership",
        type: "volunteering",
        provider: "Computer Science Department",
        description: "Led tech club activities and organized events",
        startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        endDate: null,
        status: "approved",
        userId: "current-user",
        fileUrl: null,
        approvedBy: null,
      },
      {
        title: "Hackathon Winner",
        type: "competition",
        provider: "University Innovation Lab",
        description: "First place in annual hackathon competition",
        startDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000),
        status: "approved",
        userId: "current-user",
        fileUrl: null,
        approvedBy: null,
      },
    ];

    activities.forEach(activity => {
      const activityId = randomUUID();
      this.activities.set(activityId, {
        ...activity,
        id: activityId,
        createdAt: new Date(),
      });
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      gpa: "0.0",
      totalCredits: 0,
      completedCredits: 0,
      attendance: 0,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  // Activity methods
  async getActivities(userId: string): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .filter(activity => activity.userId === userId)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  async getRecentActivities(userId: string, limit: number = 6): Promise<Activity[]> {
    const activities = await this.getActivities(userId);
    return activities.slice(0, limit);
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = randomUUID();
    const activity: Activity = {
      ...insertActivity,
      id,
      status: "pending",
      description: insertActivity.description || null,
      endDate: insertActivity.endDate || null,
      fileUrl: null,
      userId: insertActivity.userId || null,
      approvedBy: null,
      createdAt: new Date(),
    };
    this.activities.set(id, activity);
    return activity;
  }

  async updateActivity(id: string, updates: Partial<Activity>): Promise<Activity | undefined> {
    const activity = this.activities.get(id);
    if (activity) {
      const updated = { ...activity, ...updates };
      this.activities.set(id, updated);
      return updated;
    }
    return undefined;
  }

  async updateActivityStatus(id: string, status: string, approvedBy?: string): Promise<Activity | undefined> {
    const activity = this.activities.get(id);
    if (activity) {
      const updated = { ...activity, status, approvedBy: approvedBy || null };
      this.activities.set(id, updated);
      return updated;
    }
    return undefined;
  }

  // Course methods
  async getCourses(userId: string): Promise<Course[]> {
    return Array.from(this.courses.values())
      .filter(course => course.userId === userId);
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const id = randomUUID();
    const course: Course = {
      ...insertCourse,
      id,
      description: insertCourse.description || null,
      userId: insertCourse.userId || null,
      credits: insertCourse.credits || null,
      progress: insertCourse.progress || null,
      isActive: insertCourse.isActive || null,
      createdAt: new Date(),
    };
    this.courses.set(id, course);
    return course;
  }

  async updateCourseProgress(id: string, progress: number): Promise<Course | undefined> {
    const course = this.courses.get(id);
    if (course) {
      const updated = { ...course, progress };
      this.courses.set(id, updated);
      return updated;
    }
    return undefined;
  }

  // Task methods
  async getTasks(userId: string): Promise<Task[]> {
    return Array.from(this.tasks.values())
      .filter(task => task.userId === userId)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }

  async getUpcomingTasks(userId: string, limit: number = 5): Promise<Task[]> {
    const now = new Date();
    return Array.from(this.tasks.values())
      .filter(task => task.userId === userId && new Date(task.dueDate) >= now && !task.completed)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, limit);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = randomUUID();
    const task: Task = {
      ...insertTask,
      id,
      description: insertTask.description || null,
      userId: insertTask.userId || null,
      completed: insertTask.completed || null,
      courseId: insertTask.courseId || null,
      createdAt: new Date(),
    };
    this.tasks.set(id, task);
    return task;
  }

  async updateTaskStatus(id: string, completed: boolean): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (task) {
      const updated = { ...task, completed };
      this.tasks.set(id, updated);
      return updated;
    }
    return undefined;
  }

  // Portfolio methods
  async getPortfolios(userId: string): Promise<Portfolio[]> {
    return Array.from(this.portfolios.values())
      .filter(portfolio => portfolio.userId === userId)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  async createPortfolio(insertPortfolio: InsertPortfolio): Promise<Portfolio> {
    const id = randomUUID();
    const portfolio: Portfolio = {
      ...insertPortfolio,
      id,
      status: "draft",
      generatedContent: null,
      userId: insertPortfolio.userId || null,
      targetField: insertPortfolio.targetField || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.portfolios.set(id, portfolio);
    return portfolio;
  }

  async updatePortfolio(id: string, updates: Partial<Portfolio>): Promise<Portfolio | undefined> {
    const portfolio = this.portfolios.get(id);
    if (portfolio) {
      const updated = { ...portfolio, ...updates, updatedAt: new Date() };
      this.portfolios.set(id, updated);
      return updated;
    }
    return undefined;
  }

  // Study Hours methods
  async getStudyHours(userId: string, startDate?: Date, endDate?: Date): Promise<StudyHours[]> {
    let studyHours = Array.from(this.studyHours.values())
      .filter(sh => sh.userId === userId);

    if (startDate) {
      studyHours = studyHours.filter(sh => new Date(sh.date) >= startDate);
    }
    if (endDate) {
      studyHours = studyHours.filter(sh => new Date(sh.date) <= endDate);
    }

    return studyHours.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  async createStudyHours(insertStudyHours: InsertStudyHours): Promise<StudyHours> {
    const id = randomUUID();
    const studyHours: StudyHours = {
      ...insertStudyHours,
      id,
      userId: insertStudyHours.userId || null,
      createdAt: new Date(),
    };
    this.studyHours.set(id, studyHours);
    return studyHours;
  }

  // Dashboard stats
  async getDashboardStats(userId: string): Promise<{
    studyHoursPercentage: number;
    studyHoursWeek: string;
    currentCourse: { title: string; progress: number } | null;
    assignments: { completed: number; total: number };
  }> {
    const courses = await this.getCourses(userId);
    const tasks = await this.getTasks(userId);
    
    // Get current active course with highest progress
    const currentCourse = courses
      .filter(course => course.isActive)
      .sort((a, b) => (b.progress || 0) - (a.progress || 0))[0];

    // Calculate assignment stats
    const completedAssignments = tasks.filter(task => task.completed).length;
    const totalAssignments = tasks.length;

    // Mock study hours calculation (67% of weekly goal)
    const weeklyGoal = 36; // hours
    const actualHours = 24.2;
    const studyHoursPercentage = Math.round((actualHours / weeklyGoal) * 100);

    return {
      studyHoursPercentage,
      studyHoursWeek: `${actualHours}h`,
      currentCourse: currentCourse ? {
        title: currentCourse.title,
        progress: currentCourse.progress || 0,
      } : null,
      assignments: {
        completed: completedAssignments,
        total: totalAssignments,
      },
    };
  }
}

export const storage = new MemStorage();

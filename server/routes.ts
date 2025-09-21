import type { Express } from "express";
import { createServer, type Server } from "http";
import { getStorage } from "./storage";
import { generatePortfolio, enhanceActivityDescription } from "./services/openai";
import { 
  insertActivitySchema, 
  insertCourseSchema, 
  insertTaskSchema, 
  insertPortfolioSchema,
  insertStudyHoursSchema 
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.get("/api/user", async (req, res) => {
    try {
      // In a real app, this would come from authentication middleware
      const userId = "current-user";
      const storage = await getStorage();
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user data" });
    }
  });

  // Dashboard stats route
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const userId = "current-user";
      const storage = await getStorage();
      const stats = await storage.getDashboardStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard statistics" });
    }
  });

  // Activity routes
  app.get("/api/activities", async (req, res) => {
    try {
      const userId = "current-user";
      const storage = await getStorage();
      const activities = await storage.getActivities(userId);
      res.json(activities);
    } catch (error) {
      console.error("Error fetching activities:", error);
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  app.get("/api/activities/recent", async (req, res) => {
    try {
      const userId = "current-user";
      const storage = await getStorage();
      const limit = parseInt(req.query.limit as string) || 6;
      const activities = await storage.getRecentActivities(userId, limit);
      res.json(activities);
    } catch (error) {
      console.error("Error fetching recent activities:", error);
      res.status(500).json({ message: "Failed to fetch recent activities" });
    }
  });

  app.post("/api/activities", async (req, res) => {
    try {
      const validatedData = insertActivitySchema.parse(req.body);
      
      // Convert string dates to Date objects and enforce userId
      const activityData = {
        ...validatedData,
        userId: "current-user",
        startDate: new Date(validatedData.startDate),
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
      };

      const storage = await getStorage();
      const activity = await storage.createActivity(activityData);
      
      // Optionally enhance description with AI if enabled
      if (process.env.OPENAI_API_KEY && !activity.description) {
        try {
          const enhancedDescription = await enhanceActivityDescription(
            activity.title,
            activity.type,
            activity.provider
          );
          const storage2 = await getStorage();
          await storage2.updateActivity(activity.id, { description: enhancedDescription });
        } catch (aiError) {
          console.warn("Failed to enhance activity description:", aiError);
          // Continue without AI enhancement
        }
      }

      res.status(201).json(activity);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid activity data", 
          errors: error.errors 
        });
      }
      console.error("Error creating activity:", error);
      res.status(500).json({ message: "Failed to create activity" });
    }
  });

  app.patch("/api/activities/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status, approvedBy } = req.body;
      
      if (!["approved", "rejected", "pending"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const storage = await getStorage();
      const activity = await storage.updateActivityStatus(id, status, approvedBy);
      
      if (!activity) {
        return res.status(404).json({ message: "Activity not found" });
      }

      res.json(activity);
    } catch (error) {
      console.error("Error updating activity status:", error);
      res.status(500).json({ message: "Failed to update activity status" });
    }
  });

  // Course routes
  app.get("/api/courses", async (req, res) => {
    try {
      const userId = "current-user";
      const storage = await getStorage();
      const courses = await storage.getCourses(userId);
      res.json(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  app.post("/api/courses", async (req, res) => {
    try {
      const validatedData = insertCourseSchema.parse(req.body);
      const storage = await getStorage();
      const courseData = { ...validatedData, userId: "current-user" };
      const course = await storage.createCourse(courseData);
      res.status(201).json(course);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid course data", 
          errors: error.errors 
        });
      }
      console.error("Error creating course:", error);
      res.status(500).json({ message: "Failed to create course" });
    }
  });

  // Task routes
  app.get("/api/tasks", async (req, res) => {
    try {
      const userId = "current-user";
      const storage = await getStorage();
      const tasks = await storage.getTasks(userId);
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.get("/api/tasks/upcoming", async (req, res) => {
    try {
      const userId = "current-user";
      const limit = parseInt(req.query.limit as string) || 5;
      const storage = await getStorage();
      const tasks = await storage.getUpcomingTasks(userId, limit);
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching upcoming tasks:", error);
      res.status(500).json({ message: "Failed to fetch upcoming tasks" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const validatedData = insertTaskSchema.parse(req.body);
      const taskData = {
        ...validatedData,
        userId: "current-user",
        dueDate: new Date(validatedData.dueDate),
      };
      const storage = await getStorage();
      const task = await storage.createTask(taskData);
      res.status(201).json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid task data", 
          errors: error.errors 
        });
      }
      console.error("Error creating task:", error);
      res.status(500).json({ message: "Failed to create task" });
    }
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { completed } = req.body;
      
      const storage = await getStorage();
      const task = await storage.updateTaskStatus(id, completed);
      
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      res.json(task);
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(500).json({ message: "Failed to update task" });
    }
  });

  // Portfolio routes
  app.get("/api/portfolios", async (req, res) => {
    try {
      const userId = "current-user";
      const storage = await getStorage();
      const portfolios = await storage.getPortfolios(userId);
      res.json(portfolios);
    } catch (error) {
      console.error("Error fetching portfolios:", error);
      res.status(500).json({ message: "Failed to fetch portfolios" });
    }
  });

  app.post("/api/portfolios", async (req, res) => {
    try {
      const validatedData = insertPortfolioSchema.parse(req.body);
      const storage = await getStorage();
      const portfolioData = { ...validatedData, userId: "current-user" };
      const portfolio = await storage.createPortfolio(portfolioData);
      res.status(201).json(portfolio);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid portfolio data", 
          errors: error.errors 
        });
      }
      console.error("Error creating portfolio:", error);
      res.status(500).json({ message: "Failed to create portfolio" });
    }
  });

  app.post("/api/portfolios/generate", async (req, res) => {
    try {
      const { apiKey, ...portfolioData } = req.body;
      const validatedData = insertPortfolioSchema.parse(portfolioData);
      
      // Create portfolio record first
      const storage = await getStorage();
      const portfolioDataForStorage = { ...validatedData, userId: "current-user" };
      const portfolio = await storage.createPortfolio(portfolioDataForStorage);

      // Start background generation process
      generatePortfolioAsync(portfolio.id, validatedData, apiKey);

      res.status(201).json({
        ...portfolio,
        message: "Portfolio generation started. You will be notified when complete."
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid portfolio data", 
          errors: error.errors 
        });
      }
      console.error("Error starting portfolio generation:", error);
      res.status(500).json({ message: "Failed to start portfolio generation" });
    }
  });

  // Background portfolio generation function
  async function generatePortfolioAsync(
    portfolioId: string, 
    portfolioData: any, 
    customApiKey?: string
  ) {
    try {
      // Get user data
      const storage = await getStorage();
      const user = await storage.getUser(portfolioData.userId);
      if (!user) {
        throw new Error("User not found");
      }

      // Get user's activities and courses
      const activities = await storage.getActivities(portfolioData.userId);
      const courses = await storage.getCourses(portfolioData.userId);

      // Prepare data for AI generation
      const studentData = {
        name: `${user.firstName} ${user.lastName}`,
        studentId: user.studentId,
        gpa: user.gpa || "0.0",
        activities: activities.filter(a => a.status === "approved"),
        courses: courses,
        achievements: activities.filter(a => a.type === "competition" && a.status === "approved"),
      };

      // Generate portfolio using OpenAI
      const generatedPortfolio = await generatePortfolio({
        focus: portfolioData.content.focus,
        targetField: portfolioData.content.targetField,
        additionalContext: portfolioData.content.additionalContext,
        studentData,
      }, customApiKey);

      // Update portfolio with generated content
      const storageForUpdate = await getStorage();
      await storageForUpdate.updatePortfolio(portfolioId, {
        status: "completed",
        generatedContent: generatedPortfolio.fullContent,
        content: {
          ...portfolioData.content,
          generated: generatedPortfolio,
        },
      });

    } catch (error) {
      console.error("Portfolio generation failed:", error);
      const storageForError = await getStorage();
      await storageForError.updatePortfolio(portfolioId, {
        status: "error",
        generatedContent: `Generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  }

  // Study hours routes
  app.get("/api/study-hours", async (req, res) => {
    try {
      const userId = "current-user";
      const { startDate, endDate } = req.query;
      
      const start = startDate ? new Date(startDate as string) : undefined;
      const end = endDate ? new Date(endDate as string) : undefined;
      
      const storage = await getStorage();
      const studyHours = await storage.getStudyHours(userId, start, end);
      res.json(studyHours);
    } catch (error) {
      console.error("Error fetching study hours:", error);
      res.status(500).json({ message: "Failed to fetch study hours" });
    }
  });

  app.post("/api/study-hours", async (req, res) => {
    try {
      const validatedData = insertStudyHoursSchema.parse(req.body);
      const studyHoursData = {
        ...validatedData,
        date: new Date(validatedData.date),
      };
      const storage = await getStorage();
      const studyHours = await storage.createStudyHours(studyHoursData);
      res.status(201).json(studyHours);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid study hours data", 
          errors: error.errors 
        });
      }
      console.error("Error creating study hours:", error);
      res.status(500).json({ message: "Failed to create study hours record" });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "healthy", 
      timestamp: new Date().toISOString(),
      services: {
        storage: "connected",
        openai: process.env.OPENAI_API_KEY ? "configured" : "not configured"
      }
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}

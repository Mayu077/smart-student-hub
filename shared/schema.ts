import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  studentId: text("student_id").notNull().unique(),
  email: text("email").notNull().unique(),
  gpa: text("gpa").default("0.0"),
  totalCredits: integer("total_credits").default(0),
  completedCredits: integer("completed_credits").default(0),
  attendance: integer("attendance").default(0),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const courses = pgTable("courses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  code: text("code").notNull(),
  description: text("description"),
  credits: integer("credits").default(3),
  progress: integer("progress").default(0),
  isActive: boolean("is_active").default(true),
  userId: varchar("user_id").references(() => users.id),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const activities = pgTable("activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  type: text("type").notNull(), // conference, workshop, certification, competition, volunteering, internship, research
  provider: text("provider").notNull(),
  description: text("description"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  status: text("status").default("pending"), // pending, approved, rejected
  fileUrl: text("file_url"),
  userId: varchar("user_id").references(() => users.id),
  approvedBy: varchar("approved_by").references(() => users.id),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const tasks = pgTable("tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  dueDate: timestamp("due_date").notNull(),
  completed: boolean("completed").default(false),
  courseId: varchar("course_id").references(() => courses.id),
  userId: varchar("user_id").references(() => users.id),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const portfolios = pgTable("portfolios", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  focus: text("focus").notNull(), // job, graduate_school, scholarship, internship, general
  targetField: text("target_field"),
  content: jsonb("content").notNull(),
  generatedContent: text("generated_content"),
  status: text("status").default("draft"), // draft, generating, completed, error
  userId: varchar("user_id").references(() => users.id),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

export const studyHours = pgTable("study_hours", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: timestamp("date").notNull(),
  hours: integer("hours").notNull(),
  userId: varchar("user_id").references(() => users.id),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  createdAt: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true,
  status: true,
  approvedBy: true,
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
});

export const insertPortfolioSchema = createInsertSchema(portfolios).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
  generatedContent: true,
});

export const insertStudyHoursSchema = createInsertSchema(studyHours).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;

export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;

export type Portfolio = typeof portfolios.$inferSelect;
export type InsertPortfolio = z.infer<typeof insertPortfolioSchema>;

export type StudyHours = typeof studyHours.$inferSelect;
export type InsertStudyHours = z.infer<typeof insertStudyHoursSchema>;

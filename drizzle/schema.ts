import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Code review task table - stores each code review submission
 */
export const reviewTasks = mysqlTable("review_tasks", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  codeContent: text("codeContent").notNull(),
  language: varchar("language", { length: 32 }).notNull(), // e.g., 'python', 'javascript', 'java'
  title: varchar("title", { length: 255 }),
  status: mysqlEnum("status", ["pending", "processing", "completed", "failed"]).default("pending"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export type ReviewTask = typeof reviewTasks.$inferSelect;
export type InsertReviewTask = typeof reviewTasks.$inferInsert;

/**
 * Review issues table - stores individual issues found during review
 */
export const reviewIssues = mysqlTable("review_issues", {
  id: int("id").autoincrement().primaryKey(),
  taskId: int("taskId").notNull().references(() => reviewTasks.id),
  agentType: varchar("agentType", { length: 64 }).notNull(), // e.g., 'code_analysis', 'security_detection', 'performance_optimization', 'documentation_generation'
  severity: mysqlEnum("severity", ["error", "warning", "suggestion"]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  lineNumber: int("lineNumber"),
  suggestion: text("suggestion"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ReviewIssue = typeof reviewIssues.$inferSelect;
export type InsertReviewIssue = typeof reviewIssues.$inferInsert;

/**
 * Agent execution log table - tracks each agent's execution details
 */
export const agentLogs = mysqlTable("agent_logs", {
  id: int("id").autoincrement().primaryKey(),
  taskId: int("taskId").notNull().references(() => reviewTasks.id),
  agentType: varchar("agentType", { length: 64 }).notNull(),
  agentName: varchar("agentName", { length: 128 }).notNull(), // e.g., '代码分析 Agent'
  status: mysqlEnum("status", ["pending", "running", "completed", "failed"]).default("pending"),
  startTime: timestamp("startTime"),
  endTime: timestamp("endTime"),
  durationMs: int("durationMs"), // execution time in milliseconds
  input: text("input"), // JSON string of input
  output: text("output"), // JSON string of output
  errorMessage: text("errorMessage"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AgentLog = typeof agentLogs.$inferSelect;
export type InsertAgentLog = typeof agentLogs.$inferInsert;

/**
 * Review statistics table - cached statistics for dashboard
 */
export const reviewStatistics = mysqlTable("review_statistics", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  totalReviews: int("totalReviews").default(0),
  totalIssuesFound: int("totalIssuesFound").default(0),
  errorCount: int("errorCount").default(0),
  warningCount: int("warningCount").default(0),
  suggestionCount: int("suggestionCount").default(0),
  fixedIssuesCount: int("fixedIssuesCount").default(0),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ReviewStatistics = typeof reviewStatistics.$inferSelect;
export type InsertReviewStatistics = typeof reviewStatistics.$inferInsert;
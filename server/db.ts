import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, reviewTasks, ReviewTask, InsertReviewTask, reviewIssues, InsertReviewIssue, agentLogs, InsertAgentLog, AgentLog, reviewStatistics, ReviewStatistics, InsertReviewStatistics } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Review task queries
export async function createReviewTask(task: InsertReviewTask) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(reviewTasks).values(task);
  return result;
}

export async function getReviewTask(taskId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(reviewTasks).where(eq(reviewTasks.id, taskId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserReviewTasks(userId: number, limit: number = 20) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(reviewTasks).where(eq(reviewTasks.userId, userId)).orderBy(desc(reviewTasks.createdAt)).limit(limit);
}

export async function updateReviewTaskStatus(taskId: number, status: ReviewTask["status"], completedAt?: Date) {
  const db = await getDb();
  if (!db) return;
  const updateData: any = { status };
  if (completedAt) updateData.completedAt = completedAt;
  await db.update(reviewTasks).set(updateData).where(eq(reviewTasks.id, taskId));
}

// Review issues queries
export async function createReviewIssue(issue: InsertReviewIssue) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(reviewIssues).values(issue);
}

export async function getTaskIssues(taskId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(reviewIssues).where(eq(reviewIssues.taskId, taskId)).orderBy(reviewIssues.severity);
}

// Agent log queries
export async function createAgentLog(log: InsertAgentLog) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(agentLogs).values(log);
}

export async function getTaskAgentLogs(taskId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(agentLogs).where(eq(agentLogs.taskId, taskId)).orderBy(agentLogs.createdAt);
}

export async function updateAgentLog(logId: number, updates: Partial<AgentLog>) {
  const db = await getDb();
  if (!db) return;
  await db.update(agentLogs).set(updates).where(eq(agentLogs.id, logId));
}

// Statistics queries
export async function getOrCreateUserStatistics(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await db.select().from(reviewStatistics).where(eq(reviewStatistics.userId, userId)).limit(1);
  if (existing.length > 0) return existing[0];
  
  const newStats: InsertReviewStatistics = {
    userId,
    totalReviews: 0,
    totalIssuesFound: 0,
    errorCount: 0,
    warningCount: 0,
    suggestionCount: 0,
    fixedIssuesCount: 0,
  };
  await db.insert(reviewStatistics).values(newStats);
  return getOrCreateUserStatistics(userId);
}

export async function updateUserStatistics(userId: number, updates: Partial<ReviewStatistics>) {
  const db = await getDb();
  if (!db) return;
  await db.update(reviewStatistics).set(updates).where(eq(reviewStatistics.userId, userId));
}

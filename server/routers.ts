import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { performCodeReview, getAgentNames } from "./agentService";
import * as db from "./db";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  review: router({
    submit: protectedProcedure
      .input(z.object({
        code: z.string().min(1),
        language: z.string().min(1),
        title: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const issues = await performCodeReview(input.code, input.language);
        const taskId = Date.now(); // Use timestamp as mock task ID

        // Try to persist to DB, but work without it
        try {
          const task = await db.createReviewTask({
            userId: ctx.user.id,
            codeContent: input.code,
            language: input.language,
            title: input.title || `Review - ${new Date().toLocaleString()}`,
            status: 'processing',
          });
          const realTaskId = (task as any).insertId || task[0];

          for (const issue of issues) {
            await db.createReviewIssue({
              taskId: realTaskId,
              agentType: issue.agentType,
              severity: issue.severity,
              title: issue.title,
              description: issue.description,
              lineNumber: issue.lineNumber,
              suggestion: issue.suggestion,
            });
          }

          await db.updateReviewTaskStatus(realTaskId, 'completed', new Date());

          const stats = await db.getOrCreateUserStatistics(ctx.user.id);
          const errorCount = issues.filter(i => i.severity === 'error').length;
          const warningCount = issues.filter(i => i.severity === 'warning').length;
          const suggestionCount = issues.filter(i => i.severity === 'suggestion').length;

          await db.updateUserStatistics(ctx.user.id, {
            totalReviews: (stats.totalReviews || 0) + 1,
            totalIssuesFound: (stats.totalIssuesFound || 0) + issues.length,
            errorCount: (stats.errorCount || 0) + errorCount,
            warningCount: (stats.warningCount || 0) + warningCount,
            suggestionCount: (stats.suggestionCount || 0) + suggestionCount,
          });
        } catch (e) {
          // DB not available - continue without persistence
          console.log("[Review] Running in demo mode (no database)");
        }

        return {
          taskId,
          issuesCount: issues.length,
          issues,
        };
      }),

    getTask: protectedProcedure
      .input(z.object({ taskId: z.number() }))
      .query(async ({ ctx, input }) => {
        const task = await db.getReviewTask(input.taskId);
        if (!task || task.userId !== ctx.user.id) {
          throw new Error('Task not found');
        }

        const issues = await db.getTaskIssues(input.taskId);
        const agentLogs = await db.getTaskAgentLogs(input.taskId);

        return {
          task,
          issues,
          agentLogs,
        };
      }),

    listTasks: protectedProcedure
      .input(z.object({ limit: z.number().default(20) }))
      .query(async ({ ctx, input }) => {
        try {
          return await db.getUserReviewTasks(ctx.user.id, input.limit);
        } catch {
          return [];
        }
      }),

    getStatistics: protectedProcedure
      .query(async ({ ctx }) => {
        try {
          return await db.getOrCreateUserStatistics(ctx.user.id);
        } catch {
          return {
            totalReviews: 0,
            totalIssuesFound: 0,
            errorCount: 0,
            warningCount: 0,
            suggestionCount: 0,
            fixedIssuesCount: 0,
          };
        }
      }),

    getAgents: publicProcedure
      .query(() => {
        return getAgentNames();
      }),
  }),
});

export type AppRouter = typeof appRouter;

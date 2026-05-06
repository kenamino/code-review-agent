import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

// Mock user for local demo mode (when OAuth is not configured)
const MOCK_USER: User = {
  id: 1,
  openId: "local-demo-user",
  name: "Demo User",
  email: "demo@example.com",
  role: "user",
  loginMethod: "local",
  createdAt: new Date(),
  lastSignedIn: new Date(),
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  // If OAuth is not configured, use mock user for local demo
  if (!process.env.OAUTH_SERVER_URL) {
    return {
      req: opts.req,
      res: opts.res,
      user: MOCK_USER,
    };
  }

  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    // Authentication is optional for public procedures.
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}

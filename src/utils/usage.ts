import { auth } from "@/lib/auth/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { RateLimiterPrisma } from "rate-limiter-flexible";

const credits = {
  free_user: 3,
  pro_user: 50,
  gold_user: 100,
} as const;

export const getUsageTracker = async () => {
  const result = await auth.api.getSession({
    headers: await headers(),
  });
  if (!result?.session) {
    throw new Error("the user is not authenticated");
  }
  const usageTracker = new RateLimiterPrisma({
    storeClient: prisma,
    tableName: "Usage",
    points: credits[result.user.plan],
    duration: 86400,
  });
  return usageTracker;
};

export const consumeCredits = async (userId: string) => {
  const usageTracker = await getUsageTracker();
  const result = await usageTracker.consume(userId, 1);
  return result;
};

export const getUsageStatus = async (userId: string) => {
  const usageTracker = await getUsageTracker();
  const result = await usageTracker.get(userId);
  return result;
};

export const incrementCredits = async (userId: string) => {
  const usageTracker = await getUsageTracker();
  const result = await usageTracker.reward(userId, 1);
  return result;
};

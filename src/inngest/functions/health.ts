import { inngest } from "../client";

export const healthCheck = inngest.createFunction(
  { id: "health-check" },
  { event: "test/health" },
  async ({ step }) => {
    return await step.run("health-check", () => {
      return "inngest is running"
    });
  },
);

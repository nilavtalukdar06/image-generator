import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { healthCheck } from "@/inngest/functions/health";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [healthCheck],
});

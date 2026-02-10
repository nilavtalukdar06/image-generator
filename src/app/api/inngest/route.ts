import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { healthCheck } from "@/inngest/functions/health";
import { generateImageFunction } from "@/inngest/functions/generate-image";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [healthCheck, generateImageFunction],
});

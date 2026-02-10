import { imageRouter } from "@/modules/images/server/procedures";
import { createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  images: imageRouter,
});

export type AppRouter = typeof appRouter;

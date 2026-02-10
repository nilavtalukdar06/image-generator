import { createTRPCRouter, protectedProcedure } from "@/backend/init";
import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";
import { z } from "zod";

export const imageRouter = createTRPCRouter({
  createImage: protectedProcedure
    .input(
      z.object({
        prompt: z.string().min(5, "prompt is too short"),
      }),
    )
    .mutation(async (opts) => {
      const result = await prisma.image.create({
        data: {
          prompt: opts.input.prompt,
          status: "in_progress",
          userId: opts.ctx.user.id,
        },
      });
      await inngest.send({
        name: "generate/image",
        data: {
          prompt: opts.input.prompt,
          imageId: result.id,
        },
      });
      return result;
    }),
});

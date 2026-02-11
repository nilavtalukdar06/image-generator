import { createTRPCRouter, protectedProcedure } from "@/backend/init";
import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";
import { consumeCredits } from "@/utils/usage";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const imageRouter = createTRPCRouter({
  createImage: protectedProcedure
    .input(
      z.object({
        prompt: z
          .string()
          .min(5, "prompt is too short")
          .max(100, "prompt is too large"),
      }),
    )
    .mutation(async (opts) => {
      try {
        await consumeCredits(opts.ctx.user.id);
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: "PAYMENT_REQUIRED",
          message:
            "Image generation limit exceeded for today, try again after 24 hours",
        });
      }
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
          userId: opts.ctx.user.id,
        },
      });
      return result;
    }),
  getImages: protectedProcedure.query(async (opts) => {
    const result = await prisma.image.findMany({
      where: {
        userId: opts.ctx.user.id,
        status: {
          not: "failed",
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return result;
  }),
  deleteImage: protectedProcedure
    .input(
      z.object({
        imageId: z.string().uuid("image id is not valid"),
      }),
    )
    .mutation(async (opts) => {
      const result = await prisma.$transaction(async (tx) => {
        const image = await tx.image.findUniqueOrThrow({
          where: {
            id: opts.input.imageId,
          },
        });
        if (image.userId !== opts.ctx.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You are not allowed to delete this image",
          });
        }
        return await tx.image.delete({
          where: {
            id: image.id,
          },
        });
      });
      return result;
    }),
});

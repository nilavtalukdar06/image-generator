import { inngest } from "../client";
import { generateImage } from "ai";
import { openai } from "@ai-sdk/openai";
import { imagekit } from "@/utils/imagekit";
import prisma from "@/lib/prisma";

export const generateImageFunction = inngest.createFunction(
  { id: "generate-image" },
  { event: "generate/image" },
  async ({ event, step }) => {
    const result = await step.run("generate-image", async () => {
      try {
        const { image } = await generateImage({
          model: openai.image("dall-e-3"),
          prompt: event.data.prompt,
          aspectRatio: "1:1",
        });
        return image.base64;
      } catch (error) {
        await prisma.image.update({
          where: {
            id: event.data.imageId,
          },
          data: {
            status: "failed",
          },
        });
        throw error;
      }
    });
    const imageUrl = await step.run("save-image", async () => {
      const uploadResponse = await imagekit.upload({
        file: "data:image/png;base64," + result,
        fileName: event.data.imageId + ".png",
        folder: "/dall-e-clone",
      });
      return uploadResponse;
    });
    const dbResult = await step.run("save-image-to-database", async () => {
      return await prisma.image.update({
        where: {
          id: event.data.imageId,
        },
        data: {
          imageUrl: imageUrl.url,
          status: "generated",
        },
      });
    });
    return dbResult;
  },
);

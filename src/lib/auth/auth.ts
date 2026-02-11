import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import {
  polar,
  checkout,
  portal,
  webhooks,
} from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";
import prisma from "../prisma";

const polarClient = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  server: "sandbox",
});

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      plan: {
        type: ["free_user", "pro_user", "gold_user"],
        required: true,
        defaultValue: "free_user",
        input: false,
      },
    },
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: "066d72aa-46ed-4e45-b180-5728928f7ce5",
              slug: "DALL-E-Pro-Plan",
            },
            {
              productId: "b2707f0a-e8a0-4bc3-a75d-babccc6fec60",
              slug: "DALL-E-Gold-Plan",
            },
          ],
          authenticatedUsersOnly: true,
          successUrl: "/",
        }),
        portal(),
        webhooks({
          secret: process.env.POLAR_WEBHOOK_SECRET!,
        }),
      ],
    }),
  ],
});

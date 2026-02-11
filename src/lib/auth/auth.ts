import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { polar, checkout, portal, webhooks } from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";
import prisma from "../prisma";

const polarClient = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  server: "sandbox",
});

const mapProductNameToPlan = {
  "DALL-E Pro Plan": "pro_user",
  "DALL-E Gold Plan": "gold_user",
};

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
          onOrderPaid: async (payload) => {
            const externalId = payload.data.customer.externalId;
            if (!externalId) {
              return;
            }
            const productName = payload.data.product?.name;
            if (!productName) {
              return;
            }
            try {
              await prisma.$transaction(async (tx) => {
                (await tx.user.findUnique({
                  where: {
                    id: externalId,
                  },
                }),
                  await tx.user.update({
                    where: {
                      id: externalId,
                    },
                    data: {
                      plan: mapProductNameToPlan[
                        productName as "DALL-E Pro Plan" | "DALL-E Gold Plan"
                      ],
                    },
                  }));
              });
            } catch (error) {
              console.error(error);
              throw error;
            }
          },
          onSubscriptionRevoked: async (payload) => {
            const externalId = payload.data.customer.externalId;
            if (!externalId) {
              return;
            }
            try {
              await prisma.$transaction(async (tx) => {
                await tx.user.findUniqueOrThrow({
                  where: {
                    id: externalId,
                  },
                });
                await tx.user.update({
                  where: {
                    id: externalId,
                  },
                  data: {
                    plan: "free_user",
                  },
                });
              });
            } catch (error) {
              console.error(error);
              throw error;
            }
          },
        }),
      ],
    }),
  ],
});

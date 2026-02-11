"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckIcon } from "lucide-react";

interface Props {
  plan: "free_user" | "pro_user" | "gold_user";
}

const pricingInfo = {
  free_user: {
    title: "Free Plan",
    description:
      "Enjoy DALL-E aboslutely at no cost, Good if you want to try the application",
    features: ["3 Images per day", "Basic Support", "1GB Storage Space"],
    productId: "",
  },
  pro_user: {
    title: "Pro Plan",
    description: "Become a pro memeber of DALL-E at just 20 dollars per month",
    features: ["50 Images per day", "Priority Support", "5GB Storage Space"],
    productId: "",
  },
  gold_user: {
    title: "Gold Plan",
    description: "Become a gold memeber of DALL-E at just 50 dollars per month",
    features: [
      "100 Images per day",
      "24/7 Personal Support",
      "15GB Storage Space",
    ],
    productId: "",
  },
};

export function PricingCard({ plan }: Props) {
  return (
    <Card className="rounded-none shadow-none w-full py-4 gap-3 bg-sidebar h-full">
      <CardHeader className="px-4">
        <CardTitle className="font-normal">{pricingInfo[plan].title}</CardTitle>
        <CardDescription className="font-light text-sm">
          {pricingInfo[plan].description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col justify-center items-start px-4">
        {pricingInfo[plan].features.map((feature: string, index: number) => (
          <div
            className="flex justify-start items-center gap-x-2"
            key={index + 1}
          >
            <CheckIcon className="text-green-500 font-light" size={14} />
            <p className="text-neutral-600 font-light text-sm">{feature}</p>
          </div>
        ))}
      </CardContent>
      <CardFooter className="px-4 w-full mt-2">
        <Button className="w-full rounded-none font-normal" size="sm">
          Switch to this plan
        </Button>
      </CardFooter>
    </Card>
  );
}

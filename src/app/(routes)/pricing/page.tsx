import { auth } from "@/lib/auth/auth";
import { PricingCard } from "@/modules/pricing/pricing-card";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

type PlanType = "free_user" | "pro_user" | "gold_user";

export default async function PricingPage() {
  const plans = ["free_user", "pro_user", "gold_user"] satisfies PlanType[];
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/login");
  }
  return (
    <div className="px-4 py-2 w-full">
      <p className="text-lg font-light text-neutral-600">DALL-E Pricing</p>
      <p className="text-sm font-light text-muted-foreground">
        Switch to the plan that match your needs
      </p>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 place-items-center gap-4 my-4">
        {plans.map((item, index) => (
          <PricingCard
            plan={item}
            key={index + 1}
            currentPlan={session.user.plan}
          />
        ))}
      </div>
    </div>
  );
}

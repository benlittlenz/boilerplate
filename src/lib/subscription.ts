
import { freePlan, proPlan } from "~/config/subscriptions";
import { prisma } from "~/server/db";
import { type UserSubscriptionPlan } from "~/types";

export async function getUserSubscriptionPlan(
  userId: string
): Promise<UserSubscriptionPlan> {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      stripeSubscriptionId: true,
      stripeCurrentPeriodEnd: true,
      stripeCustomerId: true,
      stripePriceId: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Check if user is on a pro plan.
  const isPro =
    user.stripePriceId && user.stripeCurrentPeriodEnd &&
    (user.stripeCurrentPeriodEnd.getTime() + 86_400_000 > Date.now());

  const plan = isPro ? proPlan : freePlan;

  return {
    ...plan,
    ...user,
    stripeCurrentPeriodEnd: user.stripeCurrentPeriodEnd?.getTime() ?? 0,
    isPro: typeof isPro === 'boolean' ? isPro : false,
  };
}

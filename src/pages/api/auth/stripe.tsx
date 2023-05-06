import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { z, type TypeOf } from "zod";
import { proPlan } from "~/config/subscriptions";
import { stripe } from "~/lib/stripe";
import { getUserSubscriptionPlan } from "~/lib/subscription";
import { type resetPasswordSchema } from "~/lib/validations/auth";
import { authOptions } from "~/server/auth";
import { getBaseUrl } from "~/utils/api";

interface ResetPasswordRequest extends NextApiRequest {
  body: TypeOf<typeof resetPasswordSchema> & {
    requestId: string;
  };
}

export default async function handler(
  req: ResetPasswordRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(400).json({ message: "" });
  }

  const billingUrl = `${getBaseUrl()}/dashboard/billing`;

  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !session?.user.email) {
      return res.status(403).json({ message: "Invalid session" });
    }

    const subscriptionPlan = await getUserSubscriptionPlan(session.user.id);

    // The user is on the pro plan.
    // Create a portal session to manage subscription.
    if (subscriptionPlan.isPro && subscriptionPlan.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: subscriptionPlan.stripeCustomerId,
        return_url: billingUrl,
      });

      return res.status(200).json({ url: stripeSession.url });
    }

    // The user is on the free plan.
    // Create a checkout session to upgrade.
    const stripeSession = await stripe.checkout.sessions.create({
      success_url: billingUrl,
      cancel_url: billingUrl,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      customer_email: session.user.email,
      line_items: [
        {
          price: proPlan.stripePriceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId: session.user.id,
      },
    });

    return res.status(200).json({ url: stripeSession.url });
  } catch(err) {
    if(err instanceof z.ZodError) {
        return res.status(422).json({ message: JSON.stringify(err.issues) });
    }
    return res.status(500).json({ message: null });
  }
}

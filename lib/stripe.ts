import Stripe from "stripe";

// Use a placeholder for build time, actual key required at runtime
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "sk_test_placeholder";

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2026-01-28.clover",
  typescript: true,
});

// Runtime validation
export function validateStripeConfig() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not set in environment variables");
  }
}

import Stripe from 'stripe';

// Server-side Stripe only - function-based lazy initialization to avoid build-time errors
let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY environment variable is not set. Please set it in your Vercel environment variables.');
    }
    stripeInstance = new Stripe(secretKey, {
      apiVersion: '2023-10-16' as any,
    });
  }
  return stripeInstance;
}

// Export stripe as a Proxy for backward compatibility
// Only initializes when accessed at runtime, not during build
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return getStripe()[prop as keyof Stripe];
  },
}) as Stripe;
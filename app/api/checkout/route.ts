import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe-server';
import { OrderValidationError, fitStripeMetadata, priceCartItems } from '@/lib/orderPricing';

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

/** Stripe only accepts absolute image URLs; a /public path would fail the whole session. */
function stripeImages(image: string): string[] | undefined {
  try {
    return new URL(image).protocol === 'https:' ? [image] : undefined;
  } catch {
    return undefined;
  }
}

export async function POST(request: NextRequest) {
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const { items, shippingInfo }: { items: unknown; shippingInfo?: ShippingInfo } = body ?? {};

  if (shippingInfo !== undefined && (typeof shippingInfo !== 'object' || shippingInfo === null)) {
    return NextResponse.json({ error: 'Invalid shipping information' }, { status: 400 });
  }

  try {
    // Only ids and quantities come from the browser; prices come from the database.
    const lines = await priceCartItems(items);

    // Create line items for Stripe
    const lineItems = lines.map((line) => {
      const images = stripeImages(line.image);
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: line.title,
            ...(images ? { images } : {}),
            ...(line.description ? { description: line.description } : {}),
            metadata: {
              productId: line.productId,
              category: line.category,
            },
          },
          unit_amount: Math.round(line.unitPrice * 100), // Stripe expects cents
        },
        quantity: line.quantity,
      };
    });

    const metadata: Record<string, string> = {
      itemCount: lines.reduce((sum, line) => sum + line.quantity, 0).toString(),
    };
    const orderItems = fitStripeMetadata(
      JSON.stringify(
        lines.map((line) => ({
          productId: line.productId,
          title: line.title,
          quantity: line.quantity,
          price: line.unitPrice,
        }))
      )
    );
    if (orderItems) metadata.orderItems = orderItems;

    // Prepare session configuration
    const sessionConfig: any = {
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${request.nextUrl.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/checkout/cancel`,
      metadata,
      customer_creation: 'always',
      billing_address_collection: 'required',
      // Collect the shipping address at Stripe whether or not the client sent one.
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'JP'],
      },
    };

    // Add shipping information if provided
    if (shippingInfo) {
      if (typeof shippingInfo.email === 'string' && shippingInfo.email.trim()) {
        sessionConfig.customer_email = shippingInfo.email.trim();
      }
      const customerInfo = fitStripeMetadata(JSON.stringify(shippingInfo));
      if (customerInfo) sessionConfig.metadata.customerInfo = customerInfo;
    }

    // Create Stripe checkout session
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create(sessionConfig);

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    if (error instanceof OrderValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    );
  }
}

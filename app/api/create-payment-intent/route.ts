import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe-server';
import { OrderValidationError, fitStripeMetadata, orderTotals, priceCartItems } from '@/lib/orderPricing';

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

// The checkout form's country <select> values, mapped to ISO codes for Stripe.
const COUNTRY_CODES: Record<string, string> = {
  'United States': 'US',
  Canada: 'CA',
  'United Kingdom': 'GB',
  Australia: 'AU',
  Germany: 'DE',
  France: 'FR',
  Japan: 'JP',
};

const REQUIRED_SHIPPING_FIELDS: (keyof ShippingInfo)[] = [
  'firstName',
  'lastName',
  'email',
  'address',
  'city',
  'state',
  'zipCode',
];

function isShippingInfo(value: unknown): value is ShippingInfo {
  if (!value || typeof value !== 'object') return false;
  const info = value as Record<string, unknown>;
  return REQUIRED_SHIPPING_FIELDS.every((key) => typeof info[key] === 'string' && (info[key] as string).trim() !== '');
}

export async function POST(request: NextRequest) {
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  // Any `amount` or item prices in the body are ignored: the total is computed
  // from the database so a customer cannot choose what they pay.
  const { items, shippingInfo } = body ?? {};

  if (!isShippingInfo(shippingInfo)) {
    return NextResponse.json({ error: 'Shipping information is required' }, { status: 400 });
  }

  try {
    const lines = await priceCartItems(items);
    const { total, totalCents } = orderTotals(lines);

    if (totalCents <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const metadata: Record<string, string> = {
      itemCount: lines.reduce((sum, line) => sum + line.quantity, 0).toString(),
      orderTotal: total.toFixed(2),
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
    const customerInfo = fitStripeMetadata(JSON.stringify(shippingInfo));
    if (customerInfo) metadata.customerInfo = customerInfo;

    // Create payment intent
    const stripe = getStripe();
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalCents,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata,
      shipping: {
        name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
        address: {
          line1: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          postal_code: shippingInfo.zipCode,
          country: Object.prototype.hasOwnProperty.call(COUNTRY_CODES, shippingInfo.country)
            ? COUNTRY_CODES[shippingInfo.country]
            : 'US',
        },
      },
      receipt_email: shippingInfo.email,
      description: `Order for ${lines.length} item(s) from Eagles FC Store`,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amount: totalCents,
    });
  } catch (error) {
    if (error instanceof OrderValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Error creating payment intent' },
      { status: 500 }
    );
  }
}

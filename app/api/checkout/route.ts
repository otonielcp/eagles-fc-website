import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe-server';
import { Product } from '@/types/product';

interface CartItem extends Product {
  quantity: number;
}

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

export async function POST(request: NextRequest) {
  try {
    const { items, shippingInfo }: { items: CartItem[]; shippingInfo?: ShippingInfo } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 });
    }

    // Create line items for Stripe
    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.title,
          images: [item.image],
          description: item.description || '',
          metadata: {
            productId: item._id,
            category: item.category,
          },
        },
        unit_amount: Math.round(item.price * 100), // Stripe expects cents
      },
      quantity: item.quantity,
    }));

    // Prepare session configuration
    const sessionConfig: any = {
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${request.nextUrl.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/checkout/cancel`,
      metadata: {
        orderItems: JSON.stringify(items.map(item => ({
          productId: item._id,
          title: item.title,
          quantity: item.quantity,
          price: item.price,
        }))),
        itemCount: items.reduce((sum, item) => sum + item.quantity, 0).toString(),
      },
      customer_creation: 'always',
      billing_address_collection: 'required',
    };

    // Add shipping information if provided
    if (shippingInfo) {
      sessionConfig.customer_email = shippingInfo.email;
      sessionConfig.metadata.customerInfo = JSON.stringify(shippingInfo);
      
      // Pre-fill shipping address if shipping is required
      sessionConfig.shipping_address_collection = {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'JP'],
      };
    } else {
      // If no shipping info provided (direct from cart), collect shipping at Stripe
      sessionConfig.shipping_address_collection = {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'JP'],
      };
    }

    // Create Stripe checkout session
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create(sessionConfig);

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe-server';
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
    const { 
      amount, 
      items, 
      shippingInfo 
    }: { 
      amount: number; 
      items: CartItem[]; 
      shippingInfo: ShippingInfo 
    } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Amount in cents
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        orderItems: JSON.stringify(items.map(item => ({
          productId: item._id,
          title: item.title,
          quantity: item.quantity,
          price: item.price,
        }))),
        customerInfo: JSON.stringify(shippingInfo),
        itemCount: items.reduce((sum, item) => sum + item.quantity, 0).toString(),
        orderTotal: (amount / 100).toString(),
      },
      shipping: {
        name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
        address: {
          line1: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          postal_code: shippingInfo.zipCode,
          country: shippingInfo.country === 'United States' ? 'US' : 'US', // Map to country codes
        },
      },
      receipt_email: shippingInfo.email,
      description: `Order for ${items.length} item(s) from Eagles FC Store`,
    });

    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret 
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Error creating payment intent' },
      { status: 500 }
    );
  }
}
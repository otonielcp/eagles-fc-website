import connectDB from '@/lib/dbConnect';
import Product from '@/models/Product';
import { getOrderTotals } from '@/components/checkout/orderTotals';

/**
 * Server-side pricing for the shop. The browser's cart (localStorage) carries
 * a copy of each product, price included, so anything it sends is editable by
 * the customer. Only the product id and quantity are taken from the request;
 * prices always come from the database.
 */

export const MAX_QUANTITY = 99;
const MAX_LINES = 50;
const OBJECT_ID = /^[a-f\d]{24}$/i;

export class OrderValidationError extends Error {}

export interface PricedLine {
  productId: string;
  title: string;
  description: string;
  image: string;
  category: string;
  unitPrice: number; // dollars, as stored on the Product
  quantity: number;
}

export async function priceCartItems(rawItems: unknown): Promise<PricedLine[]> {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    throw new OrderValidationError('No items in cart');
  }
  if (rawItems.length > MAX_LINES) {
    throw new OrderValidationError('Too many items in cart');
  }

  const requested = rawItems.map((item) => {
    const id = item && typeof item === 'object' ? (item as { _id?: unknown })._id : undefined;
    const quantity = item && typeof item === 'object' ? (item as { quantity?: unknown }).quantity : undefined;

    if (typeof id !== 'string' || !OBJECT_ID.test(id)) {
      throw new OrderValidationError('Your cart contains an invalid product');
    }
    if (typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
      throw new OrderValidationError(`Each quantity must be a whole number from 1 to ${MAX_QUANTITY}`);
    }
    return { id, quantity };
  });

  await connectDB();
  const ids = Array.from(new Set(requested.map((r) => r.id)));
  const products: any[] = await Product.find({ _id: { $in: ids } }).lean();
  const byId = new Map(products.map((p) => [String(p._id), p]));

  return requested.map(({ id, quantity }) => {
    const product = byId.get(id);
    if (!product) {
      throw new OrderValidationError('A product in your cart is no longer available. Please refresh your cart.');
    }
    const unitPrice = Number(product.price);
    if (!Number.isFinite(unitPrice) || unitPrice < 0) {
      throw new OrderValidationError('A product in your cart cannot be purchased right now');
    }
    return {
      productId: id,
      title: String(product.title ?? ''),
      description: String(product.description ?? ''),
      image: String(product.image ?? ''),
      category: String(product.category ?? ''),
      // The cart charges `price`; `discount` is the struck-through original price.
      unitPrice,
      quantity,
    };
  });
}

/**
 * Same arithmetic as the cart and checkout summaries: the subtotal is summed in
 * cart order like CartContext, then shipping and tax come from the shared
 * getOrderTotals, so the amount charged matches the amount displayed.
 */
export function orderTotals(lines: PricedLine[]) {
  const subtotal = lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
  const totals = getOrderTotals(subtotal);
  return { ...totals, totalCents: Math.round(totals.total * 100) };
}

/** Stripe rejects metadata values over 500 characters; drop rather than fail the payment. */
export function fitStripeMetadata(value: string): string | undefined {
  return value.length <= 500 ? value : undefined;
}

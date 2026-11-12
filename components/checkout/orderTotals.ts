// Single source for the shop's flat shipping and sales tax, so the cart page,
// the checkout summary and the amount charged all agree.
export const SHIPPING_FLAT = 5.99;
export const TAX_RATE = 0.07;

export function getOrderTotals(subtotal: number) {
  const shipping = subtotal > 0 ? SHIPPING_FLAT : 0;
  const tax = subtotal * TAX_RATE;
  return { subtotal, shipping, tax, total: subtotal + shipping + tax };
}

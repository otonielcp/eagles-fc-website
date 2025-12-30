"use client";

import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/app/context/CartContext';
import { useRouter } from 'next/navigation';

export default function CartButton() {
  const { itemCount } = useCart();
  const router = useRouter();

  const handleCartClick = () => {
    router.push('/cart');
  };

  return (
    <button
      onClick={handleCartClick}
      className="fixed bottom-6 right-6 bg-[#C5A464] text-white p-4 rounded-full shadow-lg hover:bg-[#B39355] transition-all duration-200 hover:scale-105 z-40"
      aria-label={`Open cart with ${itemCount} items`}
    >
      <ShoppingBag className="w-6 h-6" />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-pulse">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </button>
  );
}
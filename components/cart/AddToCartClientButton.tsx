"use client";

import { useState } from 'react';
import { useCart } from '@/app/context/CartContext';
import { ShoppingBag, Check } from 'lucide-react';
import { Product } from '@/types/product';

interface AddToCartClientButtonProps {
  product: Product;
  quantity?: number;
  className?: string;
}

export default function AddToCartClientButton({ 
  product, 
  quantity = 1,
  className = ""
}: AddToCartClientButtonProps) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation if used inside a Link
    e.stopPropagation();
    
    addToCart(product, quantity);
    setIsAdded(true);
    
    // Reset the state after animation
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <button
      onClick={handleAddToCart}
      className={`
        mt-2 w-full bg-[#C5A464] text-white py-2 px-4 rounded-lg 
        hover:bg-[#B39355] transition-all duration-200 
        flex items-center justify-center gap-2 font-medium
        ${isAdded ? 'bg-green-500 hover:bg-green-600' : ''}
        ${className}
      `}
    >
      {isAdded ? (
        <>
          <Check className="w-4 h-4" />
          Added to Cart!
        </>
      ) : (
        <>
          <ShoppingBag className="w-4 h-4" />
          Add to Cart
        </>
      )}
    </button>
  );
}
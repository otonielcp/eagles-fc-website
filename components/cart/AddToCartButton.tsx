"use client";
import { useState } from "react";
import { ShoppingBag, Minus, Plus } from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import { Product } from "@/types/product";

export default function AddToCartButton({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <>
      <div className="flex items-center mb-6">
        <span className="text-gray-700 font-medium mr-4">Quantity:</span>
        <div className="flex items-center border rounded-md">
          <button 
            onClick={decreaseQuantity}
            className="px-3 py-2 border-r hover:bg-gray-50"
          >
            <Minus className="w-4 h-4 text-gray-500" />
          </button>
          <span className="px-4 py-2">{quantity}</span>
          <button 
            onClick={increaseQuantity}
            className="px-3 py-2 border-l hover:bg-gray-50"
          >
            <Plus className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <button 
          onClick={handleAddToCart}
          className="flex-1 text-white py-3 px-6 rounded-md transition flex items-center justify-center" style={{ backgroundColor: '#181819' }}
        >
          <ShoppingBag className="w-5 h-5 mr-2" />
          Add to Cart
        </button>
        {/* ... existing heart button ... */}
      </div>
    </>
  );
} 
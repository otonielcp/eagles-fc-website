"use client";
import { useCart } from "@/app/context/CartContext";
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, total, itemCount } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  // Calculate subtotal (same as total from context)
  const subtotal = total;
  
  if (items.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen py-12 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-6">Looks like you haven't added any products to your cart yet.</p>
          <Link 
            href="/shop" 
            className="inline-flex items-center justify-center bg-[#C5A464] text-white py-3 px-6 rounded-md hover:bg-[#B39355] transition"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">Cart Items ({items.length})</h2>
                  <button 
                    onClick={clearCart}
                    className="text-sm text-red-600 hover:text-red-800 transition"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
              
              <div className="divide-y">
                {items.map((item) => (
                  <div key={item._id} className="p-6 flex flex-col sm:flex-row gap-4">
                    {/* Product Image */}
                    <div className="sm:w-24 sm:h-24 flex-shrink-0">
                      <div className="relative w-full h-24">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="object-contain w-full h-full"
                        />
                      </div>
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-grow">
                      <Link href={`/shop/${item._id}`} className="text-lg font-medium text-gray-900 hover:text-[#C5A464] transition">
                        {item.title}
                      </Link>
                      <p className="text-sm text-gray-500 mb-2">Category: {item.category}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border rounded-md">
                          <button 
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            className="px-3 py-1 border-r hover:bg-gray-50"
                          >
                            <Minus className="w-3 h-3 text-gray-500" />
                          </button>
                          <span className="px-3 py-1">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="px-3 py-1 border-l hover:bg-gray-50"
                          >
                            <Plus className="w-3 h-3 text-gray-500" />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item._id)}
                          className="text-red-500 hover:text-red-700 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Price */}
                    <div className="text-right">
                      <p className="text-lg font-semibold text-[#C5A464]">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-6">
              <Link 
                href="/shop" 
                className="inline-flex items-center text-gray-600 hover:text-[#C5A464] transition"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Continue Shopping
              </Link>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">$0.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${(subtotal * 0.07).toFixed(2)}</span>
                </div>
                <div className="border-t pt-4 flex justify-between">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-lg font-bold text-[#C5A464]">
                    ${(subtotal + (subtotal * 0.07)).toFixed(2)}
                  </span>
                </div>
              </div>
              
              <Link href="/checkout">
                <button 
                  className="w-full bg-[#C5A464] text-white py-3 rounded-md hover:bg-[#B39355] transition"
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
                </button>
              </Link>
              
              <div className="mt-6 text-center text-sm text-gray-500">
                <p>We accept all major credit cards and PayPal</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
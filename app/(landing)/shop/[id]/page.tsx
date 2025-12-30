"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";
import RelatedProducts from "@/components/landing/RelatedProducts";
import { Suspense } from "react";
import CartButton from "@/components/cart/CartButton";
import { getProductById } from "@/actions/product";
import { Product } from "@/types/product";
import { useCart } from "@/app/context/CartContext";

// Enhanced AddToCartButton component with cart functionality
function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart(product, 1);
    setIsAdded(true);
    
    // Reset the state after animation
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <button
      onClick={handleAddToCart}
      className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
        isAdded 
          ? 'bg-green-500 text-white hover:bg-green-600' 
          : 'bg-[#C5A464] text-white hover:bg-[#B39355]'
      }`}
    >
      {isAdded ? 'Added to Cart!' : 'Add to Cart'}
    </button>
  );
}

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        if (typeof params.id !== 'string') {
          throw new Error('Invalid product ID');
        }
        
        const productData = await getProductById(params.id);
        
        if (!productData) {
          router.push('/404');
          return;
        }
        
        setProduct(productData);
      } catch (err) {
        setError('Failed to load product. Please try again.');
        console.error('Error fetching product:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [params.id, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C5A464] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Product not found'}</p>
          <Link href="/shop" className="inline-flex items-center text-[#C5A464]">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  // Calculate discount percentage if discount exists
  const discountPercentage = product.discount 
    ? Math.round(((product.discount - product.price) / product.discount) * 100)
    : 0;

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Breadcrumb */}
      <div className="bg-white py-4 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center text-sm text-gray-500">
            <Link href="/shop" className="hover:text-[#C5A464] transition">
              Shop
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{product.title}</span>
          </div>
        </div>
      </div>
      
      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Back Button (Mobile Only) */}
          <div className="lg:hidden mb-4">
            <Link href="/shop" className="inline-flex items-center text-gray-600 hover:text-[#C5A464]">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Shop
            </Link>
          </div>
          
          {/* Product Images */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
              <div className="relative aspect-square">
                <img 
                  src={product.image} 
                  alt={product.title}                  
                  className="object-contain"
                />
                {product.isNewProduct && (
                  <span className="absolute top-4 left-4 bg-[#C5A464] text-white text-xs px-2 py-1 rounded">
                    NEW
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Product Info */}
          <div className="lg:w-1/2">
            <div className="hidden lg:block mb-4">
              <Link href="/shop" className="inline-flex items-center text-gray-600 hover:text-[#C5A464]">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Shop
              </Link>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
            
            <div className="flex items-center mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-500">4.0 (24 reviews)</span>
            </div>
            
            <div className="flex items-center mb-6">
              <span className="text-2xl font-bold text-[#C5A464]">${product.price.toFixed(2)}</span>
              {product.discount && (
                <>
                  <span className="ml-3 text-lg text-gray-400 line-through">${product.discount.toFixed(2)}</span>
                  <span className="ml-3 bg-red-100 text-red-700 px-2 py-0.5 rounded text-sm font-medium">
                    {discountPercentage}% OFF
                  </span>
                </>
              )}
            </div>
            
            <div className="border-t border-b py-6 mb-6">
              <p className="text-gray-700 mb-4">{product.description}</p>
              
              <div className="flex items-center mt-4">
                <span className="text-gray-700 font-medium mr-3">Category:</span>
                <span className="text-gray-600">{product.category}</span>
              </div>
            </div>
            
            {/* Add to Cart Section */}
            <div className="mb-8">
              <AddToCartButton product={product} />
            </div>
            
            {/* Product Features */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Product Features:</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Official team merchandise</li>
                <li>High-quality materials</li>
                <li>Comfortable fit</li>
                <li>Machine washable</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">You May Also Like</h2>
        <Suspense fallback={<div className="h-[300px] flex items-center justify-center">Loading related products...</div>}>
          <RelatedProducts currentProductId={product._id} category={product.category} />
        </Suspense>
      </div>
      
      {/* Cart Button */}
      <CartButton />
    </div>
  );
}
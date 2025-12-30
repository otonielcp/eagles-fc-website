"use client";

import { useEffect, useState } from "react";
import { getRelatedProducts } from "@/actions/product";
import { Product } from "@/types/product";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";

interface RelatedProductsProps {
  currentProductId: string;
  category: string;
}

export default function RelatedProducts({ currentProductId, category }: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRelatedProducts = async () => {
      try {
        const relatedProducts = await getRelatedProducts(currentProductId, category);
        setProducts(relatedProducts.map(product => ({
          ...product,
          isNewProduct: product.isNew,
          updatedAt: product.createdAt // Fallback to createdAt if updatedAt not available
        })));
      } catch (error) {
        console.error("Error loading related products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRelatedProducts();
  }, [currentProductId, category]);

  if (loading) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C5A464]"></div>
      </div>
    );
  }

  if (products.length === 0) {
    return <div className="text-center py-8 text-gray-500">No related products found</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map(product => (
        <Link href={`/shop/${product._id}`} key={product._id}>
          <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 transition-transform hover:shadow-md hover:-translate-y-1">
            <div className="relative aspect-square">
              <img
                src={product.image}
                alt={product.title}
                className="object-contain"
              />
              {product.isNewProduct && (
                <span className="absolute top-2 left-2 bg-[#C5A464] text-white text-xs px-2 py-1 rounded">
                  NEW
                </span>
              )}
              <button
                className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-sm hover:bg-gray-100 transition"
                onClick={(e) => {
                  e.preventDefault();
                  // Add to wishlist functionality
                }}
              >
                <Heart className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-1">{product.title}</h3>
              <div className="flex items-center">
                <span className="text-[#C5A464] font-semibold">${product.price.toFixed(2)}</span>
                {product.discount && (
                  <span className="ml-2 text-gray-400 text-sm line-through">${product.discount.toFixed(2)}</span>
                )}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
} 
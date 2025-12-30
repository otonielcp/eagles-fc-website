"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Product } from "@/types/product";
import { getFeaturedProducts, getProducts } from "@/actions/product";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";

const TopProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const { addToCart } = useCart();

  // Fetch products from backend
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getFeaturedProducts();        
        setProducts(data);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Calculate number of slides to show based on viewport width
  const getVisibleSlides = (): number => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width >= 1280) return 5;
      if (width >= 1024) return 4;
      if (width >= 768) return 3;
      if (width >= 640) return 2;
      return 1;
    }
    return 3; // Default for SSR
  };

  // Initialize with default to avoid hydration mismatch
  const [visibleSlides, setVisibleSlides] = useState<number>(3);

  // Update visible slides on window resize
  useEffect(() => {
    // Set initial value on client side only
    setVisibleSlides(getVisibleSlides());
    
    const handleResize = () => {
      setVisibleSlides(getVisibleSlides());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalSlides = products.length;
  const maxIndex = Math.max(0, totalSlides - visibleSlides);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  // Calculate item width based on visible slides
  const getItemWidth = () => {
    // Account for gap (16px) between items
    return `calc((100% / ${visibleSlides}) - ${(visibleSlides - 1) * 16 / visibleSlides}px)`;
  };

  // Handle add to cart
  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  // Show loading placeholder if products are still loading
  if (loading) {
    return (
      <div className="w-full mx-auto px-8 bg-gray-50 py-12 text-center">
        <p className="text-base font-bebas uppercase text-[#C5A464] tracking-wide">Shop</p>
        <h2 className="text-4xl font-bebas mb-6">Top Products</h2>
        <div className="flex justify-center items-center h-[300px]">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-md bg-gray-200 h-[300px] w-[200px]"></div>
            <div className="rounded-md bg-gray-200 h-[300px] w-[200px] hidden sm:block"></div>
            <div className="rounded-md bg-gray-200 h-[300px] w-[200px] hidden md:block"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto px-8 bg-gray-50 py-12 text-center">
      {/* Section Title */}
      <p className="text-base font-bebas uppercase text-[#C5A464] tracking-wide">Shop</p>
      <h2 className="text-4xl font-bebas mb-6">Top Products</h2>

      {/* Products Carousel */}
      <div className="relative px-10">
        <div className="overflow-hidden">
          <motion.div
            className="flex gap-4"
            animate={{
              x: -currentIndex * (100 / visibleSlides + 16 * (visibleSlides - 1) / visibleSlides) + '%'
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {products.map((product) => (
              <Link href={`/shop/${product._id}`} key={product._id} className="flex-shrink-0" style={{ width: getItemWidth() }}>
                <div className="relative bg-white rounded overflow-hidden">
                  <div className="relative bg-white rounded overflow-hidden">
                    {/* Product Image */}
                    <div className="relative">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-[300px] object-cover rounded-tr-lg rounded-tl-lg"
                      />

                      {/* New Label */}
                      {product.isNewProduct && (
                        <span className="absolute bottom-0 left-3 bg-white text-black text-xs px-2 py-1 rounded-tr-md rounded-tl-md uppercase">
                          New
                        </span>
                      )}

                      {/* Favorite Icon */}
                      <button className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors">
                        <Heart className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>

                    {/* Product Info - Below Image */}
                    <div className="p-4 bg-white">
                      <p className="text-md text-left font-semibold">${product.price.toFixed(2)}</p>
                      <p className="text-left text-gray-800 text-sm">{product.title}</p>
                      {/* <button 
                        onClick={(e) => handleAddToCart(product, e)}
                        className="mt-3 w-full text-white py-2 rounded-md transition text-sm" style={{ backgroundColor: '#181819' }}
                      >
                        Add to Cart
                      </button> */}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </motion.div>
        </div>

        {/* Navigation Controls */}
        {currentIndex > 0 && (
          <button
            onClick={handlePrev}
            className="bg-[#C5A464] text-white rounded-full p-3 absolute left-2 top-1/2 transform -translate-y-1/2 hover:bg-[#B39355] transition focus:outline-none z-10"
            aria-label="Previous products"
          >
            &#8592;
          </button>
        )}

        {currentIndex < maxIndex && (
          <button
            onClick={handleNext}
            className="bg-[#C5A464] text-white rounded-full p-3 absolute right-2 top-1/2 transform -translate-y-1/2 hover:bg-[#B39355] transition focus:outline-none z-10"
            aria-label="Next products"
          >
            &#8594;
          </button>
        )}

        {/* Pagination Dots */}
        <div className="flex justify-center mt-6">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 mx-1 rounded-full transition-colors ${index === currentIndex ? "bg-[#333]" : "bg-[#ccc]"
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* View All Products Button */}
      <div className="mt-8">
        <Link href="/shop">
          <button className="bg-[#C5A464] hover:bg-[#B39355] transition-colors text-sm text-white px-6 py-3 rounded-full">
            View All Products
          </button>
        </Link>
      </div>
    </div>
  );
};

export default TopProducts;
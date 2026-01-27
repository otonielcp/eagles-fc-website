"use client";

import { useEffect, useState } from 'react';
import { Search, ShoppingBag, Filter, ChevronDown, X, Heart, Eye, SlidersHorizontal } from "lucide-react";
import { getProducts } from '@/actions/product';
import Link from 'next/link';
import CartButton from "@/components/cart/CartButton";
import AddToCartClientButton from "@/components/cart/AddToCartClientButton";
import { Product } from '@/types/product';
import { motion } from 'framer-motion';

export default function Shop() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRanges, setPriceRanges] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState('newest');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  // Categories with dynamic counts
  const categories = [
    { id: 1, name: "Clothing", count: allProducts.filter(p => p.category === "Clothing").length },
    { id: 2, name: "Accessories", count: allProducts.filter(p => p.category === "Accessories").length },
    { id: 3, name: "Footwear", count: allProducts.filter(p => p.category === "Footwear").length },
    { id: 4, name: "Training Gear", count: allProducts.filter(p => p.category === "Training Gear").length },
    { id: 5, name: "Souvenirs", count: allProducts.filter(p => p.category === "Souvenirs").length }
  ];

  // Price range options
  const priceRangeOptions = [
    { id: 'under25', label: 'Under $25', min: 0, max: 24.99 },
    { id: '25to50', label: '$25 - $50', min: 25, max: 50 },
    { id: '50to100', label: '$50 - $100', min: 50.01, max: 100 },
    { id: 'over100', label: 'Over $100', min: 100.01, max: 10000 }
  ];

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getProducts();
        setAllProducts(products);
        setFilteredProducts(products);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products when filter criteria change
  useEffect(() => {
    let result = [...allProducts];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product =>
        product.title.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      result = result.filter(product => selectedCategories.includes(product.category));
    }

    // Apply price range filter
    if (priceRanges.length > 0) {
      result = result.filter(product => {
        return priceRanges.some(rangeId => {
          const range = priceRangeOptions.find(r => r.id === rangeId);
          if (!range) return false;
          return product.price >= range.min && product.price <= range.max;
        });
      });
    }

    // Apply sorting
    switch (sortOption) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        break;
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    setFilteredProducts(result);
  }, [allProducts, searchQuery, selectedCategories, priceRanges, sortOption]);

  // Toggle category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Toggle price range selection
  const togglePriceRange = (rangeId: string) => {
    setPriceRanges(prev =>
      prev.includes(rangeId)
        ? prev.filter(r => r !== rangeId)
        : [...prev, rangeId]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setPriceRanges([]);
    setSortOption('newest');
  };

  const activeFiltersCount = selectedCategories.length + priceRanges.length + (searchQuery ? 1 : 0);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Clean Header Section */}
      <div className="bg-[#181819] border-b border-[#BD9B58]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-10">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full py-4 pl-14 pr-6 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#BD9B58] shadow-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Shop Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-6">
              <h1 className="text-4xl md:text-5xl font-bebas font-black text-white">
                SHOP
              </h1>
              <div className="h-10 w-[1px] bg-[#BD9B58]"></div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Collection</p>
                <p className="text-white font-bold text-lg">{filteredProducts.length} {filteredProducts.length === 1 ? 'Item' : 'Items'}</p>
              </div>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-[#BD9B58] hover:text-[#D4AF37] flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
                >
                  <X className="w-4 h-4" />
                  Clear ({activeFiltersCount})
                </button>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="lg:hidden flex items-center gap-2 px-5 py-2.5 border border-white/30 rounded-lg hover:border-[#BD9B58] transition-colors text-white"
              >
                <SlidersHorizontal className="w-5 h-5" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="bg-[#BD9B58] text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  className="appearance-none border border-white/30 rounded-lg px-5 py-2.5 bg-white/10 backdrop-blur-sm text-white pr-10 focus:outline-none focus:ring-2 focus:ring-[#BD9B58] focus:border-[#BD9B58] font-medium cursor-pointer"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="newest" className="bg-[#181819]">Newest First</option>
                  <option value="price-low" className="bg-[#181819]">Price: Low to High</option>
                  <option value="price-high" className="bg-[#181819]">Price: High to Low</option>
                  <option value="name-asc" className="bg-[#181819]">Name: A to Z</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Shop Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className={`lg:w-1/4 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="lg:sticky lg:top-8 space-y-6">
              {/* Categories */}
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <h3 className="text-lg font-bebas font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <Filter className="w-5 h-5 text-[#BD9B58]" />
                  Categories
                </h3>
                <ul className="space-y-2">
                  {categories.map(category => (
                    <li key={category.id}>
                      <button
                        onClick={() => toggleCategory(category.name)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                          selectedCategories.includes(category.name)
                            ? 'bg-[#BD9B58] text-white shadow-md'
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <span className="font-medium">{category.name}</span>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                          selectedCategories.includes(category.name)
                            ? 'bg-white/20 text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {category.count}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Range */}
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <h3 className="text-lg font-bebas font-bold text-gray-900 mb-5">Price Range</h3>
                <div className="space-y-2">
                  {priceRangeOptions.map(range => (
                    <button
                      key={range.id}
                      onClick={() => togglePriceRange(range.id)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        priceRanges.includes(range.id)
                          ? 'bg-[#BD9B58] text-white shadow-md'
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <span className="font-medium">{range.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Product Grid */}
          <div className="lg:w-3/4">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="h-72 bg-gray-200 rounded-xl mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-xl text-gray-500 mb-2 font-semibold">No products found</p>
                <p className="text-gray-400 mb-6">Try adjusting your filters or search terms</p>
                <button
                  onClick={clearFilters}
                  className="bg-[#BD9B58] text-white px-6 py-3 rounded-lg hover:bg-[#D4AF37] transition-colors font-semibold"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="group"
                    onMouseEnter={() => setHoveredProduct(product._id)}
                    onMouseLeave={() => setHoveredProduct(null)}
                  >
                    <Link href={`/shop/${product._id}`}>
                      <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-[#BD9B58]/50 relative h-full flex flex-col">
                        {/* Premium Glow Effect */}
                        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-[#BD9B58]/0 via-[#BD9B58]/0 to-[#BD9B58]/0 transition-all duration-500 pointer-events-none ${
                          hoveredProduct === product._id ? 'from-[#BD9B58]/5 via-transparent to-transparent' : ''
                        }`}></div>
                        
                        {/* Product Image */}
                        <div className="relative h-72 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 overflow-hidden flex-shrink-0">
                          {/* Image with premium treatment */}
                          <div
                            className={`h-full w-full bg-cover bg-center transition-all duration-500 ${
                              hoveredProduct === product._id ? 'scale-105 brightness-105' : 'scale-100 brightness-100'
                            }`}
                            style={{
                              backgroundImage: `url(${product.image})`,
                              backgroundPosition: "center",
                              backgroundSize: "cover",
                            }}
                          ></div>
                          
                          {/* Elegant gradient overlay on hover */}
                          <div className={`absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent transition-opacity duration-300 ${
                            hoveredProduct === product._id ? 'opacity-100' : 'opacity-0'
                          }`}></div>
                          
                          {/* Premium Badges */}
                          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                            {product.isNewProduct && (
                              <span className="bg-gradient-to-r from-[#BD9B58] via-[#D4AF37] to-[#BD9B58] text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-[0.15em] shadow-xl border border-white/30">
                                New
                              </span>
                            )}
                            {product.discount && (
                              <span className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-[0.15em] shadow-xl border border-white/30">
                                Sale
                              </span>
                            )}
                          </div>

                          {/* Premium Quick Actions */}
                          {hoveredProduct === product._id && (
                            <div className="absolute top-3 right-3 flex gap-2 z-10">
                              <button 
                                className="bg-white/95 backdrop-blur-sm rounded-full p-2.5 hover:bg-white transition-all shadow-lg border border-white/50"
                                onClick={(e) => { e.preventDefault(); }}
                              >
                                <Heart className="w-4 h-4 text-gray-800" />
                              </button>
                              <button 
                                className="bg-white/95 backdrop-blur-sm rounded-full p-2.5 hover:bg-white transition-all shadow-lg border border-white/50"
                                onClick={(e) => { e.preventDefault(); }}
                              >
                                <Eye className="w-4 h-4 text-gray-800" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Premium Product Info */}
                        <div className="p-5 flex-1 flex flex-col">
                          {/* Category Tag with accent */}
                          <div className="mb-2 flex items-center gap-2">
                            <div className="h-[1.5px] w-8 bg-gradient-to-r from-[#BD9B58] to-transparent"></div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                              {product.category}
                            </span>
                          </div>
                          
                          {/* Product Title - Premium Typography */}
                          <h4 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#BD9B58] transition-colors duration-300 leading-tight">
                            {product.title}
                          </h4>
                          
                          {/* Price Section - Premium */}
                          <div className="mt-auto pt-4 border-t border-gray-100">
                            <div className="flex items-baseline gap-2 mb-3">
                              <span className="text-2xl font-bebas font-black text-[#BD9B58]">
                                ${product.price.toFixed(2)}
                              </span>
                              {product.discount && (
                                <>
                                  <span className="text-sm text-gray-400 line-through font-medium">
                                    ${product.discount.toFixed(2)}
                                  </span>
                                  <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded border border-red-200">
                                    {Math.round(((product.discount - product.price) / product.discount) * 100)}% OFF
                                  </span>
                                </>
                              )}
                            </div>
                            
                            {/* Premium Add to Cart Button */}
                            <div className="mt-2">
                              <AddToCartClientButton product={product} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {filteredProducts.length > 0 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center gap-2">
                  <button className="px-5 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 hover:border-[#BD9B58] hover:text-[#BD9B58] transition-colors font-medium">
                    Previous
                  </button>
                  <button className="px-5 py-2.5 border border-[#BD9B58] rounded-lg bg-[#BD9B58] text-white font-medium">
                    1
                  </button>
                  <button className="px-5 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 hover:border-[#BD9B58] hover:text-[#BD9B58] transition-colors font-medium">
                    2
                  </button>
                  <button className="px-5 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 hover:border-[#BD9B58] hover:text-[#BD9B58] transition-colors font-medium">
                    3
                  </button>
                  <button className="px-5 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 hover:border-[#BD9B58] hover:text-[#BD9B58] transition-colors font-medium">
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-[#181819] py-16 mt-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-bebas font-bold text-white mb-4">Join Our Newsletter</h3>
          <p className="text-gray-300 mb-8 text-lg">
            Subscribe to get exclusive offers, early access to new releases, and special member discounts
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4 max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-6 py-4 rounded-lg bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#BD9B58] focus:border-[#BD9B58]"
            />
            <button className="bg-[#BD9B58] text-white py-4 px-10 rounded-lg hover:bg-[#D4AF37] transition-colors font-bold uppercase tracking-wide">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <CartButton />
    </div>
  );
}

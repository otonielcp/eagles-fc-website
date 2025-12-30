"use client";

import { useEffect, useState, Suspense } from 'react';
import TopProducts from '@/components/landing/TopProducts';
import { Search, ShoppingBag, Filter, ChevronDown } from "lucide-react";
import { getProducts } from '@/actions/product';
import Link from 'next/link';
import CartButton from "@/components/cart/CartButton";
import AddToCartClientButton from "@/components/cart/AddToCartClientButton";
import { Product } from '@/types/product';

const heroImage = "/shop/image.webp";

export default function Shop() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRanges, setPriceRanges] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState('newest');

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

  // Get featured products
  const featuredProducts = allProducts.filter(product => product.isFeatured).slice(0, 3);

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

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Banner */}
      <div className="w-full h-[400px] flex items-center justify-center bg-[#C5A464] text-white py-20 px-4" style={{ backgroundImage: `url(${heroImage})`, backgroundPosition: "top", backgroundSize: "cover" }}>
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Official Team Store</h1>
          <p className="text-lg text-gray-300 mb-8">Get the latest gear and support your favorite team</p>
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full py-3 px-4 pr-10 rounded-full text-black focus:outline-none focus:ring-2 focus:ring-[#C5A464]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Shop Content */}
      <div className="mx-auto px-4 py-12 container mx-auto">
        {/* Top Products Component */}
        <Suspense fallback={<div className="h-[500px] flex items-center justify-center">Loading top products...</div>}>
          <TopProducts />
        </Suspense>

        {/* Shop Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-4 border-b border-gray-200">
          <div className="flex items-center mb-4 md:mb-0">
            <h2 className="text-2xl font-bold text-gray-800 mr-4">Shop All Products</h2>
            <span className="text-sm text-gray-500">({filteredProducts.length} items)</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {(selectedCategories.length > 0 || priceRanges.length > 0 || searchQuery) && (
              <button
                onClick={clearFilters}
                className="text-sm text-[#C5A464] hover:underline"
              >
                Clear Filters
              </button>
            )}

            <div className="relative">
              <select
                className="appearance-none border rounded-md px-4 py-2 bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-[#C5A464]"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="newest">Sort by: Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Shop Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Categories</h3>
              <ul className="space-y-2">
                {categories.map(category => (
                  <li key={category.id} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`category-${category.id}`}
                        className="mr-2"
                        checked={selectedCategories.includes(category.name)}
                        onChange={() => toggleCategory(category.name)}
                      />
                      <label
                        htmlFor={`category-${category.id}`}
                        className={`cursor-pointer ${selectedCategories.includes(category.name) ? 'text-[#C5A464] font-medium' : 'text-gray-600'}`}
                      >
                        {category.name}
                      </label>
                    </div>
                    <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-1">
                      {category.count}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Price Range</h3>
              <div className="space-y-4">
                {priceRangeOptions.map(range => (
                  <div key={range.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={range.id}
                      className="mr-2"
                      checked={priceRanges.includes(range.id)}
                      onChange={() => togglePriceRange(range.id)}
                    />
                    <label
                      htmlFor={range.id}
                      className={`cursor-pointer ${priceRanges.includes(range.id) ? 'text-[#C5A464] font-medium' : 'text-gray-600'}`}
                    >
                      {range.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* All Products Grid */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">All Products</h3>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="h-64 bg-gray-300 rounded-lg mb-4"></div>
                      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                    </div>
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">No products match your filters</p>
                  <button
                    onClick={clearFilters}
                    className="text-[#C5A464] hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map(product => (
                    <div key={product._id} className="group relative">
                      <Link href={`/shop/${product._id}`}>
                        <div className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-lg overflow-hidden">
                          <div
                            className="h-64 bg-gray-200 rounded-lg"
                            style={{
                              backgroundImage: `url(${product.image})`,
                              backgroundPosition: "center",
                              backgroundSize: "contain",
                              backgroundRepeat: "no-repeat"
                            }}
                          ></div>
                          {product.isNewProduct && (
                            <span className="absolute top-2 left-2 bg-[#C5A464] text-white text-xs px-2 py-1 rounded">
                              NEW
                            </span>
                          )}
                          {product.discount && (
                            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                              SALE
                            </span>
                          )}
                        </div>
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-800">{product.title}</h4>
                          <div className="flex items-center mt-1">
                            <span className="text-[#C5A464] font-semibold">${product.price.toFixed(2)}</span>
                            {product.discount && (
                              <span className="ml-2 text-gray-400 text-sm line-through">${product.discount.toFixed(2)}</span>
                            )}
                          </div>
                        </div>
                      </Link>
                      <AddToCartClientButton product={product} />
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination - Simple version */}
              {filteredProducts.length > 0 && (
                <div className="flex justify-center mt-12">
                  <div className="flex space-x-1">
                    <button className="px-4 py-2 border rounded-md bg-white text-gray-500 hover:bg-gray-50">
                      Previous
                    </button>
                    <button className="px-4 py-2 border rounded-md bg-[#C5A464] text-white">
                      1
                    </button>
                    <button className="px-4 py-2 border rounded-md bg-white text-gray-700 hover:bg-gray-50">
                      2
                    </button>
                    <button className="px-4 py-2 border rounded-md bg-white text-gray-700 hover:bg-gray-50">
                      3
                    </button>
                    <button className="px-4 py-2 border rounded-md bg-white text-gray-500 hover:bg-gray-50">
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-gray-100 py-16 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Join Our Newsletter</h3>
          <p className="text-gray-600 mb-6">Subscribe to get special offers and be the first to know about new releases</p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-3">
            <input
              type="email"
              placeholder="Your email address"
              className="px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C5A464] sm:w-72"
            />
            <button className="bg-[#C5A464] text-white py-3 px-6 rounded-md hover:bg-[#B39355] transition">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Mini Cart Icon - Fixed */}
      
      <CartButton />
    </div>
  );
}
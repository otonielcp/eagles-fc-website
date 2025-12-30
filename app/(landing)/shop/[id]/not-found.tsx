import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ProductNotFound() {
  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Not Found</h1>
        <p className="text-gray-600 mb-6">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Link 
          href="/shop" 
          className="inline-flex items-center justify-center bg-[#C5A464] text-white py-3 px-6 rounded-md hover:bg-[#B39355] transition"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Shop
        </Link>
      </div>
    </div>
  );
} 
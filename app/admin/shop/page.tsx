"use client";

import { Suspense } from "react";
import { Toaster } from "sonner";
import ProductsManagement from "@/components/admin/products/ProductsManagement";
import { Loader2 } from "lucide-react";

export default function AdminShopPage() {
  return (
    <div className="p-6">
      <Toaster position="top-right" />
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Shop Management</h1>
        <p className="text-gray-500 mt-1">
          Manage your products, categories, and inventory
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <Suspense fallback={
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        }>
          <ProductsManagement />
        </Suspense>
      </div>
    </div>
  );
} 
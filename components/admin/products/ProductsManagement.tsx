"use client";

import { useState, useEffect } from "react";
import { getProducts, deleteProduct } from "@/actions/product";
import { Product } from "@/types/product";
import { toast } from "sonner";
import { Loader2, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProductList from "./ProductList";
import AddProductForm from "./AddProductForm";
import EditProductForm from "./EditProductForm";
import DeleteProductDialog from "./DeleteProductDialog";

export default function ProductsManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      toast.error("Failed to load products");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setShowAddForm(true);
    setEditingProduct(null);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowAddForm(false);
  };

  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product);
  };

  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;
    
    try {
      const result = await deleteProduct(productToDelete._id);
      if (result.success) {
        toast.success(result.message);
        setProducts(products.filter(p => p._id !== productToDelete._id));
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to delete product");
      console.error(error);
    } finally {
      setProductToDelete(null);
    }
  };

  const handleProductAdded = (newProduct: Product) => {
    setProducts([newProduct, ...products]);
    setShowAddForm(false);
    toast.success("Product added successfully");
  };

  const handleProductUpdated = (updatedProduct: Product) => {
    setProducts(products.map(p => p._id === updatedProduct._id ? updatedProduct : p));
    setEditingProduct(null);
    toast.success("Product updated successfully");
  };

  const filteredProducts = products.filter(product => 
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Products Management</h1>
        <Button onClick={handleAddProduct} className="flex items-center gap-2">
          <Plus size={16} />
          Add New Product
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          placeholder="Search products..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      ) : (
        <ProductList 
          products={filteredProducts} 
          onEdit={handleEditProduct} 
          onDelete={handleDeleteProduct} 
        />
      )}

      {showAddForm && (
        <AddProductForm 
          onCancel={() => setShowAddForm(false)} 
          onProductAdded={handleProductAdded} 
        />
      )}

      {editingProduct && (
        <EditProductForm 
          product={editingProduct} 
          onCancel={() => setEditingProduct(null)} 
          onProductUpdated={handleProductUpdated} 
        />
      )}

      <DeleteProductDialog 
        isOpen={!!productToDelete}
        productName={productToDelete?.title || ""}
        onCancel={() => setProductToDelete(null)}
        onConfirm={confirmDeleteProduct}
      />
    </div>
  );
} 
'use server'

import connectDB from '@/lib/dbConnect';
import Product from '@/models/Product';
import { revalidatePath } from 'next/cache';
import { Product as ProductType, ProductFormData } from '@/types/product';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Get all products
export async function getProducts(): Promise<ProductType[]> {
  try {
    await connectDB();
    const products = await Product.find({}).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
}

// Get featured products
export async function getFeaturedProducts(): Promise<ProductType[]> {
  try {
    await connectDB();
    const products = await Product.find({ isFeatured: true }).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error("Error fetching featured products:", error);
    throw new Error("Failed to fetch featured products");
  }
}

// Get products by category
export async function getProductsByCategory(category: string): Promise<ProductType[]> {
  try {
    await connectDB();
    const products = await Product.find({ category }).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error(`Error fetching products in category ${category}:`, error);
    throw new Error(`Failed to fetch products in category ${category}`);
  }
}

// Get a single product by ID
export async function getProductById(id: string): Promise<ProductType | null> {
  try {
    await connectDB();
    const product = await Product.findById(id);

    if (!product) {
      return null;
    }

    return {
      _id: product._id.toString(),
      title: product.title,
      price: product.price,
      description: product.description,
      image: product.image,
      category: product.category,
      isNewProduct: product.isNewProduct,
      isFeatured: product.isFeatured,
      discount: product.discount,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return null;
  }
}

// Upload image to Cloudinary
export async function uploadProductImage(formData: FormData): Promise<{ success: boolean; url?: string; message?: string }> {
  try {
    const file = formData.get('file') as File;

    if (!file) {
      return { success: false, message: "No file provided" };
    }

    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64String = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64String, {
      folder: 'eagles-fc/products',
      resource_type: 'auto',
    });

    return {
      success: true,
      url: result.secure_url
    };
  } catch (error: any) {
    console.error("Error uploading image:", error);
    return {
      success: false,
      message: error.message || "Failed to upload image"
    };
  }
}

// Create a new product
export async function createProduct(productData: ProductFormData): Promise<{ success: boolean; message: string; product?: ProductType }> {
  try {
    await connectDB();
    const product = await Product.create(productData);
    revalidatePath('/admin/shop');
    revalidatePath('/shop');
    return {
      success: true,
      message: "Product created successfully",
      product: JSON.parse(JSON.stringify(product))
    };
  } catch (error: any) {
    console.error("Error creating product:", error);
    return {
      success: false,
      message: error.message || "Failed to create product"
    };
  }
}

// Update an existing product
export async function updateProduct(id: string, productData: Partial<ProductFormData>): Promise<{ success: boolean; message: string; product?: ProductType }> {
  try {
    await connectDB();
    const product = await Product.findByIdAndUpdate(
      id,
      productData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return { success: false, message: "Product not found" };
    }

    revalidatePath('/admin/shop');
    revalidatePath('/shop');
    revalidatePath(`/shop/${id}`);

    return {
      success: true,
      message: "Product updated successfully",
      product: JSON.parse(JSON.stringify(product))
    };
  } catch (error: any) {
    console.error(`Error updating product with ID ${id}:`, error);
    return {
      success: false,
      message: error.message || `Failed to update product with ID ${id}`
    };
  }
}

// Delete a product
export async function deleteProduct(id: string): Promise<{ success: boolean; message: string }> {
  try {
    await connectDB();

    // Get the product to find the image URL
    const product = await Product.findById(id);

    if (!product) {
      return { success: false, message: "Product not found" };
    }

    // Extract public_id from Cloudinary URL if it exists
    if (product.image && product.image.includes('cloudinary')) {
      try {
        const urlParts = product.image.split('/');
        const filenameWithExtension = urlParts[urlParts.length - 1];
        const publicId = `eagles-fc/products/${filenameWithExtension.split('.')[0]}`;

        // Delete image from Cloudinary
        await cloudinary.uploader.destroy(publicId);
      } catch (cloudinaryError) {
        console.error("Error deleting image from Cloudinary:", cloudinaryError);
        // Continue with product deletion even if image deletion fails
      }
    }

    // Delete the product
    await Product.findByIdAndDelete(id);

    revalidatePath('/admin/shop');
    revalidatePath('/shop');

    return { success: true, message: "Product deleted successfully" };
  } catch (error: any) {
    console.error(`Error deleting product with ID ${id}:`, error);
    return {
      success: false,
      message: error.message || `Failed to delete product with ID ${id}`
    };
  }
}

export async function getRelatedProducts(productId: string, category: string) {
  try {
    await connectDB();

    // Find products in the same category, excluding the current product
    const relatedProducts = await Product.find({
      _id: { $ne: productId },
      category: category
    })
      .limit(4)
      .sort({ createdAt: -1 });

    return relatedProducts.map(product => ({
      _id: product._id.toString(),
      title: product.title,
      price: product.price,
      description: product.description,
      image: product.image,
      category: product.category,
      isNew: product.isNew,
      isFeatured: product.isFeatured,
      discount: product.discount,
      createdAt: product.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
} 
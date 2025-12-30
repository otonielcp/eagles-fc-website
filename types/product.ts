export interface Product {
  _id: string;
  title: string;
  price: number;
  description: string;
  image: string;
  category: string;
  isNewProduct: boolean;
  isFeatured: boolean;
  discount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  title: string;
  price: number;
  description: string;
  image: string;
  category: string;
  isNewProduct: boolean;
  isFeatured: boolean;
  discount?: number;
}

export interface ImageUploadResponse {
  success: boolean;
  url?: string;
  message?: string;
} 
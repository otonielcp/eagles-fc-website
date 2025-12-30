import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  title: string;
  price: number;
  description: string;
  image: string;
  category: string;
  isNewProduct: boolean;
  isFeatured: boolean;
  discount?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a product title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please provide a product price"],
      min: [0, "Price must be a positive number"],
    },
    description: {
      type: String,
      required: [true, "Please provide a product description"],
      maxlength: [1000, "Description cannot be more than 1000 characters"],
    },
    image: {
      type: String,
      required: [true, "Please provide a product image"],
    },
    category: {
      type: String,
      required: [true, "Please provide a product category"],
      enum: ["Clothing", "Accessories", "Footwear", "Training Gear", "Souvenirs"],
    },
    isNewProduct: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    discount: {
      type: Number,
      min: [0, "Discount must be a positive number"],
    },
  },
  { timestamps: true }
);

// Check if model already exists to prevent overwriting during hot reloads
export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema); 
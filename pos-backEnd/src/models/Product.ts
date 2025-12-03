import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
  name: string;               
  hsn?: string;               
  code?: string;              
  barcode?: string;
  purchaseRate: number;
  retailRate: number;
  wholesaleRate?: number;
  unitPrimary?: string;
  unitSecondary?: string;
  conversionFactor?: number;
  discountAmount?: number;
  discountType?: "Percentage" | "Fixed";
  warehouse?: string;
  taxPercentage?: number;
  batchEnabled?: boolean;
  serialNumberEnabled?: boolean;
  openingStockEnabled?: boolean;
  purchaseTax?: "include" | "exclude";
  retailTax?: "include" | "exclude";
  wholesaleTax?: "include" | "exclude";
  category?: string;
  lowStock?: boolean;
  stock?: number;
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, index: true },
    hsn: { type: String },
    code: { type: String, index: true },
    barcode: { type: String, index: true },
    purchaseRate: { type: Number, required: true, default: 0 },
    retailRate: { type: Number, required: true, default: 0 },
    wholesaleRate: { type: Number },
    unitPrimary: { type: String },
    unitSecondary: { type: String },
    conversionFactor: { type: Number, default: 1 },
    discountAmount: { type: Number, default: 0 },
    discountType: { type: String, enum: ["Percentage", "Fixed"], default: "Percentage" },
    warehouse: { type: String },
    taxPercentage: { type: Number, default: 0 },
    batchEnabled: { type: Boolean, default: false },
    serialNumberEnabled: { type: Boolean, default: false },
    openingStockEnabled: { type: Boolean, default: false },
    purchaseTax: { type: String, enum: ["include", "exclude"], default: "exclude" },
    retailTax: { type: String, enum: ["include", "exclude"], default: "exclude" },
    wholesaleTax: { type: String, enum: ["include", "exclude"], default: "exclude" },
    category: { type: String, index: true },
    lowStock: { type: Boolean, default: false },
    stock: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>("Product", productSchema);

import Product, { IProduct } from "../models/Product";
import ApiError from "../utils/ApiError";
import mongoose from "mongoose";
import Category from "../models/Category";

export interface ProductQuery {
  page?: number;
  limit?: number;
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  isActive?: boolean;
}

export const createProduct = async (payload: any): Promise<IProduct> => {
  if (!payload.itemName) throw new ApiError(400, "itemName is required");
  if (payload.retailRate === undefined || payload.retailRate === null) throw new ApiError(400, "retailRate is required");
  if (!payload.category) throw new ApiError(400, "category is required");

  const catName = String(payload.category).trim();
  const existingCategory = await Category.findOne({ name: catName });
  if (!existingCategory) {
    try {
      await Category.create({ name: catName, description: "" });
    } catch (err) {
    }
  }

  const doc = await Product.create({
    name: payload.itemName,
    hsn: payload.itemHsn,
    code: payload.itemCode,
    barcode: payload.barcode,
    purchaseRate: payload.purchaseRate ?? 0,
    retailRate: payload.retailRate ?? 0,
    wholesaleRate: payload.wholesaleRate ?? 0,
    unitPrimary: payload.unitPrimary,
    unitSecondary: payload.unitSecondary,
    conversionFactor: payload.conversionFactor ?? 1,
    discountAmount: payload.discountAmount ?? 0,
    discountType: payload.discountType ?? "Percentage",
    warehouse: payload.warehouse,
    taxPercentage: payload.taxPercentage ?? 0,
    batchEnabled: payload.batchEnabled ?? false,
    serialNumberEnabled: payload.serialNumberEnabled ?? false,
    openingStockEnabled: payload.enabledOpeningStock ?? false,
    purchaseTax: payload.purchaseTax ?? "exclude",
    retailTax: payload.retailTax ?? "exclude",
    wholesaleTax: payload.wholesaleTax ?? "exclude",
    category: catName,
    stock: payload.stock ?? 0,
    lowStock: (payload.stock ?? 0) <= 0,
  });

  return doc;
};

export const listProducts = async (query: ProductQuery) => {
  const page = Math.max(query.page || 1, 1);
  const limit = Math.max(query.limit || 10, 1);
  const skip = (page - 1) * limit;

  const filter: any = {};
  if (query.q) {
    filter.$or = [
      { name: { $regex: query.q, $options: "i" } },
      { barcode: { $regex: query.q, $options: "i" } },
      { code: { $regex: query.q, $options: "i" } },
    ];
  }
  if (query.category) filter.category = query.category;
  if (typeof query.isActive === "boolean") filter.isActive = query.isActive;
  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    filter.retailRate = {};
    if (query.minPrice !== undefined) filter.retailRate.$gte = query.minPrice;
    if (query.maxPrice !== undefined) filter.retailRate.$lte = query.maxPrice;
  }

  let sort: any = { createdAt: -1 };
  if (query.sortBy) {
    const [field, dir] = String(query.sortBy).split(":");
    sort = { [field]: dir === "asc" ? 1 : -1 };
  }

  const [items, total] = await Promise.all([
    Product.find(filter).sort(sort).skip(skip).limit(limit),
    Product.countDocuments(filter),
  ]);

  return {
    items,
    total,
    page,
    pages: Math.ceil(total / limit),
    limit,
  };
};

export const getProductById = async (id: string): Promise<IProduct> => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new ApiError(400, "Invalid product id");
  const product = await Product.findById(id);
  if (!product) throw new ApiError(404, "Product not found");
  return product;
};

export const updateProduct = async (id: string, payload: Partial<IProduct>): Promise<IProduct> => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new ApiError(400, "Invalid product id");

  const update: any = {};

  // map incoming keys (we assume payload uses itemName, etc.)
  if ((payload as any).itemName !== undefined) update.name = (payload as any).itemName;
  if ((payload as any).itemHsn !== undefined) update.hsn = (payload as any).itemHsn;
  if ((payload as any).itemCode !== undefined) update.code = (payload as any).itemCode;
  if ((payload as any).barcode !== undefined) update.barcode = (payload as any).barcode;
  if ((payload as any).purchaseRate !== undefined) update.purchaseRate = (payload as any).purchaseRate;
  if ((payload as any).retailRate !== undefined) update.retailRate = (payload as any).retailRate;
  if ((payload as any).wholesaleRate !== undefined) update.wholesaleRate = (payload as any).wholesaleRate;
  if ((payload as any).unitPrimary !== undefined) update.unitPrimary = (payload as any).unitPrimary;
  if ((payload as any).unitSecondary !== undefined) update.unitSecondary = (payload as any).unitSecondary;
  if ((payload as any).conversionFactor !== undefined) update.conversionFactor = (payload as any).conversionFactor;
  if ((payload as any).discountAmount !== undefined) update.discountAmount = (payload as any).discountAmount;
  if ((payload as any).discountType !== undefined) update.discountType = (payload as any).discountType;
  if ((payload as any).warehouse !== undefined) update.warehouse = (payload as any).warehouse;
  if ((payload as any).taxPercentage !== undefined) update.taxPercentage = (payload as any).taxPercentage;
  if ((payload as any).batchEnabled !== undefined) update.batchEnabled = (payload as any).batchEnabled;
  if ((payload as any).serialNumberEnabled !== undefined) update.serialNumberEnabled = (payload as any).serialNumberEnabled;
  if ((payload as any).enabledOpeningStock !== undefined) update.openingStockEnabled = (payload as any).enabledOpeningStock;
  if ((payload as any).purchaseTax !== undefined) update.purchaseTax = (payload as any).purchaseTax;
  if ((payload as any).retailTax !== undefined) update.retailTax = (payload as any).retailTax;
  if ((payload as any).wholesaleTax !== undefined) update.wholesaleTax = (payload as any).wholesaleTax;
  if ((payload as any).category !== undefined) update.category = (payload as any).category;
  if ((payload as any).stock !== undefined) {
    update.stock = (payload as any).stock;
    update.lowStock = Number((payload as any).stock) <= 0;
  }

  const product = await Product.findByIdAndUpdate(id, update, { new: true, runValidators: true });
  if (!product) throw new ApiError(404, "Product not found");
  return product;
};

export const deleteProduct = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ApiError(400, "Invalid product id");

  const deleted = await Product.findByIdAndDelete(id);
  if (!deleted) throw new ApiError(404, "Product not found");

  return deleted;
};



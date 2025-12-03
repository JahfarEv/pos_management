import { Request, Response, NextFunction } from "express";
import * as productService from "../services/product.service";
import { pick } from "../utils/pick";

const ALLOWED = [
  "itemName","itemHsn","itemCode","barcode",
  "purchaseRate","retailRate","wholesaleRate",
  "unitPrimary","unitSecondary","conversionFactor",
  "discountAmount","discountType","warehouse",
  "taxPercentage","batchEnabled","serialNumberEnabled",
  "enabledOpeningStock","purchaseTax","retailTax","wholesaleTax",
  "category","stock"
];

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const safeBody = pick(req.body, ALLOWED);
    const product = await productService.createProduct(safeBody);
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = {
      page: req.query.page ? parseInt(String(req.query.page), 10) : undefined,
      limit: req.query.limit ? parseInt(String(req.query.limit), 10) : undefined,
      q: req.query.q ? String(req.query.q) : undefined,
      category: req.query.category ? String(req.query.category) : undefined,
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      sortBy: req.query.sortBy ? String(req.query.sortBy) : undefined,
      isActive: req.query.isActive !== undefined ? req.query.isActive === "true" : undefined,
    };

    const result = await productService.listProducts(query);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const safeBody = pick(req.body, ALLOWED);
    const product = await productService.updateProduct(req.params.id, safeBody as any);
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deletedProduct = await productService.deleteProduct(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: deletedProduct,
    });
  } catch (err) {
    next(err);
  }
};

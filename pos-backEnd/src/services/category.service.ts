import Category, { ICategory } from "../models/Category";
import Product from "../models/Product";
import ApiError from "../utils/ApiError";
import { FilterQuery } from "mongoose";
import { CategoryQuery, FindByCategorySlugOpts } from "../types/categoryTypes";

export const createCategory = async (
  payload: Partial<ICategory>
): Promise<ICategory> => {
  const exists = await Category.findOne({ name: payload.name });
  if (exists) throw new ApiError(400, "Category with this name already exists");
  const category = await Category.create(payload);
  return category;
};

export const getCategoryById = async (id: string): Promise<ICategory> => {
  const category = await Category.findById(id);
  if (!category) throw new ApiError(404, "Category not found");
  return category;
};

export const findProductsByCategorySlug = async (
  opts: FindByCategorySlugOpts
) => {
  const page = Math.max(opts.page || 1, 1);
  const limit = Math.max(Math.min(opts.limit ?? 25, 100), 1);
  const skip = (page - 1) * limit;

  const sort = opts.sort ?? { name: 1 };
  const includeInactive = !!opts.includeInactive;

  const slug = String(opts.slug || "").toLowerCase();

  // =====================================
  //  SPECIAL CASE: "all" – return all products
  // =====================================
  if (slug === "all") {
    const filter: FilterQuery<any> = {};

    if (!includeInactive) {
      filter.isActive = true;
    }

    const [total, data] = await Promise.all([
      Product.countDocuments(filter),
      Product.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    ]);

    return {
      meta: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      data,
    };
  }

  // =====================================
  // NORMAL CATEGORY LOOKUP
  // =====================================
  const category = await Category.findOne({ slug }).lean();
  if (!category) throw new ApiError(404, "Category not found");

  const categoryFilter: FilterQuery<any> = {
    $or: [
      { category: category._id },
      { category: new RegExp(`^${escapeRegExp(category.name)}$`, "i") },
      { category: String(category.slug) },
    ],
  };

  if (!includeInactive) {
    categoryFilter.isActive = true;
  }

  const [total, data] = await Promise.all([
    Product.countDocuments(categoryFilter),
    Product.find(categoryFilter).sort(sort).skip(skip).limit(limit).lean(),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
    data,
  };
};

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export const updateCategory = async (
  id: string,
  payload: Partial<ICategory>
): Promise<ICategory> => {
  const category = await Category.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  if (!category) throw new ApiError(404, "Category not found");
  return category;
};

// Soft delete: set isActive = false
export const deleteCategory = async (id: string): Promise<void> => {
  const res = await Category.findByIdAndUpdate(id, { isActive: false });
  if (!res) throw new ApiError(404, "Category not found");
};

export const listCategories = async (query: CategoryQuery) => {
  const page = Math.max(query.page || 1, 1);
  const limit = Math.max(query.limit || 10, 1);
  const skip = (page - 1) * limit;

  const filter: any = {};
  if (query.q) {
    filter.$or = [
      { name: { $regex: query.q, $options: "i" } },
      { description: { $regex: query.q, $options: "i" } },
    ];
  }
  if (typeof query.isActive === "boolean") filter.isActive = query.isActive;

  const [items, total] = await Promise.all([
    Category.find(filter).sort({ name: 1 }).skip(skip).limit(limit),
    Category.countDocuments(filter),
  ]);

  return {
    items,
    total,
    page,
    pages: Math.ceil(total / limit),
    limit,
  };
};

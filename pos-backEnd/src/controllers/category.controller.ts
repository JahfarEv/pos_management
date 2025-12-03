import { Request, Response, NextFunction } from "express";
import * as categoryService from "../services/category.service";

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;
    const category = await categoryService.createCategory(payload);
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    res.json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};
export const getProductsByCategorySlug = async (
  req: Request,
  res: Response
) => {
  try {
    const slug = String(req.params.slug || "");
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 25);
    const sortBy = String(req.query.sortBy || "name");
    const sortDir = String(req.query.sortDir || "asc") === "desc" ? -1 : 1;
    const includeInactive = req.query.includeInactive === "true";

    const result = await categoryService.findProductsByCategorySlug({
      slug,
      page,
      limit,
      sort: { [sortBy]: sortDir },
      includeInactive,
    });

    return res.json(result);
  } catch (err: any) {
    const status = err?.status || 500;
    return res.status(status).json({
      message: err?.message || "Internal server error",
    });
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const category = await categoryService.updateCategory(
      req.params.id,
      req.body
    );
    res.json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await categoryService.deleteCategory(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = {
      page: req.query.page ? parseInt(String(req.query.page), 10) : undefined,
      limit: req.query.limit
        ? parseInt(String(req.query.limit), 10)
        : undefined,
      q: req.query.q ? String(req.query.q) : undefined,
      isActive:
        req.query.isActive !== undefined
          ? req.query.isActive === "true"
          : undefined,
    };
    const result = await categoryService.listCategories(query);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

import { Request, Response, NextFunction } from "express";
import * as cartService from "../services/cart.service";
import ApiError from "../utils/ApiError";

const getUserIdFromReq = (req: Request) => {
  const maybeUser = (req as any).user;
  if (maybeUser && maybeUser.id) return String(maybeUser.id);

  if (req.query && req.query.userId) return String(req.query.userId);

  if (req.params && (req.params as any).userId) return String((req.params as any).userId);

  if (req.body && (req.body as any).userId) return String((req.body as any).userId);

  throw new ApiError(401, "Missing user id");
};


export const getCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserIdFromReq(req);
    const cart = await cartService.getCartByUser(userId);
    res.json({ success: true, data: cart || { items: [], total: 0 } });
  } catch (err) {
    next(err);
  }
};

export const addItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserIdFromReq(req);
    const { productId, quantity } = req.body;
    if (!productId) throw new ApiError(400, "productId is required");
    const cart = await cartService.addItemToCart(userId, String(productId), quantity ?? 1);
    res.status(200).json({ success: true, data: cart });
  } catch (err) {
    next(err);
  }
};

export const updateItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserIdFromReq(req);
    const { productId, quantity } = req.body;
    if (!productId) throw new ApiError(400, "productId is required");
    if (quantity === undefined || quantity === null) throw new ApiError(400, "quantity is required");
    const cart = await cartService.updateItemQuantity(userId, String(productId), Number(quantity));
    res.json({ success: true, data: cart });
  } catch (err) {
    next(err);
  }
};

export const removeItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserIdFromReq(req);
    const { productId } = req.params;
    if (!productId) throw new ApiError(400, "productId is required");
    const cart = await cartService.removeItem(userId, String(productId));
    res.json({ success: true, data: cart });
  } catch (err) {
    next(err);
  }
};

export const clear = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserIdFromReq(req);
    const cart = await cartService.clearCart(userId);
    res.status(200).json({ success: true, data: cart });
  } catch (err) {
    next(err);
  }
};



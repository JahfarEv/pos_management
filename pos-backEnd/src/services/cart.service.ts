import mongoose from "mongoose";
import Cart, { ICartItem } from "../models/Cart";
import Product from "../models/Product";
import ApiError from "../utils/ApiError";



  // =====================================
  //  cart  by user
  // =====================================


export const getCartByUser = async (userId: string) => {
  const cart = await Cart.findOne({ user: userId }).populate("items.product");
  return cart;
};

// =====================================
  //  add to cart
  // =====================================

export const createOrGetCart = async (userId: string) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [], total: 0 });
  }
  return cart;
};

const recalcCartTotals = (cart: any) => {
  let total = 0;
  cart.items.forEach((it: any) => {
    it.subtotal = Number(it.price) * Number(it.quantity);
    total += it.subtotal;
  });
  cart.total = total;
};
export const addItemToCart = async (
  userId: string,
  productId: string,
  quantity = 1,
  options: { allowOutOfStock?: boolean } = {}
) => {
  console.log(
    "[cartService.addItemToCart] userId:",
    userId,
    "productId:",
    productId,
    "quantity:",
    quantity
  );

  if (quantity <= 0) throw new ApiError(400, "Quantity must be at least 1");

  const product = await Product.findById(productId);
  console.log(
    "[cartService.addItemToCart] product found:",
    !!product,
    product && {
      id: product._id,
      name: product.name,
      retailRate: product.retailRate,
      stock: product.stock,
    }
  );
  if (!product) throw new ApiError(404, "Product not found");

  if (
    !options.allowOutOfStock &&
    (product.stock === undefined || Number(product.stock) <= 0)
  ) {
    throw new ApiError(400, `Product "${product.name}" is out of stock`);
  }

  const cart = await createOrGetCart(userId);

  const existing = cart.items.find(
    (i: ICartItem) => String(i.product) === String(product._id)
  );
  if (existing) {
    const newQty = Number(existing.quantity) + Number(quantity);

    if (
      !options.allowOutOfStock &&
      product.stock !== undefined &&
      newQty > Number(product.stock)
    ) {
      throw new ApiError(
        400,
        `Insufficient stock for product "${product.name}". Available: ${product.stock}`
      );
    }

    existing.quantity = newQty;
    existing.price = Number(product.retailRate);
    existing.subtotal = existing.quantity * existing.price;
  } else {
    // if requested quantity exceeds stock
    if (
      !options.allowOutOfStock &&
      product.stock !== undefined &&
      Number(quantity) > Number(product.stock)
    ) {
      throw new ApiError(
        400,
        `Insufficient stock for product "${product.name}". Available: ${product.stock}`
      );
    }

    cart.items.push({
      product: product._id,
      name: product.name,
      price: Number(product.retailRate),
      quantity: Number(quantity),
      subtotal: Number(product.retailRate) * Number(quantity),
    } as ICartItem);
  }

  recalcCartTotals(cart);
  await cart.save();

  const populated = await Cart.findById(cart._id).populate("items.product");
  console.log(
    "[cartService.addItemToCart] saved cart items:",
    populated?.items?.length ?? 0
  );
  return populated;
};


// =====================================
  //  Update cart quantity
  // =====================================

export const updateItemQuantity = async (
  userId: string,
  productId: string,
  quantity: number,
  options: { allowOutOfStock?: boolean } = {}
) => {
  if (quantity < 0) throw new ApiError(400, "Quantity must be >= 0");

  const cart = await createOrGetCart(userId);
  const idx = cart.items.findIndex(
    (i: any) => String(i.product) === String(productId)
  );
  if (idx === -1) throw new ApiError(404, "Item not found in cart");

  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, "Product not found");

  if (quantity === 0) {
    cart.items.splice(idx, 1);
  } else {
    if (
      !options.allowOutOfStock &&
      product.stock !== undefined &&
      Number(quantity) > Number(product.stock)
    ) {
      throw new ApiError(
        400,
        `Insufficient stock for product "${product.name}". Available: ${product.stock}`
      );
    }
    cart.items[idx].quantity = Number(quantity);
    cart.items[idx].price = Number(product.retailRate);
    cart.items[idx].subtotal = cart.items[idx].quantity * cart.items[idx].price;
  }

  recalcCartTotals(cart);
  await cart.save();
  return cart;
};

// =====================================
  //  Remove specific item 
  // =====================================

export const removeItem = async (userId: string, productId: string) => {
  const cart = await createOrGetCart(userId);
  const before = cart.items.length;
  cart.items = cart.items.filter(
    (i: any) => String(i.product) !== String(productId)
  );
  if (cart.items.length === before)
    throw new ApiError(404, "Item not found in cart");
  recalcCartTotals(cart);
  await cart.save();
  return cart;
};


// =====================================
  //  Remove all items
  // =====================================

export const clearCart = async (userId: string) => {
  const cart = await Cart.findOneAndUpdate(
    { user: userId },
    { items: [], total: 0 },
    { new: true, upsert: true }
  );
  return cart;
};

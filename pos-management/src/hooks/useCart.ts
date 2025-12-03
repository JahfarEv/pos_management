import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchCart,
  removeItem,
  updateItemQuantity,
  clearCart,
  addItem,
} from "../store/slices/cartSlice";
import { toast } from "sonner";
import type { AuthUser } from "../store/slices/authSlice";
import type { CartItem } from "../types/cart";

interface UseCartReturn {
  cart: CartItem[];
  addToCart: (
    productId: string,
    quantity?: number,
    productName?: string
  ) => Promise<boolean>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  loading: boolean;
  total: number;
  totalQty: number;
  error?: string | null;
}

export const useCart = (): UseCartReturn => {
  const dispatch = useAppDispatch();

  const cartState = useAppSelector((state) => state.cart);
  const user = useAppSelector((state) => state.auth.user) as AuthUser | null;

  const totalQty = cartState.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  // Add to cart function
  const addToCart = useCallback(
    async (
      productId: string,
      quantity: number = 1,
      productName?: string
    ): Promise<boolean> => {
      if (!user?._id) {
        toast.error("Please login to add items to cart");
        return false;
      }

      try {
        const result = await dispatch(
          addItem({
            userId: user._id,
            productId,
            quantity,
          })
        ).unwrap();
        console.log(result);

        toast.success(`${productName || "Product"} added to cart!`);
        return true;
      } catch (error: any) {
        // Handle stock error specifically
        const errorMessage = error?.message || "Failed to add to cart";

        if (
          errorMessage.includes("out of stock") ||
          errorMessage.includes("stock")
        ) {
          toast.error(errorMessage, {
            duration: 5000,
            icon: "⚠️",
            action: {
              label: "OK",
              onClick: () => {},
            },
          });
        } else {
          toast.error(errorMessage);
        }
        return false;
      }
    },
    [dispatch, user]
  );

  // Function to manually refresh cart
  const refreshCart = useCallback(async () => {
    if (!user?._id) {
      toast.error("Please login to refresh cart");
      return;
    }

    try {
      await dispatch(fetchCart({ userId: user._id })).unwrap();
      toast.success("Cart refreshed");
    } catch (error: any) {
      toast.error(error?.message || "Failed to refresh cart");
    }
  }, [dispatch, user]);

  const removeFromCart = useCallback(
    async (productId: string) => {
      if (!user?._id) {
        toast.error("Please login to manage cart");
        return;
      }

      try {
        await dispatch(
          removeItem({
            userId: user._id,
            productId,
          })
        ).unwrap();
        toast.success("Item removed from cart");
      } catch (error: any) {
        toast.error(error?.message || "Failed to remove item");
      }
    },
    [dispatch, user]
  );

  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      if (!user?._id) {
        toast.error("Please login to update cart");
        return;
      }

      if (quantity < 1) {
        await removeFromCart(productId);
        return;
      }

      try {
        await dispatch(
          updateItemQuantity({
            userId: user._id,
            productId,
            quantity,
          })
        ).unwrap();
      } catch (error: any) {
        toast.error(error?.message || "Failed to update quantity");
      }
    },
    [dispatch, user, removeFromCart]
  );

  const clearCartFn = useCallback(async () => {
    if (!user?._id) {
      toast.error("Please login to clear cart");
      return;
    }

    try {
      await dispatch(clearCart({ userId: user._id })).unwrap();
      toast.success("Cart cleared");
    } catch (error: any) {
      toast.error(error?.message || "Failed to clear cart");
    }
  }, [dispatch, user]);

  return {
    cart: cartState.items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart: clearCartFn,
    refreshCart,
    loading: cartState.loading,
    total: cartState.total,
    totalQty,
    error: cartState.error,
  };
};

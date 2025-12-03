import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchCart } from "../store/slices/cartSlice";

interface CartInitializerProps {
  children: React.ReactNode;
}

export const CartInitializer: React.FC<CartInitializerProps> = ({
  children,
}) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    const initializeCart = async () => {
      if (user?._id) {
        try {
          await dispatch(fetchCart({ userId: user._id })).unwrap();
        } catch (error) {
          console.error("Failed to initialize cart:", error);
        }
      }
    };

    initializeCart();
  }, [dispatch, user?._id]);

  return <>{children}</>;
};

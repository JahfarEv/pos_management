// hooks/useCartActions.ts
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/hooks';
import { addItem, fetchCart } from '../store/slices/cartSlice';
import { useAuth } from './useAuth'; // Assuming you have an auth hook

export const useCartActions = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth(); // Get current user
  const { loading } = useSelector((state: RootState) => state.cart);

  const addToCart = useCallback(async (productId: string, quantity: number = 1) => {
    if (!user?.id) {
      console.error('User not authenticated');
      return;
    }

    try {
      await dispatch(addItem({ 
        userId: user.id, 
        productId, 
        quantity 
      })).unwrap();
      
      // Refresh cart data
      await dispatch(fetchCart({ userId: user.id }));
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  }, [dispatch, user?.id]);

  return {
    addToCart,
    loading
  };
};
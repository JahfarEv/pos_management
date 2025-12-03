import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../store/slices/productsSlice";

const useProducts = (autoLoad = true) => {
  const dispatch = useAppDispatch();
  const products = useAppSelector((s) => s.products.products);
  const filteredProducts = useAppSelector((s) => s.products.filteredProducts);
  const loading = useAppSelector((s) => s.products.loading);
  const categories = useAppSelector((s) => s.products.categories);

  useEffect(() => {
    if (autoLoad) {
      dispatch(fetchProducts({}));
    }
  }, [autoLoad, dispatch]);

  const reload = useCallback(
    (params?: { search?: string; category?: string }) => {
      return dispatch(fetchProducts(params ? params : undefined));
    },
    [dispatch]
  );

  const create = useCallback(
    (payload: Record<string, any>) => dispatch(createProduct(payload)),
    [dispatch]
  );

  const update = useCallback(
    (id: string, payload: Record<string, any>) =>
      dispatch(updateProduct({ id, payload })),
    [dispatch]
  );

  const remove = useCallback(
    (id: string) => dispatch(deleteProduct(id)),
    [dispatch]
  );

  return {
    products,
    filteredProducts,
    categories,
    loading,
    // actions
    reload,
    create,
    update,
    remove,
    dispatch,
  };
};

export default useProducts;

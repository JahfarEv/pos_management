// import { useCallback, useEffect } from "react";
// import { useAppDispatch, useAppSelector } from "../store/hooks";
// import {
//   fetchProducts,
//   createProduct,
//   updateProduct,
//   deleteProduct,
// } from "../store/slices/productsSlice";

// const useProducts = (autoLoad = true) => {
//   const dispatch = useAppDispatch();
//   const products = useAppSelector((s) => s.products.products);
//   const filteredProducts = useAppSelector((s) => s.products.filteredProducts);
  
//   const loading = useAppSelector((s) => s.products.loading);
//   const categories = useAppSelector((s) => s.products.categories);

//   useEffect(() => {
//     if (autoLoad) {
//       dispatch(fetchProducts({}));
//     }
//   }, [autoLoad, dispatch]);

//   const reload = useCallback(
//     (params?: { search?: string; category?: string }) => {
//       return dispatch(fetchProducts(params ? params : undefined));
//     },
//     [dispatch]
//   );

//   const create = useCallback(
//     (payload: Record<string, any>) => dispatch(createProduct(payload)),
//     [dispatch]
//   );

//   const update = useCallback(
//     (id: string, payload: Record<string, any>) =>
//       dispatch(updateProduct({ id, payload })),
//     [dispatch]
//   );

//   const remove = useCallback(
//     (id: string) => dispatch(deleteProduct(id)),
//     [dispatch]
//   );

//   return {
//     products,
//     filteredProducts,
//     categories,
//     loading,
//     reload,
//     create,
//     update,
//     remove,
//     dispatch,
//   };
// };

// export default useProducts;






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
  const pagination = useAppSelector((s) => s.products.pagination);

  useEffect(() => {
    if (autoLoad) {
      dispatch(fetchProducts({ page: 1, limit: 6 }));
    }
  }, [autoLoad, dispatch]);

  const reload = useCallback(
    (params?: { 
      q?: string;  
      category?: string;
      page?: number;
      limit?: number;
    }) => {
      const defaultParams = { page: 1, limit: 6 };
      return dispatch(fetchProducts({ ...defaultParams, ...params }));
    },
    [dispatch]
  );

  const handlePageChange = useCallback((page: number) => {
    const currentLimit = pagination?.limit || 6;
    
    
    reload({ 
      page, 
      limit: currentLimit,
      // Add search and category filters if they exist
    });
  }, [reload, pagination]);

  const setItemsPerPage = useCallback((itemsPerPage: number) => {
    reload({ 
      page: 1, 
      limit: itemsPerPage,
      // Preserve other filters
    });
  }, [reload]);

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
    pagination,
    reload,
    create,
    update,
    remove,
    handlePageChange,
    setItemsPerPage,
    dispatch,
  };
};

export default useProducts;

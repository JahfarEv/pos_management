// // hooks/useCategories.ts
// import { useCallback, useEffect, useRef, useState } from "react";
// import { useAppDispatch, useAppSelector } from "../store/hooks";
// import {
//   fetchCategories,
//   setSelectedCategoryId,
//   fetchProductsByCategorySlug,
//   createCategory,
//   addCategory as addCategoryLocal,
//   selectAllCategories,
//   selectCategoryNames,
//   selectSelectedCategoryId,
//   selectProductsBucket,
//   selectSelectedCategory,
//   selectCategoryLoading,
//   selectCategoryError,
//   selectCategoriesPagination,
//   updateCategoriesPagination,
//   resetCategoriesPagination,
// } from "../store/slices/categorySlice";

// export const useCategories = () => {
//   const dispatch = useAppDispatch();
//   const [loadingMore, setLoadingMore] = useState(false);
//   const lastLoadTimeRef = useRef<number>(0);

//   // Selectors (same as before)
//   const categories = useAppSelector(selectAllCategories);
//   const categoriesNames = useAppSelector(selectCategoryNames);
//   const selectedCategoryId = useAppSelector(selectSelectedCategoryId);
//   const selectedCategory = useAppSelector(selectSelectedCategory);
//   const categoryLoading = useAppSelector(selectCategoryLoading);
//   const categoryError = useAppSelector(selectCategoryError);
//   const categoriesPagination = useAppSelector(selectCategoriesPagination);

//   // ------------------------------------------------------------------
//   // INITIAL LOAD CATEGORIES - PAGE 1 ONLY
//   // ------------------------------------------------------------------
//   useEffect(() => {
//     console.log("Initial load - fetching page 1");
//     dispatch(
//       fetchCategories({
//         page: 1,
//         limit: 13,
//         isLoadMore: false,
//       })
//     );
//   }, [dispatch]);

//   // ------------------------------------------------------------------
//   // LOAD MORE CATEGORIES (INFINITE SCROLL) with debouncing
//   // ------------------------------------------------------------------
//   // In useCategories.ts
//   const loadMoreCategories = useCallback(() => {
//     const now = Date.now();
//     const minDelay = 1000; // Minimum 1 second between calls

//     // Prevent too frequent calls
//     if (now - lastLoadTimeRef.current < minDelay) {
//       console.log("Too soon to load more, skipping...");
//       return Promise.resolve();
//     }

//     console.log("loadMoreCategories called", {
//       currentPage: categoriesPagination.page,
//       totalPages: categoriesPagination.pages,
//       hasMore: categoriesPagination.page < categoriesPagination.pages,
//       loading: categoryLoading,
//       loadingMore: loadingMore,
//     });

//     if (
//       !categoryLoading &&
//       !loadingMore &&
//       categoriesPagination.page < categoriesPagination.pages
//     ) {
//       console.log("Loading page", categoriesPagination.page + 1);
//       lastLoadTimeRef.current = now;
//       setLoadingMore(true);
//       return dispatch(
//         fetchCategories({
//           page: categoriesPagination.page + 1,
//           limit: 14,
//           isLoadMore: true,
//         })
//       ).finally(() => {
//         setLoadingMore(false);
//         lastLoadTimeRef.current = Date.now(); // Update after successful call
//       });
//     }

//     return Promise.resolve();
//   }, [dispatch, categoryLoading, loadingMore, categoriesPagination]);

//   // ------------------------------------------------------------------
//   // CHECK IF HAS MORE CATEGORIES
//   // ------------------------------------------------------------------
//   const hasMoreCategories = useCallback(() => {
//     const hasMore = categoriesPagination.page < categoriesPagination.pages;
//     return hasMore;
//   }, [categoriesPagination]);

//   // ------------------------------------------------------------------
//   // SEARCH CATEGORIES (resets infinite scroll)
//   // ------------------------------------------------------------------
//   const searchCategories = useCallback(
//     (searchTerm: string) => {
//       dispatch(
//         fetchCategories({
//           page: 1,
//           limit: 13,
//           search: searchTerm,
//         })
//       );
//     },
//     [dispatch]
//   );

//   // ------------------------------------------------------------------
//   // LOAD PRODUCTS FOR A CATEGORY WITH PAGINATION
//   // ------------------------------------------------------------------
//   const loadProductsByCategorySlug = useCallback(
//     (
//       slug: string,
//       params?: {
//         search?: string;
//         page?: number;
//         limit?: number;
//       }
//     ) => {
//       return dispatch(
//         fetchProductsByCategorySlug({
//           slug,
//           params: {
//             page: params?.page || 1,
//             limit: params?.limit || 12,
//             search: params?.search,
//           },
//         })
//       );
//     },
//     [dispatch]
//   );

//   // ------------------------------------------------------------------
//   // SET CURRENT SELECTED CATEGORY
//   // ------------------------------------------------------------------
//   const setCategory = useCallback(
//     (value: string) => {
//       dispatch(setSelectedCategoryId(value));
//     },
//     [dispatch]
//   );

//   // ------------------------------------------------------------------
//   // CREATE CATEGORY ON SERVER
//   // ------------------------------------------------------------------
//   const createCategoryOnServer = useCallback(
//     (name: string, description?: string) => {
//       return dispatch(createCategory({ name, description }));
//     },
//     [dispatch]
//   );

//   // ------------------------------------------------------------------
//   // ADD CATEGORY LOCALLY
//   // ------------------------------------------------------------------
//   const addCategory = useCallback(
//     (name: string) => {
//       dispatch(addCategoryLocal(name));
//     },
//     [dispatch]
//   );

//   // ------------------------------------------------------------------
//   // UPDATE CATEGORIES PAGINATION
//   // ------------------------------------------------------------------
//   const updatePagination = useCallback(
//     (
//       pagination: Partial<{
//         page: number;
//         limit: number;
//         total: number;
//         pages: number;
//       }>
//     ) => {
//       dispatch(updateCategoriesPagination(pagination));
//     },
//     [dispatch]
//   );

//   // ------------------------------------------------------------------
//   // RESET CATEGORIES PAGINATION
//   // ------------------------------------------------------------------
//   const resetPagination = useCallback(() => {
//     dispatch(resetCategoriesPagination());
//   }, [dispatch]);

//   // ------------------------------------------------------------------
//   // GET PRODUCT BUCKET FOR A CATEGORY
//   // ------------------------------------------------------------------
//   const getProductsBucket = useCallback((slug: string) => {
//     const bucketSelector = selectProductsBucket(slug);
//     return useAppSelector(bucketSelector);
//   }, []);

//   // ------------------------------------------------------------------
//   // CATEGORY FINDER HELPERS
//   // ------------------------------------------------------------------
//   const getCategoryByName = useCallback(
//     (name: string) => categories.find((c) => c.name === name),
//     [categories]
//   );

//   const getCategoryBySlug = useCallback(
//     (slug: string) => categories.find((c) => c.slug === slug),
//     [categories]
//   );

//   const getCategoryById = useCallback(
//     (id: string) => categories.find((c) => c.id === id || c._id === id),
//     [categories]
//   );

//   // ------------------------------------------------------------------
//   // PAGINATION HELPERS FOR CATEGORY PRODUCTS
//   // ------------------------------------------------------------------
//   const goToProductsPage = useCallback(
//     (slug: string, page: number) => {
//       loadProductsByCategorySlug(slug, { page });
//     },
//     [loadProductsByCategorySlug]
//   );

//   const loadNextProductsPage = useCallback(
//     (slug: string) => {
//       const bucket = getProductsBucket(slug);
//       const currentPage = bucket.pagination?.page || 1;
//       const totalPages = bucket.pagination?.pages || 1;

//       if (currentPage < totalPages) {
//         goToProductsPage(slug, currentPage + 1);
//       }
//     },
//     [getProductsBucket, goToProductsPage]
//   );

//   const loadPreviousProductsPage = useCallback(
//     (slug: string) => {
//       const bucket = getProductsBucket(slug);
//       const currentPage = bucket.pagination?.page || 1;

//       if (currentPage > 1) {
//         goToProductsPage(slug, currentPage - 1);
//       }
//     },
//     [getProductsBucket, goToProductsPage]
//   );

//   // ------------------------------------------------------------------
//   // RETURN FINAL API
//   // ------------------------------------------------------------------
//   return {
//     // State
//     categories,
//     categoriesNames,
//     selectedCategoryId,
//     selectedCategory,
//     categoriesPagination,
//     categoryLoading,
//     categoryError,
//     loadingMore, // Add loadingMore state

//     // Infinite Scroll Actions
//     loadMoreCategories,
//     hasMoreCategories,
//     searchCategories,
//     updatePagination,
//     resetPagination,

//     // Category Selection Actions
//     setCategory,
//     createCategoryOnServer,
//     addCategory,

//     // Category Products Actions
//     loadProductsByCategorySlug,
//     goToProductsPage,
//     loadNextProductsPage,
//     loadPreviousProductsPage,

//     // Helpers
//     getCategoryByName,
//     getCategoryBySlug,
//     getCategoryById,
//     getProductsBucket,
//   };
// };

// export default useCategories;








// hooks/useCategories.ts
import { useCallback, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchCategories,
  setSelectedCategoryId,
  fetchProductsByCategorySlug,
  createCategory,
  addCategory as addCategoryLocal,
  selectAllCategories,
  selectCategoryNames,
  selectSelectedCategoryId,
  selectProductsBucket,
  selectSelectedCategory,
  selectCategoryLoading,
  selectCategoryError,
  selectCategoriesPagination,
  updateCategoriesPagination,
  resetCategoriesPagination,
} from "../store/slices/categorySlice";

export const useCategories = () => {
  const dispatch = useAppDispatch();
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingMoreProducts, setLoadingMoreProducts] = useState<string | null>(null);
  const lastLoadTimeRef = useRef<number>(0);
  const productLoadTimeRef = useRef<Record<string, number>>({});

  // Selectors
  const categories = useAppSelector(selectAllCategories);
  const categoriesNames = useAppSelector(selectCategoryNames);
  const selectedCategoryId = useAppSelector(selectSelectedCategoryId);
  const selectedCategory = useAppSelector(selectSelectedCategory);
  const categoryLoading = useAppSelector(selectCategoryLoading);
  const categoryError = useAppSelector(selectCategoryError);
  const categoriesPagination = useAppSelector(selectCategoriesPagination);
  
  // ✅ Get ALL product buckets at the component level
  const productsBuckets = useAppSelector((state) => state.categories?.productsBuckets || {});

  // ------------------------------------------------------------------
  // INITIAL LOAD CATEGORIES - PAGE 1 ONLY
  // ------------------------------------------------------------------
  useEffect(() => {
    console.log("Initial load - fetching page 1");
    dispatch(
      fetchCategories({
        page: 1,
        limit: 13,
        isLoadMore: false,
      })
    );
  }, [dispatch]);


const getProductsPagination = useCallback((slug: string) => {
  const bucket = productsBuckets[slug];
  
  if (!bucket) {
    return {
      currentPage: 1,
      totalPages: 1,
      totalProducts: 0,
      loadedProducts: 0,
      hasMore: false,
      limit: 12,
    };
  }
  
  return {
    currentPage: bucket.pagination?.page || 1,
    totalPages: bucket.pagination?.pages || 1,
    totalProducts: bucket.pagination?.total || 0,
    loadedProducts: bucket.data?.length || 0,
    hasMore: (bucket.pagination?.page || 1) < (bucket.pagination?.pages || 1),
    limit: bucket.pagination?.limit || 12,
  };
}, [productsBuckets]);

  // ------------------------------------------------------------------
  // LOAD MORE CATEGORIES (INFINITE SCROLL) with debouncing
  // ------------------------------------------------------------------
  const loadMoreCategories = useCallback(() => {
    const now = Date.now();
    const minDelay = 1000;

    if (now - lastLoadTimeRef.current < minDelay) {
      console.log("Too soon to load more, skipping...");
      return Promise.resolve();
    }

    console.log("loadMoreCategories called", {
      currentPage: categoriesPagination.page,
      totalPages: categoriesPagination.pages,
      hasMore: categoriesPagination.page < categoriesPagination.pages,
      loading: categoryLoading,
      loadingMore: loadingMore,
    });

    if (
      !categoryLoading &&
      !loadingMore &&
      categoriesPagination.page < categoriesPagination.pages
    ) {
      console.log("Loading page", categoriesPagination.page + 1);
      lastLoadTimeRef.current = now;
      setLoadingMore(true);
      return dispatch(
        fetchCategories({
          page: categoriesPagination.page + 1,
          limit: 14,
          isLoadMore: true,
        })
      ).finally(() => {
        setLoadingMore(false);
        lastLoadTimeRef.current = Date.now();
      });
    }

    return Promise.resolve();
  }, [dispatch, categoryLoading, loadingMore, categoriesPagination]);

  // ------------------------------------------------------------------
  // CHECK IF HAS MORE CATEGORIES
  // ------------------------------------------------------------------
  const hasMoreCategories = useCallback(() => {
    const hasMore = categoriesPagination.page < categoriesPagination.pages;
    return hasMore;
  }, [categoriesPagination]);

  // ------------------------------------------------------------------
  // LOAD MORE PRODUCTS FOR A CATEGORY (INFINITE SCROLL)
  // ------------------------------------------------------------------
  const loadMoreProductsByCategorySlug = useCallback((slug: string) => {
    const now = Date.now();
    const minDelay = 800;
    
    // ✅ Get bucket from the productsBuckets state (not using hook inside callback)
    const bucket = productsBuckets[slug] || {};
    
    const lastLoadTime = productLoadTimeRef.current[slug] || 0;
    
    if (now - lastLoadTime < minDelay) {
      console.log(`Too soon to load more products for ${slug}, skipping...`);
      return Promise.resolve();
    }
    
    const currentPage = bucket?.pagination?.page || 1;
    const totalPages = bucket?.pagination?.pages || 1;
    const isLoading = bucket?.loading || false;
    
    console.log(`loadMoreProducts for ${slug}:`, {
      currentPage,
      totalPages,
      hasMore: currentPage < totalPages,
      loading: isLoading,
      loadingMoreProducts: loadingMoreProducts === slug,
    });
    
    if (
      !isLoading &&
      loadingMoreProducts !== slug &&
      currentPage < totalPages
    ) {
      console.log(`Loading products for ${slug}, page ${currentPage + 1}`);
      productLoadTimeRef.current[slug] = now;
      setLoadingMoreProducts(slug);
      
      return dispatch(
        fetchProductsByCategorySlug({
          slug,
          params: {
            page: currentPage + 1,
            limit: bucket?.pagination?.limit || 12,
          },
        })
      ).finally(() => {
        setLoadingMoreProducts(null);
        productLoadTimeRef.current[slug] = Date.now();
      });
    }
    
    return Promise.resolve();
  }, [dispatch, loadingMoreProducts, productsBuckets]);

  // ------------------------------------------------------------------
  // CHECK IF HAS MORE PRODUCTS FOR A CATEGORY
  // ------------------------------------------------------------------
  const hasMoreProductsByCategorySlug = useCallback((slug: string) => {
    // ✅ Get bucket from the productsBuckets state
    const bucket = productsBuckets[slug] || {};
    
    const currentPage = bucket?.pagination?.page || 1;
    const totalPages = bucket?.pagination?.pages || 1;
    
    const hasMore = currentPage < totalPages;
    console.log(`hasMoreProducts for ${slug}:`, {
      currentPage,
      totalPages,
      hasMore,
      totalProducts: bucket?.data?.length || 0,
      totalInCategory: bucket?.pagination?.total || 0,
    });
    
    return hasMore;
  }, [productsBuckets]);

  // ------------------------------------------------------------------
  // SEARCH CATEGORIES (resets infinite scroll)
  // ------------------------------------------------------------------
  const searchCategories = useCallback(
    (searchTerm: string) => {
      dispatch(
        fetchCategories({
          page: 1,
          limit: 13,
          search: searchTerm,
        })
      );
    },
    [dispatch]
  );

  // ------------------------------------------------------------------
  // LOAD PRODUCTS FOR A CATEGORY WITH PAGINATION
  // ------------------------------------------------------------------
  const loadProductsByCategorySlug = useCallback(
    (
      slug: string,
      params?: {
        search?: string;
        page?: number;
        limit?: number;
      }
    ) => {
      console.log(`Loading products for ${slug} with params:`, params);
      return dispatch(
        fetchProductsByCategorySlug({
          slug,
          params: {
            page: params?.page || 1,
            limit: params?.limit || 12,
            search: params?.search,
          },
        })
      );
    },
    [dispatch]
  );

  // ------------------------------------------------------------------
  // SET CURRENT SELECTED CATEGORY
  // ------------------------------------------------------------------
  const setCategory = useCallback(
    (value: string) => {
      dispatch(setSelectedCategoryId(value));
    },
    [dispatch]
  );

  // ------------------------------------------------------------------
  // CREATE CATEGORY ON SERVER
  // ------------------------------------------------------------------
  const createCategoryOnServer = useCallback(
    (name: string, description?: string) => {
      return dispatch(createCategory({ name, description }));
    },
    [dispatch]
  );

  // ------------------------------------------------------------------
  // ADD CATEGORY LOCALLY
  // ------------------------------------------------------------------
  const addCategory = useCallback(
    (name: string) => {
      dispatch(addCategoryLocal(name));
    },
    [dispatch]
  );

  // ------------------------------------------------------------------
  // UPDATE CATEGORIES PAGINATION
  // ------------------------------------------------------------------
  const updatePagination = useCallback(
    (
      pagination: Partial<{
        page: number;
        limit: number;
        total: number;
        pages: number;
      }>
    ) => {
      dispatch(updateCategoriesPagination(pagination));
    },
    [dispatch]
  );

  // ------------------------------------------------------------------
  // RESET CATEGORIES PAGINATION
  // ------------------------------------------------------------------
  const resetPagination = useCallback(() => {
    dispatch(resetCategoriesPagination());
  }, [dispatch]);

  // ------------------------------------------------------------------
  // GET PRODUCT BUCKET FOR A CATEGORY (Helper function)
  // ------------------------------------------------------------------
  const getProductsBucket = useCallback((slug: string) => {
    return productsBuckets[slug] || {};
  }, [productsBuckets]);

  // ------------------------------------------------------------------
  // CATEGORY FINDER HELPERS
  // ------------------------------------------------------------------
  const getCategoryByName = useCallback(
    (name: string) => categories.find((c) => c.name === name),
    [categories]
  );

  const getCategoryBySlug = useCallback(
    (slug: string) => categories.find((c) => c.slug === slug),
    [categories]
  );

  const getCategoryById = useCallback(
    (id: string) => categories.find((c) => c.id === id || c._id === id),
    [categories]
  );

  // ------------------------------------------------------------------
  // PAGINATION HELPERS FOR CATEGORY PRODUCTS
  // ------------------------------------------------------------------
  const goToProductsPage = useCallback(
    (slug: string, page: number) => {
      loadProductsByCategorySlug(slug, { page });
    },
    [loadProductsByCategorySlug]
  );

  const loadNextProductsPage = useCallback(
    (slug: string) => {
      const bucket = getProductsBucket(slug);
      const currentPage = bucket?.pagination?.page || 1;
      const totalPages = bucket?.pagination?.pages || 1;

      if (currentPage < totalPages) {
        goToProductsPage(slug, currentPage + 1);
      }
    },
    [getProductsBucket, goToProductsPage]
  );

  const loadPreviousProductsPage = useCallback(
    (slug: string) => {
      const bucket = getProductsBucket(slug);
      const currentPage = bucket?.pagination?.page || 1;

      if (currentPage > 1) {
        goToProductsPage(slug, currentPage - 1);
      }
    },
    [getProductsBucket, goToProductsPage]
  );

  // ------------------------------------------------------------------
  // RETURN FINAL API
  // ------------------------------------------------------------------
  return {
    // State
    categories,
    categoriesNames,
    selectedCategoryId,
    selectedCategory,
    categoriesPagination,
    categoryLoading,
    categoryError,
    loadingMore,
    loadingMoreProducts,

    // Infinite Scroll Actions
    loadMoreCategories,
    hasMoreCategories,
    loadMoreProductsByCategorySlug,
    hasMoreProductsByCategorySlug,
    searchCategories,
    updatePagination,
    resetPagination,

    // Category Selection Actions
    setCategory,
    createCategoryOnServer,
    addCategory,

    // Category Products Actions
    loadProductsByCategorySlug,
    goToProductsPage,
    loadNextProductsPage,
    loadPreviousProductsPage,

    // Helpers
    getCategoryByName,
    getCategoryBySlug,
    getCategoryById,
    getProductsBucket, // Returns bucket data directly
      getProductsPagination,

  };
};

export default useCategories;
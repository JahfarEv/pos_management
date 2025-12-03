// // src/hooks/useCategories.ts
// import { useCallback, useEffect } from "react";
// import { useAppDispatch, useAppSelector } from "../store/hooks";
// import {
//   fetchCategories,
//   setSelectedCategoryId,
//   fetchProductsByCategorySlug,
// } from "../store/slices/categorySlice";

// export const useCategories = () => {
//   const dispatch = useAppDispatch();
//   const state = useAppSelector((s) => s.categories);

//   // ------------------------------------------------------------------
//   // SELECTED CATEGORY OBJECT
//   // ------------------------------------------------------------------
//   const selectedCategory =
//     state.selectedCategoryId === "All"
//       ? null
//       : state.categories.find(
//           (cat) =>
//             cat.id === state.selectedCategoryId ||
//             cat._id === state.selectedCategoryId ||
//             cat.slug === state.selectedCategoryId ||
//             cat.name === state.selectedCategoryId
//         ) || null;

//   // ------------------------------------------------------------------
//   // LOAD ALL CATEGORIES ON MOUNT
//   // ------------------------------------------------------------------
//   useEffect(() => {
//     dispatch(fetchCategories());
//   }, [dispatch]);

//   // ------------------------------------------------------------------
//   // FETCH PRODUCTS BY SLUG
//   // supports "all" to load everything
//   // ------------------------------------------------------------------
//   const loadProductsByCategorySlug = useCallback(
//   (slug: string, params?: { search?: string; page?: number }) => {
//     dispatch(fetchProductsByCategorySlug({ slug, params }));
//   },
//   [dispatch]
// );


//   // ------------------------------------------------------------------
//   // SET SELECTED CATEGORY
//   // ------------------------------------------------------------------
//   const setCategory = useCallback(
//     (value: string) => {
//       dispatch(setSelectedCategoryId(value));
//     },
//     [dispatch]
//   );

//   // ------------------------------------------------------------------
//   // FIND CATEGORY HELPERS
//   // ------------------------------------------------------------------
//   const getCategoryByName = useCallback(
//     (name: string) => state.categories.find((c) => c.name === name),
//     [state.categories]
//   );

//   const getCategoryBySlug = useCallback(
//     (slug: string) => state.categories.find((c) => c.slug === slug),
//     [state.categories]
//   );

//   const getCategoryById = useCallback(
//     (id: string) => state.categories.find((c) => c.id === id || c._id === id),
//     [state.categories]
//   );

//   // ------------------------------------------------------------------
//   // GET PRODUCTS BUCKET (products of a category)
//   // ------------------------------------------------------------------
//   const getProductsBucket = useCallback(
//     (slug: string) =>
//       state.productsByCategory[slug] ?? {
//         data: [],
//         loading: false,
//         error: null,
//       },
//     [state.productsByCategory]
//   );

//   // ------------------------------------------------------------------
//   // RETURN PUBLIC API
//   // ------------------------------------------------------------------
//   return {
//     // categories
//     categories: state.categories,
//     categoriesNames: state.categoriesNames,
//     selectedCategoryId: state.selectedCategoryId,
    
//     selectedCategory,

//     // actions
//     setCategory,
//     loadProductsByCategorySlug,

//     // helpers
//     getCategoryByName,
//     getCategoryBySlug,
//     getCategoryById,
//     getProductsBucket,

//     // useful extra state
//     categoryLoading: state.loading,
//     categoryError: state.error,
//   };
// };

// export default useCategories;


// src/hooks/useCategories.ts
import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchCategories,
  setSelectedCategoryId,
  fetchProductsByCategorySlug,
  createCategory,
  addCategory as addCategoryLocal,
} from "../store/slices/categorySlice";

export const useCategories = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector((s) => s.categories);

  // ------------------------------------------------------------------
  // COMPUTED: selected category object (or null)
  // ------------------------------------------------------------------
  const selectedCategory =
    state.selectedCategoryId === "All"
      ? null
      : state.categories.find(
          (cat) =>
            cat.id === state.selectedCategoryId ||
            cat._id === state.selectedCategoryId ||
            cat.slug === state.selectedCategoryId ||
            cat.name === state.selectedCategoryId
        ) || null;

  // ------------------------------------------------------------------
  // LOAD ALL CATEGORIES ON MOUNT
  // ------------------------------------------------------------------
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // ------------------------------------------------------------------
  // LOAD PRODUCTS FOR A CATEGORY
  // ------------------------------------------------------------------
  const loadProductsByCategorySlug = useCallback(
    (slug: string, params?: { search?: string; page?: number }) => {
      dispatch(fetchProductsByCategorySlug({ slug, params }));
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
  // CREATE CATEGORY ON SERVER (async)
  // ------------------------------------------------------------------
  const createCategoryOnServer = useCallback(
    (name: string, description?: string) => {
      return dispatch(createCategory({ name, description }));
    },
    [dispatch]
  );

  // ------------------------------------------------------------------
  // ADD CATEGORY LOCALLY (sync reducer)
  // ------------------------------------------------------------------
  const addCategory = useCallback(
    (name: string) => {
      dispatch(addCategoryLocal(name));
    },
    [dispatch]
  );

  // ------------------------------------------------------------------
  // CATEGORY FINDER HELPERS
  // ------------------------------------------------------------------
  const getCategoryByName = useCallback(
    (name: string) => state.categories.find((c) => c.name === name),
    [state.categories]
  );

  const getCategoryBySlug = useCallback(
    (slug: string) => state.categories.find((c) => c.slug === slug),
    [state.categories]
  );

  const getCategoryById = useCallback(
    (id: string) => state.categories.find((c) => c.id === id || c._id === id),
    [state.categories]
  );

  // ------------------------------------------------------------------
  // GET PRODUCT BUCKET FOR A CATEGORY
  // ------------------------------------------------------------------
  const getProductsBucket = useCallback(
    (slug: string) =>
      state.productsByCategory[slug] ?? {
        data: [],
        loading: false,
        error: null,
      },
    [state.productsByCategory]
  );

  // ------------------------------------------------------------------
  // RETURN FINAL API
  // ------------------------------------------------------------------
  return {
    // category data
    categories: state.categories,
    categoriesNames: state.categoriesNames,
    selectedCategoryId: state.selectedCategoryId,
    selectedCategory, // <-- FIXED: correctly computed

    // actions
    setCategory,
    loadProductsByCategorySlug,
    createCategoryOnServer,
    addCategory,

    // helpers
    getCategoryByName,
    getCategoryBySlug,
    getCategoryById,
    getProductsBucket,

    // extra state
    categoryLoading: state.loading,
    categoryError: state.error,
  };
};

export default useCategories;

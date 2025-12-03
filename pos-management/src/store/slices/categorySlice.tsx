// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import type { PayloadAction } from "@reduxjs/toolkit";
// import api from "../../../src/utils/api";

// // --------------------------------
// // TYPES
// // --------------------------------
// export interface Category {
//   id: string;
//   _id?: string;
//   name: string;
//   slug?: string;
//   description?: string;
//   parentId?: string | null;
//   isActive?: boolean;
//   createdAt?: string;
//   updatedAt?: string;
// }

// export interface Product {
//   id: string;
//   _id?: string;
//   name: string;
//   price?: number;
//   stock?: number;
//   lowStock?: boolean;
//   category?: string | any;
// }

// interface ProductsBucket {
//   data: Product[];
//   loading: boolean;
//   error?: string | null;
// }

// interface CategoriesState {
//   categories: Category[];
//   categoriesNames: string[];
//   selectedCategoryId: string | "All";
//   loading: boolean;
//   error?: string | null;

//   productsByCategory: Record<string, ProductsBucket>;
// }

// // --------------------------------
// // INITIAL STATE
// // --------------------------------
// const initialState: CategoriesState = {
//   categories: [],
//   categoriesNames: ["All"],
//   selectedCategoryId: "All",
//   loading: false,
//   error: null,

//   productsByCategory: {},
// };

// // --------------------------------
// // NORMALIZE HELPERS
// // --------------------------------
// const normalizeCategory = (c: any): Category => ({
//   id: c.id || c._id || String(Date.now()),
//   _id: c._id,
//   name: c.name,
//   slug: c.slug,
//   description: c.description,
//   parentId: c.parentId ?? null,
//   isActive: c.isActive ?? true,
//   createdAt: c.createdAt,
//   updatedAt: c.updatedAt,
// });

// const normalizeProduct = (p: any): Product => ({
//   id: p.id || p._id || String(Date.now()),
//   _id: p._id,
//   name: p.name,

//   price: p.price ?? p.retailRate ?? p.wholesaleRate ?? p.purchaseRate ?? 0,

//   stock: p.stock ?? p.quantity ?? 0,
//   lowStock: p.lowStock ?? false,
//   category: p.category,
// });

// // --------------------------------
// // FETCH CATEGORIES
// // --------------------------------

// export const fetchCategories = createAsyncThunk<Category[]>(
//   "categories/fetchCategories",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await api.request<any>("/api/categories");
//       const cats =
//         res?.data ||
//         res?.categories ||
//         res?.items ||
//         (Array.isArray(res) ? res : []) ||
//         [];
//       return cats.map(normalizeCategory);
//     } catch (err: any) {
//       return rejectWithValue(err.message || "Failed to load categories");
//     }
//   }
// );

// // --------------------------------
// // FETCH PRODUCTS VIA CATEGORY SLUG
// export const fetchProductsByCategorySlug = createAsyncThunk<
//   { slug: string; data: Product[] },
//   { slug: string; params?: { search?: string; page?: number } }
// >(
//   "categories/fetchProductsByCategorySlug",
//   async ({ slug, params }, { rejectWithValue }) => {
//     try {
//       const cleanSlug = String(slug).toLowerCase() === "all" ? "all" : slug;

//       let url = `/api/categories/${encodeURIComponent(String(cleanSlug))}`;

//       const sp = new URLSearchParams();
//       if (params?.search) sp.set("search", params.search);
//       if (params?.page) sp.set("page", String(params.page));
//       const qs = sp.toString();
//       if (qs) url += `?${qs}`;

//       const res = await api.request<any>(url);
//       const arr = Array.isArray(res?.data) ? res.data : [];
//       const normalized = arr.map(normalizeProduct);
//       return { slug: cleanSlug, data: normalized };
//     } catch (err: any) {
//       return rejectWithValue(err.message || "Failed to load products");
//     }
//   }
// );

// // --------------------------------
// // SLICE
// // --------------------------------


// const categoriesSlice = createSlice({
//   name: "categories",
//   initialState,
//   reducers: {
//     setSelectedCategoryId: (state, action: PayloadAction<string>) => {
//       state.selectedCategoryId = action.payload;
//     },

//     clearProductsForCategory: (state, action: PayloadAction<string>) => {
//       delete state.productsByCategory[action.payload];
//     },

//     clearAllProducts: (state) => {
//       state.productsByCategory = {};
//     },
//   },

//   extraReducers: (builder) => {
//     // --- LOAD CATEGORIES
//     builder
//       .addCase(fetchCategories.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchCategories.fulfilled, (state, action) => {
//         state.loading = false;
//         state.categories = action.payload;

//         state.categoriesNames = [
//           "All",
//           ...action.payload.map((c) => c.name).filter(Boolean),
//         ];
//       })
//       .addCase(fetchCategories.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });

//     // --- LOAD PRODUCTS
//     builder
//       .addCase(fetchProductsByCategorySlug.pending, (state, action) => {
//         const slug = action.meta.arg.slug;
//         state.productsByCategory[slug] = {
//           data: [],
//           loading: true,
//           error: null,
//         };
//       })
//       .addCase(fetchProductsByCategorySlug.fulfilled, (state, action) => {
//         const { slug, data } = action.payload;
//         state.productsByCategory[slug] = {
//           data,
//           loading: false,
//           error: null,
//         };
//       })
//       .addCase(fetchProductsByCategorySlug.rejected, (state, action) => {
//         const slug = action.meta.arg.slug;
//         state.productsByCategory[slug] = {
//           data: [],
//           loading: false,
//           error: action.payload as string,
//         };
//       });
//   },
// });

// // --------------------------------
// // EXPORTS
// // --------------------------------

// export const {
//   setSelectedCategoryId,
//   clearProductsForCategory,
//   clearAllProducts,
// } = categoriesSlice.actions;

// export default categoriesSlice.reducer;

// // SELECTORS

// export const selectAllCategories = (s: any) => s.categories.categories;
// export const selectCategoryNames = (s: any) => s.categories.categoriesNames;
// export const selectProductsBucket = (slug: string) => (s: any) =>
//   s.categories.productsByCategory[slug] ?? {
//     data: [],
//     loading: false,
//     error: null,
//   };


import { createSlice, createAsyncThunk, } from "@reduxjs/toolkit";
import type {PayloadAction } from '@reduxjs/toolkit'
import api from "../../../src/utils/api";

// --------------------------------
// TYPES
// --------------------------------
export interface Category {
  id: string;
  _id?: string;
  name: string;
  slug?: string;
  description?: string;
  parentId?: string | null;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: string;
  _id?: string;
  name: string;
  price?: number;
  stock?: number;
  lowStock?: boolean;
  category?: string | any;
}

interface ProductsBucket {
  data: Product[];
  loading: boolean;
  error?: string | null;
}

interface CategoriesState {
  categories: Category[];
  categoriesNames: string[];
  selectedCategoryId: string | "All";
  loading: boolean;
  error?: string | null;
  productsByCategory: Record<string, ProductsBucket>;
}

// --------------------------------
// INITIAL STATE
// --------------------------------
const initialState: CategoriesState = {
  categories: [],
  categoriesNames: ["All"],
  selectedCategoryId: "All",
  loading: false,
  error: null,
  productsByCategory: {},
};

// --------------------------------
// NORMALIZE HELPERS
// --------------------------------
const normalizeCategory = (c: any): Category => ({
  id: c.id || c._id || String(Date.now()),
  _id: c._id,
  name: c.name,
  slug: c.slug,
  description: c.description,
  parentId: c.parentId ?? null,
  isActive: c.isActive ?? true,
  createdAt: c.createdAt,
  updatedAt: c.updatedAt,
});

const normalizeProduct = (p: any): Product => ({
  id: p.id || p._id || String(Date.now()),
  _id: p._id,
  name: p.name,
  price: p.price ?? p.retailRate ?? p.wholesaleRate ?? p.purchaseRate ?? 0,
  stock: p.stock ?? p.quantity ?? 0,
  lowStock: p.lowStock ?? false,
  category: p.category,
});

// --------------------------------
// FETCH CATEGORIES
// --------------------------------
export const fetchCategories = createAsyncThunk<Category[]>(
  "categories/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.request<any>("/categories");
      const cats =
        res?.data ||
        res?.categories ||
        res?.items ||
        (Array.isArray(res) ? res : []) ||
        [];
      return cats.map(normalizeCategory);
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to load categories");
    }
  }
);

// --------------------------------
// CREATE CATEGORY (async -> posts to server)
// payload: { name: string, description?: string }
export const createCategory = createAsyncThunk<
  Category,
  { name: string; description?: string }
>(
  "categories/createCategory",
  async ({ name, description }, { rejectWithValue }) => {
    try {
      // If `api` is axios-like:
      const res = await api.post<any>("/categories", { name, description });

      const created = res?.data || res?.category || res;
      return normalizeCategory(created);
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to create category");
    }
  }
);

// --------------------------------
// FETCH PRODUCTS VIA CATEGORY SLUG
// --------------------------------
export const fetchProductsByCategorySlug = createAsyncThunk<
  { slug: string; data: Product[] },
  { slug: string; params?: { search?: string; page?: number } }
>(
  "categories/fetchProductsByCategorySlug",
  async ({ slug, params }, { rejectWithValue }) => {
    try {
      const cleanSlug = String(slug).toLowerCase() === "all" ? "all" : slug;
      let url = `/categories/${encodeURIComponent(String(cleanSlug))}`;
      const sp = new URLSearchParams();
      if (params?.search) sp.set("search", params.search);
      if (params?.page) sp.set("page", String(params.page));
      const qs = sp.toString();
      if (qs) url += `?${qs}`;
      const res = await api.request<any>(url);
      const arr = Array.isArray(res?.data) ? res.data : [];
      const normalized = arr.map(normalizeProduct);
      return { slug: cleanSlug, data: normalized };
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to load products");
    }
  }
);

// --------------------------------
// SLICE
// --------------------------------
const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setSelectedCategoryId: (state, action: PayloadAction<string>) => {
      state.selectedCategoryId = action.payload;
    },

    clearProductsForCategory: (state, action: PayloadAction<string>) => {
      delete state.productsByCategory[action.payload];
    },

    clearAllProducts: (state) => {
      state.productsByCategory = {};
    },

    // synchronous addCategory that accepts a string (useful for immediate / local updates)
    addCategory: (state, action: PayloadAction<string>) => {
      const name = action.payload?.trim();
      if (!name) return;
      // avoid duplicates
      if (state.categoriesNames.includes(name)) return;

      const newCategory: Category = {
        id: String(Date.now()),
        name,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      state.categories.push(newCategory);
      state.categoriesNames = ["All", ...state.categories.map((c) => c.name).filter(Boolean)];
    },
  },

  extraReducers: (builder) => {
    // --- LOAD CATEGORIES
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
        state.categoriesNames = ["All", ...action.payload.map((c) => c.name).filter(Boolean)];
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // --- CREATE CATEGORY (async)
    builder
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        const cat = action.payload;
        // avoid duplicates by name
        if (!state.categories.some((c) => c.name === cat.name)) {
          state.categories.push(cat);
        }
        state.categoriesNames = ["All", ...state.categories.map((c) => c.name).filter(Boolean)];
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // --- LOAD PRODUCTS
    builder
      .addCase(fetchProductsByCategorySlug.pending, (state, action) => {
        const slug = action.meta.arg.slug;
        state.productsByCategory[slug] = {
          data: [],
          loading: true,
          error: null,
        };
      })
      .addCase(fetchProductsByCategorySlug.fulfilled, (state, action) => {
        const { slug, data } = action.payload;
        state.productsByCategory[slug] = {
          data,
          loading: false,
          error: null,
        };
      })
      .addCase(fetchProductsByCategorySlug.rejected, (state, action) => {
        const slug = action.meta.arg.slug;
        state.productsByCategory[slug] = {
          data: [],
          loading: false,
          error: action.payload as string,
        };
      });
  },
});

// --------------------------------
// EXPORTS
// --------------------------------
export const {
  setSelectedCategoryId,
  clearProductsForCategory,
  clearAllProducts,
  addCategory, // sync
} = categoriesSlice.actions;

export default categoriesSlice.reducer;

// SELECTORS
export const selectAllCategories = (s: any) => s.categories.categories;
export const selectCategoryNames = (s: any) => s.categories.categoriesNames;
export const selectProductsBucket = (slug: string) => (s: any) =>
  s.categories.productsByCategory[slug] ?? {
    data: [],
    loading: false,
    error: null,
  };

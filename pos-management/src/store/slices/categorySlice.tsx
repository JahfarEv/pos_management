import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
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

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface ProductsBucket {
  data: Product[];
  loading: boolean;
  error?: string | null;
  pagination?: PaginationData;
}

interface CategoriesState {
  productsBuckets: {
    [key: string]: ProductsBucket;
  };
  categories: Category[];
  categoriesNames: string[];
  selectedCategoryId: string | "All";
  loading: boolean;
  error?: string | null;
  productsByCategory: Record<string, ProductsBucket>;
  categoriesPagination: PaginationData;
  
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
  categoriesPagination: {
    page: 1,
    limit: 13,
    total: 0,
    pages: 1,
  },
  productsBuckets: {},
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
// FETCH CATEGORIES WITH PAGINATION
// --------------------------------

export const fetchCategories = createAsyncThunk<
  { categories: Category[]; pagination: PaginationData; isLoadMore?: boolean },
  {
    page?: number;
    limit?: number;
    search?: string;
    isLoadMore?: boolean;
  } | void
>("categories/fetchCategories", async (params, { rejectWithValue }) => {
  try {
    let url = "/categories";
    const queryParams = new URLSearchParams();

    const safeParams = params || {};
    const typedParams = safeParams as {
      page?: number;
      limit?: number;
      search?: string;
      isLoadMore?: boolean;
    };

    // Set pagination parameters - IMPORTANT: Initial load uses page 1
    const page = typedParams.page || 1;
    const limit = typedParams.limit || 13;
    const isLoadMore = typedParams.isLoadMore || false;

    queryParams.set("page", page.toString());
    queryParams.set("limit", limit.toString());

    if (typedParams.search) {
      queryParams.set("search", typedParams.search);
    }

    const qs = queryParams.toString();
    if (qs) url += `?${qs}`;

    console.log(`Fetching categories:`, { page, limit, isLoadMore, url });

    const res = await api.request<any>(url);

    if (!res.success) {
      throw new Error(res.message || "Failed to load categories");
    }

    // Extract categories from "items" array (your API structure)
    let categoriesData = [];

    if (Array.isArray(res.items)) {
      categoriesData = res.items;
    } else if (Array.isArray(res?.data)) {
      categoriesData = res.data;
    }

    // Extract pagination from response
    const pagination: PaginationData = {
      page: res.page || page,
      limit: res.limit || limit,
      total: res.total || 0,
      pages: res.pages || 1,
    };

    console.log("API Response:", {
      itemsCount: categoriesData.length,
      total: pagination.total,
      page: pagination.page,
      pages: pagination.pages,
      isLoadMore,
    });

    const normalizedCategories = categoriesData.map(normalizeCategory);

    return {
      categories: normalizedCategories,
      pagination,
      isLoadMore,
    };
  } catch (err: any) {
    console.error("Error fetching categories:", err);
    return rejectWithValue(err.message || "Failed to load categories");
  }
});
// --------------------------------
// CREATE CATEGORY
// --------------------------------
export const createCategory = createAsyncThunk<
  Category,
  { name: string; description?: string }
>(
  "categories/createCategory",
  async ({ name, description }, { rejectWithValue }) => {
    try {
      const res = await api.post<any>("/categories", { name, description });
      const created = res?.data || res?.category || res;
      return normalizeCategory(created);
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to create category");
    }
  }
);

// --------------------------------
// FETCH PRODUCTS VIA CATEGORY SLUG WITH PAGINATION
// --------------------------------
// In your fetchProductsByCategorySlug thunk, add more logging:
export const fetchProductsByCategorySlug = createAsyncThunk<
  {
    slug: string;
    data: Product[];
    pagination: PaginationData;
  },
  {
    slug: string;
    params?: {
      search?: string;
      page?: number;
      limit?: number;
    };
  }
>(
  "categories/fetchProductsByCategorySlug",
  async ({ slug, params }, { rejectWithValue, signal }) => {
    try {
      // Add a small delay to prevent rapid calls
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Check if request was aborted (React 18 strict mode double render)
      if (signal.aborted) {
        console.log("Request aborted for:", slug);
        throw new Error("Request aborted");
      }

      // Always use the slug as-is for the categories endpoint
      // "All" will become "all", other categories use their slug
      const cleanSlug = String(slug).toLowerCase();

      let url = "";
      const sp = new URLSearchParams();

      const page = params?.page || 1;
      const limit = params?.limit || 12;

      sp.set("page", String(page));
      sp.set("limit", String(limit));

      if (params?.search) {
        sp.set("search", params.search);
      }

      url = `/categories/${encodeURIComponent(cleanSlug)}`;

      const qs = sp.toString();
      if (qs) url += `?${qs}`;

      console.log("📡 Calling:", url, "at", new Date().toISOString());

      const res = await api.request<any>(url);

      console.log("📥 Raw response received for:", cleanSlug);

      // Extract data
      let data = [];
      if (Array.isArray(res.data)) {
        data = res.data;
      } else if (Array.isArray(res)) {
        data = res;
      }

      // Extract pagination
      const paginationData: PaginationData = {
        page: res.meta?.page || page,
        limit: res.meta?.limit || limit,
        total: res.meta?.total || data.length,
        pages:
          res.meta?.pages ||
          Math.ceil((res.meta?.total || data.length) / limit),
      };

      const normalized = data.map(normalizeProduct);

      console.log("✅ Successfully processed:", {
        slug: cleanSlug,
        products: normalized.length,
        page: paginationData.page,
      });

      return {
        slug: cleanSlug,
        data: normalized,
        pagination: paginationData,
      };
    } catch (err: any) {
      if (err.message === "Request aborted" || err.name === "AbortError") {
        console.log("Request was aborted for:", slug);
        return rejectWithValue("Request cancelled");
      }

      console.error("❌ API Error:", err.message);

      if (err.response?.status === 404 || err.code === "ERR_NETWORK") {
        return {
          slug: String(slug).toLowerCase(),
          data: [],
          pagination: {
            page: params?.page || 1,
            limit: params?.limit || 8,
            total: 0,
            pages: 1,
          },
        };
      }

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

    // Synchronous addCategory for immediate/local updates
    addCategory: (state, action: PayloadAction<string>) => {
      const name = action.payload?.trim();
      if (!name) return;

      // Avoid duplicates
      if (state.categoriesNames.includes(name)) return;

      const newCategory: Category = {
        id: String(Date.now()),
        name,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      state.categories.push(newCategory);
      state.categoriesNames = [
        "All",
        ...state.categories.map((c) => c.name).filter(Boolean),
      ];

      // Update pagination total
      state.categoriesPagination.total += 1;
      state.categoriesPagination.pages = Math.ceil(
        state.categoriesPagination.total / state.categoriesPagination.limit
      );
    },

    // Update categories pagination
    updateCategoriesPagination: (
      state,
      action: PayloadAction<Partial<PaginationData>>
    ) => {
      state.categoriesPagination = {
        ...state.categoriesPagination,
        ...action.payload,
      };
    },

    // Update category pagination for specific category
    updateCategoryPagination: (
      state,
      action: PayloadAction<{
        slug: string;
        pagination: Partial<PaginationData>;
      }>
    ) => {
      const { slug, pagination } = action.payload;
      if (state.productsByCategory[slug]) {
        state.productsByCategory[slug] = {
          ...state.productsByCategory[slug],
          pagination: {
            ...(state.productsByCategory[slug].pagination || {
              page: 1,
              limit: 8,
              total: 0,
              pages: 1,
            }),
            ...pagination,
          },
        };
      }
    },

    // Reset pagination to first page for a category
    resetCategoryPagination: (state, action: PayloadAction<string>) => {
      const slug = action.payload;
      if (state.productsByCategory[slug]?.pagination) {
        state.productsByCategory[slug].pagination!.page = 1;
      }
    },

    // Reset categories pagination to first page
    resetCategoriesPagination: (state) => {
      state.categoriesPagination.page = 1;
    },
  },

  extraReducers: (builder) => {
    // --- LOAD CATEGORIES WITH PAGINATION
  
    builder
      .addCase(fetchCategories.pending, (state, action) => {
        const isLoadMore = action.meta.arg?.isLoadMore || false;

        console.log("fetchCategories pending:", { isLoadMore });

        if (!isLoadMore) {
          // Initial load - show global loading
          state.loading = true;
        }
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const { categories, pagination, isLoadMore } = action.payload;

        console.log("fetchCategories fulfilled:", {
          isLoadMore,
          receivedCategories: categories.length,
          existingCategories: state.categories.length,
          page: pagination.page,
        });

        if (isLoadMore) {
          // Append new categories (page 2) to existing categories (page 1)
          const existingIds = new Set(
            state.categories.map((c) => c.id || c._id)
          );
          const newCategories = categories.filter(
            (cat) => !existingIds.has(cat.id || cat._id)
          );

          console.log(`Appending ${newCategories.length} new categories`);
          state.categories = [...state.categories, ...newCategories];
        } else {
          // Initial load - replace all (page 1 only)
          console.log(`Setting ${categories.length} categories (initial load)`);
          state.categories = categories;
        }

        // Update pagination
        state.categoriesPagination = pagination;

        // Update category names
        state.categoriesNames = [
          "All",
          ...state.categories.map((c) => c.name).filter(Boolean),
        ];
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // --- CREATE CATEGORY
    builder
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        const cat = action.payload;

        // Avoid duplicates by name
        if (!state.categories.some((c) => c.name === cat.name)) {
          state.categories.push(cat);
        }

        state.categoriesNames = [
          "All",
          ...state.categories.map((c) => c.name).filter(Boolean),
        ];

        // Update pagination
        state.categoriesPagination.total += 1;
        state.categoriesPagination.pages = Math.ceil(
          state.categoriesPagination.total / state.categoriesPagination.limit
        );
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // --- LOAD PRODUCTS BY CATEGORY WITH PAGINATION
    // builder
      // .addCase(fetchProductsByCategorySlug.pending, (state, action) => {
      //   const slug = action.meta.arg.slug;
      //   const existing = state.productsByCategory[slug];
      //   state.productsByCategory[slug] = {
      //     data: existing?.data || [],
      //     loading: true,
      //     error: null,
      //     pagination: existing?.pagination || {
      //       page: action.meta.arg.params?.page || 1,
      //       limit: action.meta.arg.params?.limit || 8,
      //       total: existing?.pagination?.total || 0,
      //       pages: existing?.pagination?.pages || 1,
      //     },
      //   };
      // })
      // .addCase(fetchProductsByCategorySlug.fulfilled, (state, action) => {
      //   const { slug, data, pagination } = action.payload;
      //   state.productsByCategory[slug] = {
      //     data,
      //     loading: false,
      //     error: null,
      //     pagination,
      //   };
      // })
      // .addCase(fetchProductsByCategorySlug.rejected, (state, action) => {
      //   const slug = action.meta.arg.slug;
      //   const existing = state.productsByCategory[slug];
      //   state.productsByCategory[slug] = {
      //     data: existing?.data || [],
      //     loading: false,
      //     error: action.payload as string,
      //     pagination: existing?.pagination || {
      //       page: 1,
      //       limit: 8,
      //       total: 0,
      //       pages: 1,
      //     },
      //   };
      // });


builder.addCase(fetchProductsByCategorySlug.pending, (state, action) => {
    const slug = action.meta.arg.slug;
    const page = action.meta.arg.params?.page || 1;
    
    if (!state.productsBuckets[slug]) {
      state.productsBuckets[slug] = {
        data: [],
        pagination: { page: 1, limit: 12, total: 0, pages: 1 },
        loading: true,
        error: null,
      };
    }
    
    if (page === 1) {
      // First page - reset data
      state.productsBuckets[slug].data = [];
      state.productsBuckets[slug].loading = true;
    }
    // For infinite scroll, loading state is handled separately
  });
  
  builder.addCase(fetchProductsByCategorySlug.fulfilled, (state, action) => {
    const { slug, data, pagination } = action.payload;
    const page = action.meta.arg.params?.page || 1;
    
    if (!state.productsBuckets[slug]) {
      state.productsBuckets[slug] = {
        data: [],
        pagination,
        loading: false,
        error: null,
      };
    }
    
    if (page === 1) {
      // First page - replace data
      state.productsBuckets[slug].data = data;
    } else {
      // Infinite scroll - append data
      state.productsBuckets[slug].data = [...state.productsBuckets[slug].data, ...data];
    }
    
    state.productsBuckets[slug].pagination = pagination;
    state.productsBuckets[slug].loading = false;
    state.productsBuckets[slug].error = null;
    
    console.log(`✅ Products for ${slug} updated:`, {
      page: pagination.page,
      totalPages: pagination.pages,
      productsCount: state.productsBuckets[slug].data.length,
      totalProducts: pagination.total,
    });
  });
  
  builder.addCase(fetchProductsByCategorySlug.rejected, (state, action) => {
    const slug = action.meta.arg.slug;
    if (state.productsBuckets[slug]) {
      state.productsBuckets[slug].loading = false;
      state.productsBuckets[slug].error = action.payload as string;
    }
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
  addCategory,
  updateCategoriesPagination,
  updateCategoryPagination,
  resetCategoryPagination,
  resetCategoriesPagination,
} = categoriesSlice.actions;

export default categoriesSlice.reducer;

// SELECTORS
export const selectAllCategories = (state: { categories: CategoriesState }) =>
  state.categories.categories;

export const selectCategoryNames = (state: { categories: CategoriesState }) =>
  state.categories.categoriesNames;

export const selectSelectedCategoryId = (state: {
  categories: CategoriesState;
}) => state.categories.selectedCategoryId;

export const selectProductsBucket =
  (slug: string) => (state: { categories: CategoriesState }) =>
    state.categories.productsByCategory[slug] || {
      data: [],
      loading: false,
      error: null,
      pagination: {
        page: 1,
        limit: 8,
        total: 0,
        pages: 1,
      },
    };

export const selectCategoryLoading = (state: { categories: CategoriesState }) =>
  state.categories.loading;

export const selectCategoryError = (state: { categories: CategoriesState }) =>
  state.categories.error;

export const selectCategoriesPagination = (state: {
  categories: CategoriesState;
}) => state.categories.categoriesPagination;

export const selectSelectedCategory = (state: {
  categories: CategoriesState;
}) => {
  const { selectedCategoryId, categories } = state.categories;

  if (selectedCategoryId === "All") {
    return null;
  }

  return (
    categories.find(
      (cat) =>
        cat.id === selectedCategoryId ||
        cat._id === selectedCategoryId ||
        cat.slug === selectedCategoryId ||
        cat.name === selectedCategoryId
    ) || null
  );
};

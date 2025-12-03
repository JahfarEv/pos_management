import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "../../utils/api";

export interface Product {
  id: string;
  _id?: string;
  itemName: string;
  price: number;
  stock: number;
  lowStock: boolean;
  category?: string;
  conversionFactor?: number;
  barcode?: string;
  unit?: string;
  wholesaleRate?: number;
  purchaseRate?: number;
  hsn?: string;
  code?: string;
}

interface PaginationData {
  total: number;
  page: number;
  pages: number;
  limit: number;
}

interface ProductsState {
  items: never[];
  categories: string[];
  selectedCategory: string;
  products: Product[];
  filteredProducts: Product[];
  loading: boolean;
  error?: string | null;
  pagination: PaginationData | null;
}

const initialState: ProductsState = {
  categories: ["All"],
  selectedCategory: "All",
  products: [],
  filteredProducts: [],
  loading: false,
  error: null,
  pagination: null,
  items: [],
};

const extractCategories = (products: Product[]): string[] => {
  const categories = new Set<string>();

  products.forEach((product) => {
    if (product.category) {
      categories.add(product.category);
    }
  });

  return Array.from(categories);
};

export const fetchProducts = createAsyncThunk<
  { products: Product[]; pagination: PaginationData },
  {
    q?: string;
    category?: string;
    page?: number;
    limit?: number;
  } | void
>("products/fetchProducts", async (params, { rejectWithValue }) => {
  try {
    let url = "/products";
    const queryParams = new URLSearchParams();

    // Create default parameters
    const defaultParams = {
      page: 1,
      limit: 6,
      q: "",
      category: "",
    };

    // Merge with provided params (if any)
    const mergedParams = {
      ...defaultParams,
      ...(params || {}),
    };

    queryParams.set("page", mergedParams.page.toString());
    queryParams.set("limit", mergedParams.limit.toString());

    if (mergedParams.q && mergedParams.q.trim() !== "") {
      queryParams.set("q", mergedParams.q.trim());
    }

    if (mergedParams.category && mergedParams.category !== "All") {
      queryParams.set("category", mergedParams.category);
    }

    url += `?${queryParams.toString()}`;
    console.log("API URL:", url);

    const response = await api.request<any>(url);

    if (!response.success) {
      throw new Error(response.message || "Failed to fetch products");
    }

    const productsData = response.items || [];
    const paginationData: PaginationData = {
      total: response.total || 0,
      page: response.page || mergedParams.page,
      pages: response.pages || 1,
      limit: response.limit || mergedParams.limit,
    };

    console.log(
      `Fetched ${productsData.length} products, pagination:`,
      paginationData
    );

    // Normalize product data
    const normalizedProducts = productsData.map((product: any) => ({
      id: product._id || product.id || String(Date.now()),
      itemName: product.name || product.itemName || "Unnamed Product",
      price: product.retailRate || product.price || 0,
      category: product.category || "Uncategorized",
      lowStock: product.lowStock || false,
      stock: product.stock || 0,
      conversionFactor: product.conversionFactor || 1,
      _id: product._id,
      barcode: product.barcode,
      unit: product.unitPrimary,
      wholesaleRate: product.wholesaleRate,
      purchaseRate: product.purchaseRate,
      hsn: product.hsn,
      code: product.code,
    })) as Product[];

    return {
      products: normalizedProducts,
      pagination: paginationData,
    };
  } catch (err: any) {
    console.error("Error fetching products:", err);
    return rejectWithValue(err.message || "Failed to fetch products");
  }
});
// Create new product
export const createProduct = createAsyncThunk<Product, Record<string, any>>(
  "products/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      console.log("Creating product:", productData);

      const response = await api.request<any>("/products", {
        method: "POST",
        data: productData,
      });

      console.log("API Response:", response);

      const newProduct = response.data || response;

      return {
        id: newProduct._id || String(Date.now()),
        itemName:
          newProduct.name ||
          newProduct.itemName ||
          productData.name ||
          productData.itemName,
        price:
          newProduct.retailRate ||
          newProduct.price ||
          productData.retailRate ||
          productData.price ||
          0,
        category:
          newProduct.category || productData.category || "Uncategorized",
        lowStock: newProduct.lowStock || false,
        stock: newProduct.stock || productData.stock || 0,
        conversionFactor:
          newProduct.conversionFactor || productData.conversionFactor || 1,
        _id: newProduct._id,
        barcode: newProduct.barcode || productData.barcode,
        unit: newProduct.unitPrimary || productData.unitPrimary,
        wholesaleRate: newProduct.wholesaleRate || productData.wholesaleRate,
        purchaseRate: newProduct.purchaseRate || productData.purchaseRate,
        hsn: newProduct.hsn || productData.hsn,
        code: newProduct.code || productData.code,
      } as Product;
    } catch (err: any) {
      console.error("Error creating product:", err);
      return rejectWithValue(err.message || "Failed to create product");
    }
  }
);

// Update product
export const updateProduct = createAsyncThunk<
  Product,
  { id: string; payload: Record<string, any> }
>("products/updateProduct", async ({ id, payload }, { rejectWithValue }) => {
  try {
    console.log("Updating product:", id, payload);

    const response = await api.request<any>(`/products/${id}`, {
      method: "PUT",
      data: payload,
    });

    const updatedProduct = response.data || response;

    return {
      id: updatedProduct._id || id,
      itemName:
        updatedProduct.name ||
        updatedProduct.itemName ||
        payload.name ||
        payload.itemName,
      price:
        updatedProduct.retailRate ||
        updatedProduct.price ||
        payload.retailRate ||
        payload.price ||
        0,
      category: updatedProduct.category || payload.category,
      lowStock: updatedProduct.lowStock || false,
      stock: updatedProduct.stock || payload.stock || 0,
      conversionFactor:
        updatedProduct.conversionFactor || payload.conversionFactor || 1,
      _id: updatedProduct._id,
      barcode: updatedProduct.barcode || payload.barcode,
      unit: updatedProduct.unitPrimary || payload.unitPrimary,
      wholesaleRate: updatedProduct.wholesaleRate || payload.wholesaleRate,
      purchaseRate: updatedProduct.purchaseRate || payload.purchaseRate,
      hsn: updatedProduct.hsn || payload.hsn,
      code: updatedProduct.code || payload.code,
    } as Product;
  } catch (err: any) {
    console.error("Error updating product:", err);
    return rejectWithValue(err.message || "Failed to update product");
  }
});

// Delete product
export const deleteProduct = createAsyncThunk<string, string>(
  "products/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      console.log("Deleting product:", id);

      const response = await api.request<any>(`/products/${id}`, {
        method: "DELETE",
      });

      console.log("Delete response:", response);

      if (response.success) {
        return id;
      } else {
        throw new Error(response.message || "Failed to delete product");
      }
    } catch (err: any) {
      console.error("Delete error:", err);
      return rejectWithValue(err.message || "Failed to delete product");
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;

      if (action.payload === "All") {
        state.filteredProducts = state.products;
      } else {
        state.filteredProducts = state.products.filter(
          (product) => product.category === action.payload
        );
      }
    },

    addCategory: (state, action: PayloadAction<string>) => {
      const newCategory = action.payload;
      if (
        newCategory &&
        newCategory !== "All" &&
        !state.categories.includes(newCategory)
      ) {
        state.categories.push(newCategory);
      }
    },

    clearError: (state) => {
      state.error = null;
    },

    resetProducts: () => initialState,

    // Add pagination reducer
    setPagination: (state, action: PayloadAction<PaginationData>) => {
      state.pagination = action.payload;
    },

    // Reset pagination to first page
    resetToFirstPage: (state) => {
      if (state.pagination) {
        state.pagination.page = 1;
      }
    },
  },

  extraReducers: (builder) => {
    // Fetch Products
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.pagination = action.payload.pagination;

        // Extract categories from the current page's products
        const extractedCategories = extractCategories(action.payload.products);

        // Start with "All" category
        const newCategories = ["All"];

        // Add extracted categories
        extractedCategories.forEach((cat) => {
          if (cat && !newCategories.includes(cat)) {
            newCategories.push(cat);
          }
        });

        // Merge with existing categories (remove duplicates)
        const allCategories = Array.from(
          new Set([...state.categories, ...newCategories])
        );
        state.categories = allCategories;

        // Update filtered products
        if (state.selectedCategory === "All") {
          state.filteredProducts = action.payload.products;
        } else {
          state.filteredProducts = action.payload.products.filter(
            (product) => product.category === state.selectedCategory
          );
        }

        console.log(
          "State updated - Products:",
          state.products.length,
          "Categories:",
          state.categories.length,
          "Pagination:",
          state.pagination
        );
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.error("Fetch products rejected:", action.payload);
      });

    // Create Product
    builder
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;

        // Add the new product to the list
        state.products.unshift(action.payload); // Add at beginning

        // Add to filtered products if category matches
        if (
          state.selectedCategory === "All" ||
          action.payload.category === state.selectedCategory
        ) {
          state.filteredProducts.unshift(action.payload);
        }

        // Add new category if it doesn't exist
        if (
          action.payload.category &&
          !state.categories.includes(action.payload.category)
        ) {
          state.categories.push(action.payload.category);
        }

        // Update pagination total
        if (state.pagination) {
          state.pagination.total += 1;
        }
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update Product
    builder
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.products.findIndex(
          (p) => p.id === action.payload.id
        );
        if (index !== -1) {
          state.products[index] = action.payload;

          const filteredIndex = state.filteredProducts.findIndex(
            (p) => p.id === action.payload.id
          );
          if (filteredIndex !== -1) {
            state.filteredProducts[filteredIndex] = action.payload;
          }

          // Add new category if it doesn't exist
          if (
            action.payload.category &&
            !state.categories.includes(action.payload.category)
          ) {
            state.categories.push(action.payload.category);
          }
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete Product
    builder
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;

        // Remove from products
        state.products = state.products.filter((p) => p.id !== action.payload);

        // Remove from filtered products
        state.filteredProducts = state.filteredProducts.filter(
          (p) => p.id !== action.payload
        );

        // Update categories
        const extractedCategories = extractCategories(state.products);
        state.categories = ["All", ...extractedCategories];

        // Update pagination total
        if (state.pagination) {
          state.pagination.total = Math.max(0, state.pagination.total - 1);
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSelectedCategory,
  addCategory,
  clearError,
  resetProducts,
  setPagination,
  resetToFirstPage,
} = productsSlice.actions;

export default productsSlice.reducer;

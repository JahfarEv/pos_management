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
}

interface ProductsState {
  categories: string[];
  selectedCategory: string;
  products: Product[];
  filteredProducts: Product[];
  loading: boolean;
  error?: string | null;
}

const initialState: ProductsState = {
  categories: ["All"],
  selectedCategory: "All",
  products: [],
  filteredProducts: [],
  loading: false,
  error: null,
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

// Fetch all products - UPDATED
export const fetchProducts = createAsyncThunk<
  Product[],
  { search?: string; category?: string } | void
>("products/fetchProducts", async (params, { rejectWithValue }) => {
  try {
    let url = "/products";

    if (params) {
      const queryParams = new URLSearchParams();
      if (params.search) queryParams.set("search", params.search);
      if (params.category && params.category !== "All") {
        queryParams.set("category", params.category);
      }

      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }
    }

    const response = await api.request<any>(url);

    // Handle the correct response structure - response has "items" array
    let productsData: any[] = [];

    if (response.success && Array.isArray(response.items)) {
      productsData = response.items;
    } else if (response.success && Array.isArray(response.data)) {
      productsData = response.data;
    } else if (response.success && Array.isArray((response as any).products)) {
      productsData = (response as any).products;
    } else if (Array.isArray(response)) {
      productsData = response;
    }

    console.log("Fetched products data:", productsData); // Debug log

    // Normalize product data - use retailRate as price, itemName as itemName
    return productsData.map((product) => ({
      id: product._id || product.id || String(Date.now()),
      itemName: product.itemName || product.name || "Unnamed Product", // Fixed: use itemName first
      price: product.retailRate || product.price || 0,
      category: product.category || "Uncategorized",
      lowStock:
        product.lowStock !== undefined
          ? product.lowStock
          : (product.stock || 0) <= 5,
      stock: product.stock || 0,
      _id: product._id,
    })) as Product[];
  } catch (err: any) {
    console.error("Error fetching products:", err);
    return rejectWithValue(err.message || "Failed to fetch products");
  }
});

// Create new product - UPDATED
export const createProduct = createAsyncThunk<Product, Record<string, any>>(
  "products/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      console.log("Sending to API:", productData); // Debug log

      // createProduct — Axios-style: use `data`, don't stringify
      const response = await api.request<any>("/products", {
        method: "POST",
        data: productData,
      });

      console.log("API Response:", response); // Debug log

      const newProduct = response.data || response;

      return {
        id: newProduct._id || String(Date.now()),
        itemName:
          newProduct.itemName || newProduct.name || productData.itemName, // Fixed
        price:
          newProduct.retailRate ||
          newProduct.price ||
          productData.retailRate ||
          0,
        category:
          newProduct.category || productData.category || "Uncategorized",
        lowStock:
          newProduct.lowStock !== undefined
            ? newProduct.lowStock
            : (newProduct.stock || productData.stock || 0) <= 5,
        stock: newProduct.stock || productData.stock || 0,
        _id: newProduct._id,
      } as Product;
    } catch (err: any) {
      console.error("Error creating product:", err);
      return rejectWithValue(err.message || "Failed to create product");
    }
  }
);

// Update product - UPDATED
export const updateProduct = createAsyncThunk<
  Product,
  { id: string; payload: Record<string, any> }
>("products/updateProduct", async ({ id, payload }, { rejectWithValue }) => {
  try {
    const response = await api.request<any>(`/products/${id}`, {
      method: "PUT",
      data: payload,
    });

    const updatedProduct = response.data || response;

    return {
      id: updatedProduct._id || id,
      itemName:
        updatedProduct.itemName || updatedProduct.name || payload.itemName, // Fixed
      price:
        updatedProduct.retailRate ||
        updatedProduct.price ||
        payload.retailRate ||
        0,
      category: updatedProduct.category || payload.category,
      lowStock:
        updatedProduct.lowStock !== undefined
          ? updatedProduct.lowStock
          : (updatedProduct.stock || payload.stock || 0) <= 5,
      stock: updatedProduct.stock || payload.stock || 0,
      _id: updatedProduct._id,
    } as Product;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to update product");
  }
});

// Delete product - UPDATED to use api utility
export const deleteProduct = createAsyncThunk<string, string>(
  "products/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.request<any>(`/products/${id}`, {
        method: "DELETE",
      });

      console.log("Delete response:", response); // Debug log

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
        state.products = action.payload;

        const extractedCategories = extractCategories(action.payload);
        state.categories = ["All", ...extractedCategories];

        if (state.selectedCategory === "All") {
          state.filteredProducts = action.payload;
        } else {
          state.filteredProducts = action.payload.filter(
            (product) => product.category === state.selectedCategory
          );
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create Product
    builder
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);

        if (
          state.selectedCategory === "All" ||
          action.payload.category === state.selectedCategory
        ) {
          state.filteredProducts.push(action.payload);
        }

        if (
          action.payload.category &&
          !state.categories.includes(action.payload.category)
        ) {
          state.categories.push(action.payload.category);
        }
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update Product
    builder
      .addCase(updateProduct.fulfilled, (state, action) => {
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

          if (
            action.payload.category &&
            !state.categories.includes(action.payload.category)
          ) {
            state.categories.push(action.payload.category);
          }
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Delete Product
    builder
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p.id !== action.payload);
        state.filteredProducts = state.filteredProducts.filter(
          (p) => p.id !== action.payload
        );

        const extractedCategories = extractCategories(state.products);
        state.categories = ["All", ...extractedCategories];
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedCategory, addCategory, clearError, resetProducts } =
  productsSlice.actions;

export default productsSlice.reducer;

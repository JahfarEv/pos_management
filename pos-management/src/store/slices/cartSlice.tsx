import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../utils/api";

export interface CartItem {
  product: string;
  name?: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface CartState {
  items: CartItem[];
  total: number;
  loading: boolean;
  error?: string | null;
}

const initialState: CartState = {
  items: [],
  total: 0,
  loading: false,
  error: null,
};


export const fetchCart = createAsyncThunk<
  { items: CartItem[]; total: number }, 
  { userId: string },                   
  { rejectValue: string }              
>("cart/fetchCart", async ({ userId }, { rejectWithValue }) => {
  try {
    const res = await apiClient.get<{ items: CartItem[]; total: number }>(
      `/cart`,
      { userId } as any 
    );
    return res.data ?? { items: [], total: 0 };
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.message ?? err.message ?? "Failed to fetch cart");
  }
});

/* addItem */
export const addItem = createAsyncThunk<
  { items: CartItem[]; total: number }, // Returned
  { userId: string; productId: string; quantity?: number }, // Arg
  { rejectValue: string }
>("cart/addItem", async ({ userId, productId, quantity = 1 }, { rejectWithValue }) => {
  try {
    
    const endpoint = `/cart/items?userId=${encodeURIComponent(userId)}`;
    const res = await apiClient.post<{ items: CartItem[]; total: number }>(endpoint, { productId, quantity });
    return res.data ?? { items: [], total: 0 };
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.message ?? err.message ?? "Failed to add item");
  }
});

/* updateItemQuantity */
export const updateItemQuantity = createAsyncThunk<
  { items: CartItem[]; total: number },
  { userId: string; productId: string; quantity: number },
  { rejectValue: string }
>("cart/updateItem", async ({ userId, productId, quantity }, { rejectWithValue }) => {
  try {
    const endpoint = `/cart/items?userId=${encodeURIComponent(userId)}`;
    const res = await apiClient.put<{ items: CartItem[]; total: number }>(endpoint, { productId, quantity });
    return res.data ?? { items: [], total: 0 };
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.message ?? err.message ?? "Failed to update item");
  }
});

/* removeItem */
export const removeItem = createAsyncThunk<
  { items: CartItem[]; total: number },
  { userId: string; productId: string },
  { rejectValue: string }
>("cart/removeItem", async ({ userId, productId }, { rejectWithValue }) => {
  try {
    const endpoint = `/cart/items/${encodeURIComponent(productId)}?userId=${encodeURIComponent(userId)}`;
    const res = await apiClient.delete<{ items: CartItem[]; total: number }>(endpoint);
    return res.data ?? { items: [], total: 0 };
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.message ?? err.message ?? "Failed to remove item");
  }
});

/* clearCart */
export const clearCart = createAsyncThunk<
  { items: CartItem[]; total: number },
  { userId: string },
  { rejectValue: string }
>("cart/clear", async ({ userId }, { rejectWithValue }) => {
  try {
    const endpoint = `/cart?userId=${encodeURIComponent(userId)}`;
    const res = await apiClient.delete<{ items: CartItem[]; total: number }>(endpoint);
    return res.data ?? { items: [], total: 0 };
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.message ?? err.message ?? "Failed to clear cart");
  }
});

/* checkoutCart */
export const checkoutCart = createAsyncThunk<
  any, // order summary shape — keep `any` or declare a proper type if you have an Order model
  { userId: string },
  { rejectValue: string }
>("cart/checkout", async ({ userId }, { rejectWithValue }) => {
  try {
    const endpoint = `/cart/checkout?userId=${encodeURIComponent(userId)}`;
    const res = await apiClient.post<any>(endpoint, {});
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.message ?? err.message ?? "Checkout failed");
  }
});

/* Slice */
const slice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    resetCart(state) {
      state.items = [];
      state.total = 0;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchCart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items ?? [];
        state.total = action.payload.total ?? 0;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message ?? "Failed to fetch cart";
      })

      // addItem
      .addCase(addItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items ?? [];
        state.total = action.payload.total ?? 0;
      })
      .addCase(addItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message ?? "Failed to add item";
      })

      // updateItemQuantity
      .addCase(updateItemQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateItemQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items ?? [];
        state.total = action.payload.total ?? 0;
      })
      .addCase(updateItemQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message ?? "Failed to update item";
      })

      // removeItem
      .addCase(removeItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items ?? [];
        state.total = action.payload.total ?? 0;
      })
      .addCase(removeItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message ?? "Failed to remove item";
      })

      // clearCart
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items ?? [];
        state.total = action.payload.total ?? 0;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message ?? "Failed to clear cart";
      })

      // checkout
      .addCase(checkoutCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkoutCart.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.total = 0;
      })
      .addCase(checkoutCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message ?? "Checkout failed";
      });
  },
});

export const { resetCart } = slice.actions;
export default slice.reducer;

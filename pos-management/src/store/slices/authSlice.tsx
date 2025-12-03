// // store/slices/authSlice.ts
// import { createSlice } from "@reduxjs/toolkit";
// import type { PayloadAction } from "@reduxjs/toolkit";

// // Define the AuthUser type
// export interface AuthUser {
//   _id: string;
//   id: string;
//   mobile: string;
//   name?: string;
//   email?: string;
//   role?: string;
//   // Add other user properties as needed
//   createdAt?: string;
//   updatedAt?: string;
// }

// interface AuthState {
//   isAuthenticated: boolean;
//   user: AuthUser | null;
//   token: string | null;
//   loading: boolean;
//   error: string | null;
// }

// const initialState: AuthState = {
//   isAuthenticated: false,
//   user: null,
//   token: null,
//   loading: true,
//   error: null,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     setLoading: (state, action: PayloadAction<boolean>) => {
//       state.loading = action.payload;
//     },
//     loginSuccess: (
//       state,
//       action: PayloadAction<{ user: AuthUser; token: string }>
//     ) => {
//       state.isAuthenticated = true;
//       state.user = action.payload.user;
//       state.token = action.payload.token;
//       state.loading = false;
//       state.error = null;
//     },
//     logout: (state) => {
//       state.isAuthenticated = false;
//       state.user = null;
//       state.token = null;
//       state.loading = false;
//       state.error = null;
//     },
//     setError: (state, action: PayloadAction<string>) => {
//       state.error = action.payload;
//       state.loading = false;
//     },
//   },
// });

// export const { setLoading, loginSuccess, logout, setError } = authSlice.actions;
// export default authSlice.reducer;




// store/slices/authSlice.ts (updated)
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Define the AuthUser type
export interface AuthUser {
  _id: string;
  id: string;
  mobile: string;
  name?: string;
  email?: string;
  role?: string;
  // Add other user properties as needed
  createdAt?: string;
  updatedAt?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  // Optional: Add registration-specific state
  registrationSuccess: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: true,
  error: null,
  registrationSuccess: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{ user: AuthUser; token: string }>
    ) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
      state.error = null;
      state.registrationSuccess = false;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      state.registrationSuccess = false;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    // Optional: Add registration success reducer
    registrationSuccess: (state) => {
      state.registrationSuccess = true;
      state.loading = false;
      state.error = null;
    },
    // Optional: Clear registration state
    clearRegistrationState: (state) => {
      state.registrationSuccess = false;
      state.error = null;
    },
  },
});

export const { 
  setLoading, 
  loginSuccess, 
  logout, 
  setError,
  registrationSuccess,  // Optional
  clearRegistrationState // Optional
} = authSlice.actions;

export default authSlice.reducer;
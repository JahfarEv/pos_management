
// import { useCallback, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import type { RootState } from "../store";
// import { loginSuccess, logout as logoutAction, setLoading } from "../store/slices/authSlice";
// import type { AuthUser } from "../store/slices/authSlice";
// import apiClient, { setAuthToken } from "../utils/api";

// interface LoginResponse {
//   user: AuthUser;
//   token: string;
// }

// export const useAuthState = () => useSelector((s: RootState) => s.auth);

// export const useAuth = () => {
//   const dispatch = useDispatch();

//   // Initialize auth state from localStorage
//   const initializeAuth = useCallback(() => {
//     dispatch(setLoading(true));
    
//     try {
//       const token = localStorage.getItem("authToken");
//       const userStr = localStorage.getItem("authUser");
      
//       if (token && userStr) {
//         const user = JSON.parse(userStr);
//         setAuthToken(token);
//         dispatch(loginSuccess({ user, token }));
//       }
//     } catch (error) {
//       console.error("Failed to initialize auth:", error);
//     } finally {
//       dispatch(setLoading(false));
//     }
//   }, [dispatch]);

//   const login = useCallback(
//     async (user: AuthUser, token: string) => {
//       // Store in localStorage
//       localStorage.setItem("authToken", token);
//       localStorage.setItem("authUser", JSON.stringify(user));
      
//       setAuthToken(token);
//       dispatch(loginSuccess({ user, token }));
//     },
//     [dispatch]
//   );

//   const logout = useCallback(() => {
//     // Clear localStorage
//     localStorage.removeItem("authToken");
//     localStorage.removeItem("authUser");
    
//     setAuthToken(null);
//     dispatch(logoutAction());
//   }, [dispatch]);

//   const loginWithMobile = useCallback(
//     async (mobile: string, password?: string) => {
//       try {
//         const payload = password ? { mobile, password } : { mobile };

//         const res = await apiClient.post<LoginResponse>("/auth/login", payload);

//         if (!res || !res.success || !res.data) {
//           throw new Error(res?.message || "Login failed: invalid server response");
//         }

//         const { user, token } = res.data;

//         // Use the login function which handles localStorage
//         await login(user, token);

//         return { user, token };
//       } catch (err: any) {
//         console.error("loginWithMobile error:", err);
//         if (err?.response) {
//           console.error("server response:", err.response.status, err.response.data);
//           throw new Error(err.response.data?.message || `HTTP ${err.response.status}`);
//         }
//         throw new Error(err?.message || "Login failed");
//       }
//     },
//     [dispatch, login]
//   );

//   // Initialize auth on mount
//   useEffect(() => {
//     initializeAuth();
//   }, [initializeAuth]);

//   return { 
//     login, 
//     logout, 
//     loginWithMobile,
//     initializeAuth 
//   };
// };








import { useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store";
import { loginSuccess, logout as logoutAction, setLoading } from "../store/slices/authSlice";
import type { AuthUser } from "../store/slices/authSlice";
import apiClient, { setAuthToken } from "../utils/api";

interface LoginResponse {
  user: AuthUser;
  token: string;
}

interface RegisterData {
  name: string;
  mobile: string;
  password: string;
}

interface RegisterResponse {
  user: Omit<AuthUser, "password">;
  message: string;
}

export const useAuthState = () => useSelector((s: RootState) => s.auth);

export const useAuth = () => {
  const dispatch = useDispatch();

  // Initialize auth state from localStorage
  const initializeAuth = useCallback(() => {
    dispatch(setLoading(true));
    
    try {
      const token = localStorage.getItem("authToken");
      const userStr = localStorage.getItem("authUser");
      
      if (token && userStr) {
        const user = JSON.parse(userStr);
        setAuthToken(token);
        dispatch(loginSuccess({ user, token }));
      }
    } catch (error) {
      console.error("Failed to initialize auth:", error);
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const login = useCallback(
    async (user: AuthUser, token: string) => {
      // Store in localStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem("authUser", JSON.stringify(user));
      
      setAuthToken(token);
      dispatch(loginSuccess({ user, token }));
    },
    [dispatch]
  );

  const logout = useCallback(() => {
    // Clear localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    
    setAuthToken(null);
    dispatch(logoutAction());
  }, [dispatch]);

  const loginWithMobile = useCallback(
    async (mobile: string, password?: string) => {
      try {
        const payload = password ? { mobile, password } : { mobile };

        const res = await apiClient.post<LoginResponse>("/auth/login", payload);

        if (!res || !res.success || !res.data) {
          throw new Error(res?.message || "Login failed: invalid server response");
        }

        const { user, token } = res.data;

        // Use the login function which handles localStorage
        await login(user, token);

        return { user, token };
      } catch (err: any) {
        console.error("loginWithMobile error:", err);
        if (err?.response) {
          console.error("server response:", err.response.status, err.response.data);
          throw new Error(err.response.data?.message || `HTTP ${err.response.status}`);
        }
        throw new Error(err?.message || "Login failed");
      }
    },
    [login]
  );

  const register = useCallback(
    async (data: RegisterData) => {
      try {
        // Validate input
        if (!data.name?.trim()) {
          throw new Error("Name is required");
        }

        if (!data.mobile) {
          throw new Error("Mobile number is required");
        }

        if (!data.password) {
          throw new Error("Password is required");
        }

        if (data.password.length < 6) {
          throw new Error("Password must be at least 6 characters long");
        }

        // Call registration API
        const res = await apiClient.post<RegisterResponse>("/auth/register", {
          name: data.name.trim(),
          mobile: data.mobile,
          password: data.password,
        });

        if (!res || !res.success || !res.data) {
          throw new Error(res?.message || "Registration failed: invalid server response");
        }

        // Optionally auto-login after registration
        // You can choose to automatically login the user or just return success
        // Here I'm returning the user data without auto-login
        return {
          success: true,
          user: res.data.user,
          message: res.data.message || "Registration successful",
        };
      } catch (err: any) {
        console.error("Registration error:", err);
        if (err?.response) {
          console.error("server response:", err.response.status, err.response.data);
          throw new Error(err.response.data?.message || `HTTP ${err.response.status}`);
        }
        throw new Error(err?.message || "Registration failed");
      }
    },
    []
  );

  // Auto-login after registration (optional helper function)
  const registerAndLogin = useCallback(
    async (data: RegisterData) => {
      try {
        // First register
        const registerResult = await register(data);
        
        // Then login with the same credentials
        const loginResult = await loginWithMobile(data.mobile, data.password);
        
        return {
          ...registerResult,
          token: loginResult.token,
        };
      } catch (err: any) {
        console.error("Register and login error:", err);
        throw err;
      }
    },
    [register, loginWithMobile]
  );

  // Initialize auth on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return { 
    login, 
    logout, 
    loginWithMobile,
    register,
    registerAndLogin, // Optional: if you want auto-login after registration
    initializeAuth 
  };
};
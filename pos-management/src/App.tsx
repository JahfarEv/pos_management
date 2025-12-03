import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";

// Components
import LoginPage from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { PublicRoute } from "./components/auth/PublicRoute";
import { useAuth } from "./hooks/useAuth";
import LoadingSpinner from "./components/common/Spinner";
import { useAppSelector } from "./store/hooks";
import RegistrationPage from "./components/auth/Registration";

const App: React.FC = () => {
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);
  const { initializeAuth } = useAuth();

  // Initialize authentication state on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Show loading while checking auth status
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <Routes>
        {/* Public route - Login */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegistrationPage />
            </PublicRoute>
          }
        />

        {/* Protected route - Dashboard */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>

      <Toaster
        position="top-right"
        richColors
        closeButton
        expand={false}
        duration={2000}
      />
    </>
  );
};

export default App;

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useAppSelector } from "../store/hooks";

const PHONE_REGEX = /^[6-9]\d{9}$/;

const LoginPage: React.FC = () => {
  const { loginWithMobile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const from = location.state?.from?.pathname || "/";

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!PHONE_REGEX.test(emailOrPhone)) {
        throw new Error("Please enter a valid mobile number (10 digits)");
      }

      const { user } = await loginWithMobile(emailOrPhone, password);

      console.log("Logged in user:", user);
      // Navigation will happen in the useEffect above
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center p-6">
      <div className="absolute top-8 left-8 text-3xl font-bold text-blue-800">
        THIJAR
      </div>

      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Welcome Back
          </h2>
          <p className="text-blue-800 text-lg font-medium">
            Log in to your POS
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl text-sm bg-red-100 border border-red-300 text-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-900 text-base font-semibold mb-3">
              Mobile Number
            </label>
            <input
              type="text"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              className="w-full py-3 px-4 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Enter your mobile number"
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <label className="block text-gray-900 text-base font-semibold mb-3">
              Password (if required)
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-3 px-4 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Enter password (if needed)"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-700"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold py-4 px-4 rounded-xl transition-colors text-lg shadow-lg disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                Signing in...
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Registration Link Added Here */}
        <div className="mt-8 text-center">
          <p className="text-gray-700">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-800 font-semibold hover:text-blue-900 hover:underline"
            >
              Create new account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

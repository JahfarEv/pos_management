import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useAppSelector } from "../../store/hooks";

const PHONE_REGEX = /^[6-9]\d{9}$/;
const PASSWORD_MIN_LENGTH = 6;

const RegistrationPage: React.FC = () => {
  const { register } = useAuth(); 
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const from = location.state?.from?.pathname || "/";

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

 // In RegistrationPage.tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setSuccess("");
  setIsLoading(true);

  try {
    // Validation
    if (!name.trim()) {
      throw new Error("Please enter your name");
    }

    if (!PHONE_REGEX.test(mobileNumber)) {
      throw new Error("Please enter a valid mobile number (10 digits starting with 6-9)");
    }

    if (password.length < PASSWORD_MIN_LENGTH) {
      throw new Error(`Password must be at least ${PASSWORD_MIN_LENGTH} characters long`);
    }

    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }

    // Call registration API - FIXED HERE
    const result = await register({
      name: name.trim(),
      mobile: mobileNumber, // Changed from mobileNumber to mobile
      password,
    });

    console.log("Registration successful:", result);
    setSuccess("Registration successful! You can now login with your credentials.");
    
    // Optionally auto-login or redirect to login after a delay
    setTimeout(() => {
      navigate("/login");
    }, 2000);

  } catch (err: any) {
    console.error("Registration error:", err);
    setError(err?.message || "Registration failed. Please try again.");
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
            Create Account
          </h2>
          <p className="text-blue-800 text-lg font-medium">
            Join our POS platform
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl text-sm bg-red-100 border border-red-300 text-red-800">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-xl text-sm bg-green-100 border border-green-300 text-green-800">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-900 text-base font-semibold mb-3">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full py-3 px-4 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Enter your full name"
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <label className="block text-gray-900 text-base font-semibold mb-3">
              Mobile Number
            </label>
            <input
              type="text"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              className="w-full py-3 px-4 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Enter your mobile number"
              disabled={isLoading}
              required
            />
            <p className="mt-2 text-sm text-gray-500">
              Must be 10 digits starting with 6-9
            </p>
          </div>

          <div>
            <label className="block text-gray-900 text-base font-semibold mb-3">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-3 px-4 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Enter password"
                disabled={isLoading}
                required
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
            <p className="mt-2 text-sm text-gray-500">
              Must be at least {PASSWORD_MIN_LENGTH} characters long
            </p>
          </div>

          <div>
            <label className="block text-gray-900 text-base font-semibold mb-3">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full py-3 px-4 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Confirm your password"
                disabled={isLoading}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-700"
                disabled={isLoading}
              >
                {showConfirmPassword ? <EyeOff /> : <Eye />}
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
                Creating Account...
              </div>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-700">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-800 font-semibold hover:text-blue-900 hover:underline"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
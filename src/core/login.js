import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../components/button.js";
import Header from "../components/header.js";
import { useAuthStore } from "../store/useAuthStore.js";

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoggingIn } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // New state for password expiry message
  const [passwordExpired, setPasswordExpired] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError({});
    setPasswordExpired(false);  // reset on each attempt

    if (!email || !password) {
      setError({
        email: !email ? "Email is required" : "",
        password: !password ? "Password is required" : "",
      });
      return;
    }

    try {
      const response = await login({ email, password });

      if (response?.mfaRequired) {
        toast.info("Verification code sent to your email.");
        navigate("/verify-mfa", { state: { email } });
      } else if (response?.token) {
        toast.success("Login successful!");
        navigate("/chat");
      } else {
        const msg = response?.message?.toLowerCase() || "";
        const newErrors = {};

        if (msg.includes("password expired")) {
          // Instead of navigating directly, show the message & button
          setPasswordExpired(true);
        } else if (msg.includes("locked")) {
          newErrors.general = response.message;
          toast.error(response.message);
        } else if (msg.includes("wrong password")) {
          newErrors.password = "Wrong password. Try again.";
          toast.error(newErrors.password);
        } else if (msg.includes("invalid credentials") || msg.includes("user not found")) {
          newErrors.email = "No account with that email. Try again";
          toast.error(newErrors.email);
        } else {
          newErrors.general = "Login failed. Please try again.";
          toast.error(newErrors.general);
        }

        setError(newErrors);
      }
    } catch (err) {
      toast.error(err.message || "Login failed. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 font-open-sans px-4">
        <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md border border-blue-200">
          <h2 className="text-3xl font-bold text-black text-center mb-6">Welcome Back</h2>

          <form onSubmit={handleLogin}>
            {/* Email */}
            <div className="mb-5">
              <label htmlFor="email" className="block text-sm font-medium text-black mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className={`w-full px-4 py-2 border ${
                  error.email ? "border-red-500" : "border-blue-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {error.email && <p className="text-red-500 text-sm mt-1">{error.email}</p>}
            </div>

            {/* Password */}
            <div className="mb-5 relative">
              <label htmlFor="password" className="block text-sm font-medium text-black mb-1">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className={`w-full px-4 py-2 border ${
                  error.password ? "border-red-500" : "border-blue-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-blue-500 text-sm"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
              {error.password && <p className="text-red-500 text-sm mt-1">{error.password}</p>}
            </div>

            {/* Password expired message with reset button */}
            {passwordExpired && (
              <div className="mb-5 flex items-center text-xs justify-between bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
                <span>Your password has expired. Please reset your password.</span>
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password", { state: { email } })}
                  className="bg-red-500 hover:bg-red-600 text-white px-5 py-1 text-xs rounded"
                >
                  Reset Password
                </button>
              </div>
            )}

            {error.general && (
              <p className="text-red-600 text-center mb-4 font-semibold">{error.general}</p>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold shadow"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          {/* Forgot Password */}
          <div className="text-center mt-4">
            <button
              onClick={() => navigate("/forgot-password")}
              className="text-black hover:underline text-sm"
            >
              Forgot your password?
            </button>
          </div>

          {/* Sign Up */}
          <p className="mt-6 text-sm text-gray-700 text-center">
            Don’t have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-blue-700 font-semibold hover:underline"
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;

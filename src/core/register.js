import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../components/header.js";
import { useAuthStore } from "../store/useAuthStore.js";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState({});
  const { signup, isSigningUp } = useAuthStore();
 const navigate = useNavigate(); 
  const validateForm = () => {
  const errors = {};

  if (!formData.fullName.trim()) errors.fullName = "Full Name is required";

  if (!formData.email.trim()) errors.email = "Email is required";
  else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Invalid email format";

  if (!formData.password) {
    errors.password = "Password is required";
  } else {
    if (formData.password.length < 8)
      errors.password = "Password must be at least 8 characters";
    else if (formData.password.length > 64)
      errors.password = "Password must be at most 64 characters";
    else {
      if (!/[A-Z]/.test(formData.password))
        errors.password = "Password must contain at least one uppercase letter";
      else if (!/[a-z]/.test(formData.password))
        errors.password = "Password must contain at least one lowercase letter";
      else if (!/\d/.test(formData.password))
        errors.password = "Password must contain at least one digit";
      else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password))
        errors.password = "Password must contain at least one special character";
    }
  }

  setError(errors);
  return Object.keys(errors).length === 0;
};

const handleSubmit = async (e) => {
  e.preventDefault();
  if (validateForm()) {
    const result = await signup(formData);

    if (result?.success) {
      navigate("/login-customer");
    } else {
      // New: Handle email already exists error from backend
      if (result?.message?.toLowerCase().includes("email already exists") || 
          result?.message?.toLowerCase().includes("email is already registered")) {
        setError((prev) => ({ ...prev, email: "This email is already registered" }));
      } else if(result?.message) {
        // General error if needed
        toast.error(result.message);
      }
    }
  }
};


  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 font-open-sans px-4">
        <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md border border-blue-200">
          <h2 className="text-3xl font-bold text-blue-800 text-center mb-6">
            Create Your Account
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="mb-4">
              <label htmlFor="fullName" className="block text-sm font-medium text-blue-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                className={`w-full px-4 py-2 border ${
                  error.fullName ? "border-red-500" : "border-blue-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400`}
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
              {error.fullName && <p className="text-red-500 text-sm mt-1">{error.fullName}</p>}
            </div>

            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-blue-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className={`w-full px-4 py-2 border ${
                  error.email ? "border-red-500" : "border-blue-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400`}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              {error.email && <p className="text-red-500 text-sm mt-1">{error.email}</p>}
            </div>

            {/* Password */}
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-blue-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                className={`w-full px-4 py-2 border ${
                  error.password ? "border-red-500" : "border-blue-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400`}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              {error.password && <p className="text-red-500 text-sm mt-1">{error.password}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSigningUp}
              className={`w-full py-2 font-semibold rounded-lg transition duration-300 ${
                isSigningUp
                  ? "bg-blue-300 cursor-not-allowed text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {isSigningUp ? "Signing Up..." : "Sign Up"}
            </button>
          </form>

          {/* Sign In Redirect */}
          <p className="text-sm text-center text-gray-700 mt-5">
            Already have an account?{" "}
            <Link
              to="/login-customer"
              className="text-blue-700 hover:underline font-semibold"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;

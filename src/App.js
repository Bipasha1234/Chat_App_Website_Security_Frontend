import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";

import AdminDashboardComponent from "./core/admin/adminDashboard.js";
import PasswordReset from "./core/forgot-password.js";
import Home from "./core/home.js";
import Login from "./core/login.js";
import Register from "./core/register.js";
import Chat from "./core/user/chat.js";
import GroupChat from "./core/user/groupChat.js";
import ProfilePage from "./core/user/profile.js";
import Settings from "./core/user/settings.js";
import VerifyMfa from "./core/verifyMfa.js";
import { axiosInstance } from "./lib/axios.js";
import { useAuthStore } from "./store/useAuthStore.js";

// Replace with your Stripe test publishable key
const stripePromise = loadStripe(
  "pk_test_51Rp7ijEa2SJUqRgbuDZDNaaA617B1Da5ErS8FJGXH3CTlNr2c8KtUgbG188DVKHeaU9FbRjIp9hHVJ6ckj1zx8Lt00eytPJekh"
);

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    // Fetch CSRF token on load
    const fetchCsrfToken = async () => {
      try {
        const res = await axiosInstance.get("/csrf-token");
        setCsrfToken(res.data.csrfToken);
        axiosInstance.defaults.headers.common["X-CSRF-Token"] = res.data.csrfToken;
        console.log("CSRF Token set:", res.data.csrfToken);
      } catch (err) {
        console.error("CSRF token fetch failed", err.message);
      }
    };

    fetchCsrfToken();
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        {/* Optional loading spinner */}
      </div>
    );

  return (
    <Elements stripe={stripePromise}>
      <Routes>
        <Route
          path="/"
          element={
            !authUser ? (
              <Home />
            ) : authUser.role === "admin" ? (
              <Navigate to="/admin-dashboard" replace />
            ) : (
              <Navigate to="/chat" replace />
            )
          }
        />
        <Route path="/forgot-password" element={<PasswordReset />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/login"
          element={
            !authUser ? (
              <Login />
            ) : authUser.role === "admin" ? (
              <Navigate to="/admin-dashboard" replace />
            ) : (
              <Navigate to="/chat" replace />
            )
          }
        />
        <Route
          path="/verify-mfa"
          element={
            !authUser ? (
              <VerifyMfa />
            ) : authUser.role === "admin" ? (
              <Navigate to="/admin-dashboard" replace />
            ) : (
              <Navigate to="/chat" replace />
            )
          }
        />
        <Route path="/chat" element={authUser ? <Chat /> : <Navigate to="/login" replace />} />
        <Route path="/group/chat" element={authUser ? <GroupChat /> : <Navigate to="/login" replace />} />
        <Route path="/user/profile-setup" element={authUser ? <ProfilePage /> : <Navigate to="/login" replace />} />
        <Route path="/settings" element={authUser ? <Settings /> : <Navigate to="/login" replace />} />
        <Route
          path="/admin-dashboard"
          element={
            authUser?.role === "admin" ? (
              <AdminDashboardComponent />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Elements>
  );
}

export default AppWrapper;

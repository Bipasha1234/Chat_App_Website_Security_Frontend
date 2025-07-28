import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
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
import { useAuthStore } from "./store/useAuthStore.js";

// Replace with your test publishable key
const stripePromise = loadStripe("pk_test_51Rp7ijEa2SJUqRgbuDZDNaaA617B1Da5ErS8FJGXH3CTlNr2c8KtUgbG188DVKHeaU9FbRjIp9hHVJ6ckj1zx8Lt00eytPJekh");

function App() {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();

  console.log({ onlineUsers });

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser });

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
      
      </div>
    );

 return (
  <Router>
    <Elements stripe={stripePromise}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/forgot-password" element={<PasswordReset />} />
        <Route path="/register" element={<Register />} />
        <Route
  path="/login"
  element={
    !authUser ? (
      <Login />
    ) : authUser.role === "admin" ? (
      <Navigate to="/admin-dashboard" />
    ) : (
      <Navigate to="/chat" />
    )
  }
/>
<Route
  path="/verify-mfa"
  element={
    !authUser ? (
      <VerifyMfa />
    ) : authUser.role === "admin" ? (
      <Navigate to="/admin-dashboard" />
    ) : (
      <Navigate to="/chat" />
    )
  }
/>
        <Route path="/chat" element={authUser ? <Chat /> : <Navigate to="/login" />} />
        <Route path="/group/chat" element={authUser ? <GroupChat /> : <Navigate to="/login" />} />
        <Route path="/user/profile-setup" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="/settings" element={authUser ? <Settings /> : <Navigate to="/login" />} />
        <Route path="/admin-dashboard" element={authUser ? <AdminDashboardComponent /> : <Navigate to="/login" />} />
      </Routes>
    </Elements>
  </Router>
);

}

export default App;
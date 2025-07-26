import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
const BASE_URL = process.env.NODE_ENV === "development"
  ? "http://localhost:4000"
  : "/";


export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,
  messages: [],  // Store messages
  latestMessage: null, 
  isResettingPassword: false, // Track if the password reset request is in progress
  isPasswordReset: false,     // Track if the password reset was successful
  isCodeVerified: false,      // Track if the reset code has been verified
  errorMessage: "",           // Store any error messages

  // Forgot password - Sends a reset code to the user's email
  forgotPassword: async (email) => {
    set({ isResettingPassword: true });
    try {
      await axiosInstance.post("/auth/forgot-password", { email });
      toast.success("Password reset code sent to your email.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error sending reset code.");
    } finally {
      set({ isResettingPassword: false });
    }
  },

  // Reset password - Verifies the reset code and changes the password
  resetPassword: async (email, password) => {
    set({ isResettingPassword: true });
    try {
      await axiosInstance.post("/auth/reset-password", { email, password });
      toast.success("Password reset successful.");
      set({ isPasswordReset: true }); // Set the flag to true indicating the password reset was successful
    } catch (error) {
      toast.error(error.response?.data?.message || "Error resetting password.");
    } finally {
      set({ isResettingPassword: false });
    }
  },

  // Verify reset code - Verify the code entered by the user
  verifyResetCode: async (email, resetCode) => {
    set({ isResettingPassword: true });
    try {
      // Post to the backend API for code verification
      await axiosInstance.post("/auth/verify-reset-code", { email, resetCode });
      toast.success("Reset code verified successfully.");
      set({ isCodeVerified: true }); // Mark code as verified
    } catch (error) {
      toast.error(error.response?.data?.message || "Error verifying reset code.");
    } finally {
      set({ isResettingPassword: false });
    }
  },

  // Check authentication status
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
  set({ isSigningUp: true });
  try {
    const res = await axiosInstance.post("/auth/register", data);
    toast.success("Account created successfully");
    // Do NOT set authUser here, user needs to log in separately
    return { success: true };
  } catch (error) {
    toast.error(error.response?.data?.message || "Signup failed");
    return { success: false };
  } finally {
    set({ isSigningUp: false });
  }
},



  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({
        authUser: null,
        messages: [],  // Clear messages on logout
        onlineUsers: [],  // Clear online users on logout
      });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

 login: async (data) => {
  set({ isLoggingIn: true });
  try {
    const res = await axiosInstance.post("/auth/login", data);
    // set({ authUser: res.data });
    toast.success("Logged in successfully");
    get().connectSocket();
    return res.data;  // Return success data
  } catch (error) {
    // Return error info so frontend can handle it
    const errorMsg = error.response?.data?.message || "Login failed";
    toast.error(errorMsg);
    return { message: errorMsg };  // Return an object with message
  } finally {
    set({ isLoggingIn: false });
  }
},

verifyMfa: async ({ email, code }) => {
  set({ isLoggingIn: true });
  try {
    // Assuming your backend expects { email, code } and returns user info + token on success
    const res = await axiosInstance.post("/auth/verify-mfa", { email, code });
    set({ authUser: res.data });
    toast.success("MFA verification successful");
    get().connectSocket();
    return res.data;
  } catch (error) {
    const errorMsg = error.response?.data?.message || "MFA verification failed";
    toast.error(errorMsg);
    return { message: errorMsg };
  } finally {
    set({ isLoggingIn: false });
  }
},
  // forgotPassword: async (email) => {
  //   try {
  //     const res = await axiosInstance.post("/auth/forgot-password", { email });
  //     toast.success("Verification code sent to your email.");
  //   } catch (error) {
  //     toast.error(error.response?.data?.message || "Error sending verification code.");
  //   }
  // },
  
  
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
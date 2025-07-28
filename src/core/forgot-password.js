import { useState } from "react";
import { toast } from "react-hot-toast";
import Header from "../components/header";
import { useAuthStore } from "../store/useAuthStore";

const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
 const [reuseError, setReuseError] = useState("");
  const { 
    isResettingPassword, 
    isPasswordReset, 
    isCodeVerified, 
    forgotPassword, 
    resetPassword, 
    verifyResetCode 
  } = useAuthStore();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }
    await forgotPassword(email);
    setIsCodeSent(true);
  };

  const handleVerifyCode = async () => {
    if (!resetCode) {
      toast.error("Please enter the reset code.");
      return;
    }
    await verifyResetCode(email, resetCode);
  };

 

const handleSubmit = async (e) => {
  e.preventDefault();
  setReuseError("");

  if (!newPassword) {
    toast.error("Please enter a new password.");
    return;
  }
  if (isCodeVerified) {
    const result = await resetPassword(email, newPassword);
    if (!result.success) {
      if (result.message.toLowerCase().includes("reuse")) {
        setReuseError("You cannot reuse the same password from the last 5 times. Please choose a new password.");
      } else {
        toast.error(result.message || "Failed to reset password.");
      }
    }
  } else {
    toast.error("Please verify the reset code first.");
  }
};

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200 font-open-sans px-4">
        <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md border border-blue-300">
          <h2 className="text-3xl font-bold text-black text-center mb-2">
            Password Reset
          </h2>

          {!isCodeSent ? (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <p className="text-sm font-medium text-center text-black ">
                Enter your email to receive a reset code
              </p>

              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

              <button
                type="submit"
                disabled={isResettingPassword}
                className={`w-full py-2 font-semibold rounded-lg text-white transition duration-300 ${
                  isResettingPassword
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isResettingPassword ? "Sending..." : "Send Reset Code"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <p className="text-sm font-medium text-center text-black mb-4">
                Enter the reset code sent to your email and your new password
              </p>

              <input
                type="text"
                placeholder="Reset Code"
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value)}
                required
                className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="button"
                onClick={handleVerifyCode}
                disabled={isResettingPassword || isCodeVerified}
                className={`w-full py-2 font-semibold rounded-lg text-white transition duration-300 ${
                  isResettingPassword || isCodeVerified
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isResettingPassword ? "Verifying..." : "Verify Reset Code"}
              </button>
              {isCodeVerified && (
                <p className="text-green-700 text-center text-sm">Reset code verified successfully!</p>
              )}

              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

              {reuseError && (
  <p className="text-red-600 text-center mb-2 font-normal text-xs">{reuseError}</p>
)}

              <button
                type="submit"
                disabled={isResettingPassword || !isCodeVerified}
                className={`w-full py-2 font-semibold rounded-lg text-white transition duration-300 ${
                  isResettingPassword || !isCodeVerified
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isResettingPassword ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}

          {isPasswordReset && (
            <p className="text-green-700 text-center mt-4 text-sm font-semibold">
              Password has been reset successfully!
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default PasswordReset;

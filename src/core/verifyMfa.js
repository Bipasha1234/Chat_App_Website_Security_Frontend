import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthStore } from "../store/useAuthStore";

const VerifyMfa = () => {
  const { verifyMfa, setAuthUser, isLoggingIn } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || "";
  const [mfaCode, setMfaCode] = useState("");
  const [error, setError] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({});

    if (!mfaCode) {
      setError({ mfaCode: "Verification code is required" });
      return;
    }

    const response = await verifyMfa({ email, code: mfaCode });
    if (response?.token && response?.user) {
      toast.success("MFA verification successful");

      // Update global auth state here
      setAuthUser(response.user);

      // No manual navigation here! App component handles routing based on authUser role
    } else {
      setError({ general: response?.message || "Invalid verification code" });
      toast.error(response?.message || "Invalid verification code");
    }
  };

  if (!email) {
    navigate("/login");
    return null;
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4 font-open-sans">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md border border-blue-200">
        <h2 className="text-2xl font-bold text-black text-center mb-6">
          Verify MFA Code
        </h2>
        <form onSubmit={handleSubmit}>
          <label
            htmlFor="mfaCode"
            className="block text-sm font-medium text-black mb-2"
          >
            Verification Code
          </label>
          <input
            type="text"
            id="mfaCode"
            maxLength={6}
            value={mfaCode}
            onChange={(e) => setMfaCode(e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              error.mfaCode ? "border-red-500" : "border-blue-300"
            }`}
            placeholder="Enter 6-digit code"
          />
          {error.mfaCode && (
            <p className="text-red-500 text-sm mt-1">{error.mfaCode}</p>
          )}

          {error.general && (
            <p className="text-red-600 text-center mt-4 font-semibold">
              {error.general}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoggingIn}
            className={`mt-6 w-full py-2 font-semibold rounded-lg transition duration-300 text-white ${
              isLoggingIn
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoggingIn ? "Verifying..." : "Verify"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyMfa;

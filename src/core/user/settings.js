import { ChevronRight, UserX, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatContainer from "../../components/ChatContainer";
import HeaderNav from "../../components/HeaderNav";
import NoChatSelected from "../../components/NoChatSelected";
import { useAuthStore } from "../../store/useAuthStore";
import { useChatStore } from "../../store/useChatStore";

const Settings = () => {
  const { blockedUsers, getBlockedUsers, unblockUser, selectedUser } = useChatStore();
  const { logout } = useAuthStore();
  const [activePanel, setActivePanel] = useState("settings");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlockedUsers = async () => {
      await getBlockedUsers();
    };
    fetchBlockedUsers();
  }, []);

  const handleUnblock = async (userId) => {
    await unblockUser(userId);
    await getBlockedUsers();
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex flex-col h-screen font-open-sans bg-gray-100">
      {/* Header at the top */}
      <HeaderNav active="Settings" />

      {/* Main Content: split horizontally */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        <div className="shadow px-5 border-r border-gray-300 py-8 w-80 bg-white h-full overflow-y-auto">
          {activePanel === "settings" && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Settings</h2>

              {/* Blocked Accounts Option */}
              <div
                className="mt-4 flex items-center justify-between cursor-pointer transition hover:bg-gray-100 p-2 rounded"
                onClick={() => setActivePanel("blocked")}
              >
                <div className="flex items-center gap-4">
                  <UserX size={22} className="text-red-600" />
                  <h3 className="text-base font-medium text-red-600">Blocked Accounts</h3>
                </div>
                <ChevronRight size={22} />
              </div>

              {/* Logout Button */}
              <div className="mt-6 flex items-center justify-center">
                <button
                  onClick={handleLogout}
                  className="bg-red-600 w-28 py-2 px-4 text-white flex items-center justify-center font-medium rounded-md shadow-md hover:bg-red-700"
                >
                  Logout
                </button>
              </div>



              {/* Forgot Password Button */}
        <div className="mt-4 flex items-center justify-center">
          <button
            onClick={() => navigate("/forgot-password")}
            className="bg-blue-600 w-40 py-2 px-4 text-white flex items-center justify-center font-medium rounded-md shadow-md hover:bg-blue-700"
          >
            Forgot Password
          </button>
        </div>

            </div>
          )}

          {/* Blocked Users Panel */}
          {activePanel === "blocked" && (
            <div className="relative">
              <button
                onClick={() => setActivePanel("settings")}
                className="absolute right-4"
              >
                <X size={24} />
              </button>

              <h3 className="text-lg font-semibold text-red-600 mb-6">Blocked Users</h3>

              {blockedUsers.length === 0 ? (
                <p className="text-base">No blocked users.</p>
              ) : (
                <ul className="space-y-4">
                  {blockedUsers.map((user) => (
                    <li
                      key={user._id}
                      className="flex items-center justify-between p-4 rounded-md bg-gray-100 shadow hover:bg-gray-200 transition"
                    >
                      <span className="font-medium">{user.fullName || "Unknown User"}</span>
                      <button
                        onClick={() => handleUnblock(user._id)}
                        className="bg-red-600 text-white text-sm px-3 py-1 rounded-md hover:bg-red-700"
                      >
                        Unblock
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Right Panel (Chat Area) */}
        <div className="flex-[2] bg-white">
          <div className="w-full h-full shadow-md">
            <div className="flex h-full overflow-hidden">
              {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

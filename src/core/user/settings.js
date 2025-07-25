import { ChevronRight, UserX, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatContainer from "../../components/ChatContainer";
import NoChatSelected from "../../components/NoChatSelected";
import SideBar from "../../components/SideBar";
import { useAuthStore } from "../../store/useAuthStore";
import { useChatStore } from "../../store/useChatStore";

const Settings = () => {
  const { blockedUsers, getBlockedUsers, unblockUser } = useChatStore();
  const { logout } = useAuthStore();
  const { selectedUser } = useChatStore();
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
    navigate("/login-customer");
  };

  return (
    <div className="flex font-open-sans h-screen bg-gray-100">
      {/* Sidebar */}
      <SideBar active="Settings" />

      {/* Left Panel */}
      <div className="shadow px-5 border-r border-gray-300 py-8 w-80 bg-white h-full">
        {activePanel === "settings" && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Settings</h2>

            {/* Blocked Accounts Option */}
            <div
              className="mt-4 flex items-center justify-between cursor-pointer transition"
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
                className="bg-red-600 w-28 py-1 px-3 text-white flex items-center justify-center font-medium rounded-md shadow-md"
              >
                Logout
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
                      className="bg-red-600 text-white text-sm px-3 py-1 rounded-md"
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
      <div className="flex-[3] bg-white">
        <div className="w-full h-full shadow-md">
          <div className="flex h-full overflow-hidden">
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

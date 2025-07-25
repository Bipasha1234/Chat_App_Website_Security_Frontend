import { ChevronRight, Palette, UserX, X } from "lucide-react";
import { useEffect, useState } from "react";
import ChatContainer from "../../components/ChatContainer";
import NoChatSelected from "../../components/NoChatSelected";
import SideBar from "../../components/SideBar";
import { useAuthStore } from "../public/store/useAuthStore";
import { useChatStore } from "../public/store/useChatStore";
import { useThemeStore } from "../public/store/useThemeStore";

const Settings = () => {
  const { blockedUsers, getBlockedUsers, unblockUser } = useChatStore();
  const { logout } = useAuthStore();

  const { selectedUser } = useChatStore();
  const { theme, setTheme } = useThemeStore();
  const [activePanel, setActivePanel] = useState("settings");

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
    <div className={`flex font-open-sans h-screen ${theme === "dark" ? "" : "bg-gray-100"}`}>
      {/* Sidebar */}
      <SideBar active="Settings" />

      {/* Left Panel */}
      
      <div
          className={`shadow px-5 border-r border-base-300 py-8 w-80  ${theme === "dark" ? " text-white" : "bg-opacity-60 bg-white"} h-full`}
        >
        {/* Main Settings Panel */}
        {activePanel === "settings" && (
          <div>
            <h2 className="text-xl font-semibold  mb-6">Settings</h2>

            {/* Theme Option */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Palette size={22} className="text-primary" />
                <h3 className="text-base font-medium ">Change Theme</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-base-content">Light</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    onChange={(e) => setTheme(e.target.checked ? "dark" : "light")}
                  />
                  <div className="w-14 h-7 bg-gray-500 dark:bg-gray-600 rounded-full transition-colors">
                    <div
                      className="w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out"
                      data-theme="light"
                      style={{
                        transform: `translateX(${theme === "dark" ? "100%" : "0%"})`,
                      }}
                    />
                  </div>
                </label>
                <span className="text-sm text-base-content">Dark</span>
              </div>
            </div>

            {/* Blocked Accounts Option */}
            <div
              className="mt-4 flex items-center justify-between cursor-pointer  transition"
              onClick={() => setActivePanel("blocked")}
            >
              <div className="flex items-center gap-4">
                <UserX size={22} className="text-error" />
                <h3 className="text-base font-medium text-error">Blocked Accounts</h3>
              </div>
              <ChevronRight size={22} className="" />
            </div>

            {/* Logout Button */}
            <div className="mt-6 flex items-center justify-center">
              <button
                onClick={handleLogout}
                className="btn btn-error w-28 py-1 px-3 text-white flex items-center justify-center font-medium rounded-md shadow-lg"
              >
                Logout
              </button>
            </div>
          </div>
        )}

        {/* Blocked Users Panel */}
        {activePanel === "blocked" && (
          <div className="relative">
            {/* Back Button */}
            <button
              onClick={() => setActivePanel("settings")}
              className="absolute right-4  "
            >
              <X size={24} />
            </button>

            <h3 className="text-lg font-semibold text-error mb-6">Blocked Users</h3>

            {blockedUsers.length === 0 ? (
              <p className="text-lg ">No blocked users.</p>
            ) : (
              <ul className="space-y-4">
                {blockedUsers.map((user) => (
                  <li
                    key={user._id}
                    className="flex items-center justify-between p-4 rounded-md bg-base-100 shadow-md hover:bg-base-200 transition"
                  >
                    <span className="font-medium">{user.fullName || "Unknown User"}</span>
                    <button
                      onClick={() => handleUnblock(user._id)}
                      className="btn btn-error btn-sm"
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
      <div className="flex-[3] bg-base-100 ">
        <div className="w-full h-full shadow-lg ">
          <div className="flex h-full overflow-hidden">
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;




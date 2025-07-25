import { useEffect, useState } from "react";
import { FaCog, FaComments, FaUserCircle, FaUsers } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarItems = [
    { id: "Chat", icon: <FaComments size={25} />, label: "Chat", route: "/chat" },
    { id: "Groups", icon: <FaUsers size={25} />, label: "Groups", route: "/group/chat" },
    { id: "Profile", icon: <FaUserCircle size={25} />, label: "Profile", route: "/user/profile-setup" },
    { id: "Settings", icon: <FaCog size={25} />, label: "Settings", route: "/settings" },
  ];

  const [activeTab, setActiveTab] = useState(() => {
    return sidebarItems.find((item) => item.route === location.pathname)?.id || "Chat";
  });

  useEffect(() => {
    const currentTab = sidebarItems.find((item) => item.route === location.pathname)?.id;
    if (currentTab) setActiveTab(currentTab);
  }, [location.pathname]);

  const handleTabClick = (item) => {
    if (activeTab === item.id) return;
    setActiveTab(item.id);
    navigate(item.route);
  };

  return (
    <div className="flex">
      <div className={`w-20 flex flex-col items-center py-6 space-y-8 ${theme === "dark" ? "" : "bg-gray-100"}`}>
        {sidebarItems.map((item) => (
          <div
            key={item.id}
            onClick={() => handleTabClick(item)}
            className={`p-3 rounded-lg cursor-pointer transition-all duration-200
              ${activeTab === item.id 
                ? theme === "light" 
                  ? "bg-[#6cbfa3] text-white border-l-4 border-green-700 shadow-md" 
                  : theme === "dark"
                  ? "bg-black text-white border-l-4 border-gray-600 shadow-md"
                  : "bg-emerald-500 text-white border-l-4 border-emerald-700 shadow-md"
                : theme === "light" 
                  ? "hover:bg-[#c8e3da] text-base-content" 
                  : theme === "dark"
                  ? "hover:bg-gray-700 text-base-content"
                  : "hover:bg-emerald-100 text-base-content"
              }`}
            title={item.label}
          >
            {item.icon}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideBar;

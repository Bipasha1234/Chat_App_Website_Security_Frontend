import { useEffect, useState } from "react";
import { FaCog, FaComments, FaUserCircle, FaUsers } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";


const HeaderNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarItems = [
    { id: "Chat", icon: <FaComments size={20} />, label: "Chat", route: "/chat" },
    { id: "Groups", icon: <FaUsers size={20} />, label: "Groups", route: "/group/chat" },
    { id: "Profile", icon: <FaUserCircle size={20} />, label: "Profile", route: "/user/profile-setup" },
    { id: "Settings", icon: <FaCog size={20} />, label: "Settings", route: "/settings" },
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
    <div className="w-full bg-blue-500 text-white shadow-md flex justify-around items-center py-2">
      {sidebarItems.map((item) => (
        <div
          key={item.id}
          onClick={() => handleTabClick(item)}
          className={`flex flex-col items-center cursor-pointer transition-all duration-200 px-3
            ${activeTab === item.id 
              ? "text-white font-normal text-xs" 
              : "hover:text-blue-200"
            }`}
          title={item.label}
        >
          {item.icon}
          <span className="text-sm mt-1">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default HeaderNav;

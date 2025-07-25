import { Contact, MoreVertical, Search, Trash2, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { MdBlock } from "react-icons/md";
import userPlaceholder from "../../src/assets/images/user.png";

import ConfirmationModal from "../components/confirmationModel";
import ContactInfo from "../components/contactInfo";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = ({ onSearch }) => {
  const { selectedUser, setSelectedUser, deleteChat, blockUser, getBlockedUsers, getUsers } = useChatStore();
  const { onlineUsers } = useAuthStore();

  const [menuOpen, setMenuOpen] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, action: null });
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // 🔹 Open confirmation modal for delete or block
  const handleOpenModal = (action) => {
    if (!selectedUser) return;
    setModal({ isOpen: true, action });
    setMenuOpen(false); // Close menu
  };

  // 🔹 Toggle search input
  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      setSearchQuery(""); 
      onSearch(""); 
    }
  };

  // 🔹 Handle blocking a user
  const handleBlockUser = async () => {
    if (!selectedUser) return;
    try {
      await blockUser(selectedUser._id);
      toast.success(`${selectedUser.fullName} has been blocked.`);
      await getBlockedUsers();
      await getUsers(); // Refresh users list
      setSelectedUser(null); // ✅ Close chat
    } catch (error) {
      toast.error("Failed to block user. Please try again.");
    }
    setModal({ isOpen: false, action: null });
  };

  // 🔹 Handle deleting a chat
  const handleDeleteChat = async () => {
    if (!selectedUser) return;
    try {
      await deleteChat(selectedUser._id);
      toast.success(`Chat with ${selectedUser.fullName} deleted.`);
      setSelectedUser(null); // ✅ Close chat window
    } catch (error) {
      toast.error("Failed to delete chat. Please try again.");
    }
    setModal({ isOpen: false, action: null });
  };

  return (
    <div className="relative">
      {/* 🔹 Contact Info Popup */}
      {showContactInfo && <ContactInfo onClose={() => setShowContactInfo(false)} />}

      {/* 🔹 Chat Header */}
      <div className="p-2.5 border-b border-base-300 flex items-center justify-between bg-base-100 dark:bg-base-800">
        <div className="flex items-center gap-3">
          {/* Profile Picture */}
          <div className="flex justify-center items-center">
            <div className="relative w-12 h-12">
              <img
                src={selectedUser?.profilePic || userPlaceholder}
                alt={selectedUser?.name || "User"}
                className="w-full h-full object-cover rounded-full  shadow-lg"
              />
            </div>
          </div>

          {/* User Info */}
          <div>
            <h3 className="font-medium">{selectedUser?.fullName || "Unknown User"}</h3>
            <p 
              className={`text-xs opacity-80 text-base-content/70 ${onlineUsers.includes(selectedUser?._id) ? "text-green-600" : "text-gray-500"}`}
            >
              {onlineUsers.includes(selectedUser?._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          {/* 🔹 Search Button */}
          {!showSearch ? (
            <button onClick={toggleSearch} className="">
              <Search size={20} />
            </button>
          ) : (
            <div className="relative flex items-center  rounded-lg border px-2 py-1">
              <Search size={20} className=" mr-2" />
              <input
                type="text"
                placeholder="Search messages..."
                className="outline-none bg-transparent w-40"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  onSearch(e.target.value);
                }}
              />
              <button onClick={toggleSearch} className=" ml-2">
                <X size={16} />
              </button>
            </div>
          )}

          {/* 🔹 Three-Dot Menu */}
          <div className="relative">
            <button className="mt-2" onClick={() => setMenuOpen(!menuOpen)}>
              <MoreVertical size={20} />
            </button>

            {/* 🔹 Options Menu */}
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 shadow-lg rounded-lg border border-gray-200 dark:border-base-600 z-50 bg-base-100 dark:bg-base-800">
                <button
                  className="flex items-center gap-2 w-full px-4 py-2 "
                  onClick={() => {
                    setShowContactInfo(true);
                    setMenuOpen(false);
                  }}
                >
                  <Contact size={18} /> Contact Info
                </button>

                <button
                  className="flex items-center gap-2 w-full px-4 py-2  text-red-600"
                  onClick={() => handleOpenModal("delete")}
                >
                  <Trash2 size={18} /> Delete Chat
                </button>

                <button
                  className="flex items-center gap-2 w-full px-4 py-2 bg-base-500  hover:bg-base-700 text-red-600"
                  onClick={() => handleOpenModal("block")}
                >
                  <MdBlock size={18} /> Block
                </button>
              </div>
            )}
          </div>

          {/* 🔹 Close Chat Button */}
          <button onClick={() => setSelectedUser(null)} className="">
            <X />
          </button>
        </div>
      </div>

      {/* 🔹 Confirmation Modal */}
      <ConfirmationModal
        isOpen={modal.isOpen}
        title={modal.action === "delete" ? "Delete Chat" : "Block User"}
        message={
          modal.action === "delete"
            ? `Are you sure you want to delete the chat with ${selectedUser?.fullName}?`
            : `Are you sure you want to block ${selectedUser?.fullName}?`
        }
        onClose={() => setModal({ isOpen: false, action: null })}
        onConfirm={modal.action === "delete" ? handleDeleteChat : handleBlockUser}
      />
    </div>
  );
};

export default ChatHeader;

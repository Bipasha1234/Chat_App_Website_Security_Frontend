import debounce from "lodash/debounce";
import { useEffect, useState } from "react";
import { FiArrowLeft, FiMoreHorizontal, FiPlus, FiTrash2 } from "react-icons/fi";
import { IoMdChatbubbles } from "react-icons/io";
import { MdGroupAdd } from "react-icons/md";

import userPlaceholder from "../assets/images/user.png";
import CreateGroupModal from "../components/createGroupModel";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const MessagingSidebar = () => {
  const {
    getUsers,
    users,
    blockedUsers,
    selectedUser,
    setSelectedUser,
    markAsSeen,
    deleteChat,
    markAsUnread,
  } = useChatStore();
  const { onlineUsers } = useAuthStore();

  const [showAddOptions, setShowAddOptions] = useState(false);
  const [isSelectingChats, setIsSelectingChats] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChats, setSelectedChats] = useState([]);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  const handleSearch = debounce((e) => setSearchQuery(e.target.value), 500);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const toggleUserSelection = (userId) => {
    setSelectedChats((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const handleDeleteChats = async () => {
    for (const userId of selectedChats) {
      await deleteChat(userId);
    }
    setSelectedChats([]);
    setIsSelectingChats(false);
    setShowOptionsMenu(false);
    getUsers();
  };

  const handleMarkAsUnread = async () => {
    for (const userId of selectedChats) {
      await markAsUnread(userId);
    }
    setSelectedChats([]);
    setIsSelectingChats(false);
    setShowOptionsMenu(false);
  };

  // Filter out blocked users but do not process latestMessage
  const filteredUsers = users.filter(
    (user) => !blockedUsers.some((blocked) => blocked._id === user._id)
  );

  return (
    <>
      <aside className="h-full w-96 border-r bg-white border-blue-200 flex flex-col shadow font-open-sans relative">
        {/* Top bar */}
        {!isSelectingChats ? (
          <div className="p-4 flex items-center justify-between shadow-md bg-blue-100">
            <h1 className="text-lg font-semibold text-black">Messaging</h1>
            <button
              className="btn btn-sm btn-circle border-black text-black"
              onClick={() => setShowAddOptions((prev) => !prev)}
            >
              <FiPlus />
            </button>
          </div>
        ) : (
          <div className="p-4 flex items-center justify-between bg-blue-50 shadow-md">
            <button
              onClick={() => {
                setIsSelectingChats(false);
                setShowOptionsMenu(false);
                setSelectedChats([]);
              }}
              className="btn btn-sm btn-circle text-blue-600 border-blue-500"
            >
              <FiArrowLeft />
            </button>
            <p className="text-md font-semibold text-blue-800 flex-1 text-center">
              Select Chats
            </p>
            {selectedChats.length > 0 && (
              <button
                onClick={() => setShowOptionsMenu((prev) => !prev)}
                className="btn btn-sm btn-circle text-blue-600"
              >
                <FiMoreHorizontal size={22} />
              </button>
            )}
          </div>
        )}

        {/* Users list */}
        <div className="flex-1 overflow-y-auto p-2 mt-4">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user._id}
                className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-all ${
                  selectedUser?._id === user._id ? "bg-blue-100" : "hover:bg-blue-50"
                }`}
                onClick={() => !isSelectingChats && setSelectedUser(user)}
              >
                {isSelectingChats && (
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm border-blue-400"
                    checked={selectedChats.includes(user._id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      toggleUserSelection(user._id);
                    }}
                  />
                )}

                <div className="relative border-2 border-blue-300 rounded-full">
                  <img
                    src={user.profilePic || userPlaceholder}
                    alt={user.name}
                    className="w-12 h-12 object-cover rounded-full"
                  />
                  {onlineUsers.includes(user._id) && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white" />
                  )}
                </div>

                <div className="flex-1">
                  <p
                    className={`truncate text-black ${
                      user.isUnread ? "font-bold" : ""
                    }`}
                  >
                    {user.fullName}
                  </p>
                  {/* Removed latestMessage here */}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">No users found</div>
          )}
        </div>

        {/* Add options dropdown */}
        {!isSelectingChats && showAddOptions && (
          <div className="absolute top-14 left-56 w-44 bg-white border border-blue-200 rounded-md shadow-lg z-50">
            <button
              className="w-full px-4 py-3 flex items-center gap-3 text-black hover:bg-blue-50"
              onClick={() => setIsSelectingChats(true)}
            >
              <IoMdChatbubbles size={18} /> Select Chats
            </button>
          </div>
        )}

        {/* More options dropdown */}
        {showOptionsMenu && selectedChats.length > 0 && (
          <div className="absolute top-14 left-48 w-48 bg-white border border-blue-300 rounded-md shadow-md p-2 z-50">
            <button
              className="w-full text-left text-red-600 flex items-center gap-2 p-2 rounded hover:bg-red-50"
              onClick={handleDeleteChats}
            >
              <FiTrash2 /> Delete Chats
            </button>

            <button
              className="w-full text-left flex items-center gap-2 p-2 rounded hover:bg-blue-50"
              onClick={() => setIsCreatingGroup(true)}
            >
              <MdGroupAdd /> Create Group
            </button>
          </div>
        )}
      </aside>

      {/* Group Modal */}
      {isCreatingGroup && (
        <CreateGroupModal
          onClose={() => {
            setIsCreatingGroup(false);
            setIsSelectingChats(false);
            setSelectedChats([]);
          }}
          selectedChats={selectedChats}
        />
      )}
    </>
  );
};

export default MessagingSidebar;

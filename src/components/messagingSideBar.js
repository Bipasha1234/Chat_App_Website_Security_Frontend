import debounce from "lodash/debounce";
import { useEffect, useState } from "react";
import { FiArrowLeft, FiCheckSquare, FiMoreHorizontal, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import { IoMdChatbubbles } from "react-icons/io";
import { MdGroupAdd } from "react-icons/md";

import userPlaceholder from "../assets/images/user.png";
import CreateGroupModal from "../components/createGroupModel";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
// import SidebarSkeleton from "../components/skeletons/SidebarSkeleton";

const MessagingSidebar = () => {
  const { getUsers, users, blockedUsers, selectedUser, setSelectedUser, isUsersLoading, markAsSeen, deleteChat, markAsUnread } = useChatStore();
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
    setSelectedChats((prevSelected) => {
      const newSelection = prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId) 
        : [...prevSelected, userId]; 
  
      console.log("Updated Selected Users:", newSelection);
      return newSelection;
    });
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
  const sortedUsers = [...users]
    .filter((user) => !blockedUsers.some((blocked) => blocked._id === user._id))
    .filter((user) => user.fullName.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => (b.isUnread ? 1 : 0) - (a.isUnread ? 1 : 0) || (b.lastMessageTime || 0) - (a.lastMessageTime || 0));
    
    

  // if (isUsersLoading) return <SidebarSkeleton />;
  return (
    <>
    <aside className="h-full w-72  border-r border-base-300 flex flex-col shadow-lg font-open-sans">
      {!isSelectingChats && (
        <div className="p-4 flex items-center justify-between shadow">
          <h1 className="text-lg font-bold">Messaging</h1>
          <button
            className="btn btn-sm btn-circle btn-outline"
            onClick={() => setShowAddOptions((prev) => !prev)}
          >
            <FiPlus />
          </button>
        </div>
      )}
    
      {isSelectingChats && (
        <div className="p-4 flex items-center  bg-base-200 shadow">
          <button
            onClick={() => {
              setIsSelectingChats(false);
              setShowOptionsMenu(false);
              setSelectedChats([]); 
            }}
            className="text-gray-800 hover:text-gray-900"
          >
            <FiArrowLeft size={20} className="btn btn-xs btn-circle " />
          </button>
          <div className="flex items-center justify-center">
          <p className="text-lg ml-12 mr-10 font-semibold">Select Chats</p>
          </div>
            

          {selectedChats.length > 0 && (
            <button
              onClick={() => setShowOptionsMenu((prev) => !prev)}
              className="btn btn-sm btn-circle  "
            >
              <FiMoreHorizontal size={24} />
            </button>
          )}
        </div>
      )}
      <div className="p-4">
          <div className="input input-bordered flex items-center gap-2">
            <FiSearch className="text-gray-500" />
            <input type="text" placeholder="Search users..." onChange={handleSearch} className="w-full bg-transparent outline-none" />
          </div>
        </div>


      <div className="flex-1 overflow-y-auto p-2 ">
      {sortedUsers.length > 0 ? (
  sortedUsers.map((user) => (
    
  <div  key={user._id}
  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all 
    ${selectedUser?._id === user._id ? "bg-base-300 " : " hover:bg-base-200"} `}
  onClick={() => !isSelectingChats && setSelectedUser(user)}
    >
      {isSelectingChats && (
        <input
          type="checkbox"
          className="checkbox"
          checked={selectedChats.includes(user._id)}
          onChange={(e) => {
            e.stopPropagation(); 
            toggleUserSelection(user._id);
          }}
        />
      )}

        {/* <div className="relative flex items-center">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-300">
            <img src={user.profilePic || userPlaceholder} alt={user.name} className="w-full h-full object-cover rounded-full" />
          </div>
          {onlineUsers.includes(user._id) && (
            <span
              className="absolute left-full w-3 h-3 bg-green-500 rounded-full ring-2 ring-zinc-900"
            />
          )}
        </div> */}

        <div className="relative mx-auto lg:mx-0 border-2 border-gray-300 rounded-full">
              <img
                src={user.profilePic || userPlaceholder}
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-700"
                />
              )}
            </div>


      <div className=" flex-1">
      <p className={`truncate ${user.isUnread ? "font-bold" : ""}`}>{user.fullName}</p>
      <p className="text-xs truncate text-gray-500">{user.latestMessage !== "Chat deleted" ? user.latestMessage : <span className="italic">Chat deleted</span>}</p>
      </div>
    </div>
  ))
) : (
  <div className="text-center text-gray-500 py-4">No users found</div>

        )}
      </div>

      {!isSelectingChats && showAddOptions && (
        <div className="absolute top-14 left-56 w-40 shadow-lg  border z-50">
          <button className="flex items-center justify-between gap-3 bg-base-100 w-full px-4 py-3 hover:bg-base-200 " onClick={() => setIsSelectingChats(true)}>
            <IoMdChatbubbles size={18} /> Select Chats
          </button>
        </div>
      )}

      {showOptionsMenu && selectedChats.length > 0 && (
          <div className="absolute top-14 left-48 w-44 bg-base-100 shadow-lg rounded-lg border p-2 hover:bg-base-100">
            <button className="btn btn-sm btn-error w-full mb-3 " onClick={handleDeleteChats}><FiTrash2 /> Delete Chats</button>
            <button className="btn btn-sm w-full mb-3 bg-base-100" onClick={handleMarkAsUnread}><FiCheckSquare /> Mark as Unread</button>
            <button className="btn btn-sm w-full bg-base-100" onClick={() => setIsCreatingGroup(true)}><MdGroupAdd /> Create Group</button>
          </div>
        )}
      </aside>
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
import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useChatStore } from "../../src/core/public/store/useChatStore";
import groupUserIcon from "../assets/images/group.png";

const GroupSidebar = () => {
  const { getGroups, groups, selectedGroup, setSelectedGroup, isGroupsLoading, getGroupMessages } = useChatStore();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getGroups();
  }, [getGroups]);

  const handleGroupClick = (group) => {
    console.log("Selected Group:", group);
    setSelectedGroup(group);
    getGroupMessages(group._id);
  };

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <aside className="h-full w-72 border-r border-base-300 flex flex-col shadow-lg font-open-sans bg-base-100 dark:bg-base-800">
        <div className="p-4 flex items-center justify-between shadow dark:bg-base-800">
          <h1 className="text-lg font-bold text-base-content dark:text-base-content">
            Groups
          </h1>
        </div>
        <div className="p-4">
          <div className="input input-bordered flex items-center gap-2 dark:bg-base-700 dark:border-base-600">
            <FiSearch className="text-gray-500 dark:text-gray-400" />
            <input
              type="text"
              placeholder="Search groups..."
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent outline-none text-base-content dark:text-base-content"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {filteredGroups.length > 0 ? (
            filteredGroups.map((group) => (
              <div
                key={group._id}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                  selectedGroup?._id === group._id
                    ? "bg-base-300 dark:bg-base-600"
                    : "hover:bg-base-200 dark:hover:bg-base-700"
                }`}
                onClick={() => handleGroupClick(group)}
              >
                <div className="relative mx-auto lg:mx-0 border-2 border-gray-300 rounded-full">
                  <img
                    src={group.profilePic || groupUserIcon}
                    alt={group.name}
                    className="size-12 object-cover rounded-full"
                  />
                </div>
                <div className="flex-1">
                  <div className="truncate font-semibold text-base-content dark:text-base-content">
                    {group.name}
                  </div>
                  <div className="text-xs truncate text-gray-500 dark:text-gray-400">
                    {group.latestMessage ? (
                      <>
                        <span className="font-medium">
                          {group.latestMessage.sender}:{" "}
                        </span>
                        {group.latestMessage.text}
                      </>
                    ) : (
                      "No messages yet"
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 py-4">
              No groups found
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default GroupSidebar;

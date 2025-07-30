import { useState } from "react";
import toast from "react-hot-toast";
import { useChatStore } from "../store/useChatStore";

const CreateGroupModal = ({ onClose, selectedChats }) => {
  const { createGroup } = useChatStore();
  const [groupName, setGroupName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleCreateGroup = async () => {
    setErrorMessage(""); // Clear previous errors

    if (!groupName.trim()) {
      setErrorMessage("Please enter a group name.");
      return;
    }

    if (!selectedChats || selectedChats.length < 2) {
      setErrorMessage("Select at least 2 members to create a group.");
      return;
    }

    try {
      console.log("Creating Group:", { groupName, members: selectedChats });

      await createGroup({ groupName, members: selectedChats });

      toast.success("Group created successfully");
      onClose(); 
      setGroupName("");
      setErrorMessage("");
    } catch (error) {
      console.error("Group Creation Failed:", error);
      setErrorMessage("Failed to create group");
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg border w-96">
        <h2 className="text-xl font-semibold mb-3">Create New Group</h2>

        <input
          type="text"
          placeholder="Enter group name..."
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-2 outline-none"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />

        {/* Inline Error Message */}
        {errorMessage && (
          <p className="text-red-600 text-sm mb-2">{errorMessage}</p>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <button className="px-4 py-2 bg-base-300 rounded-lg" onClick={onClose}>
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            onClick={handleCreateGroup}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;

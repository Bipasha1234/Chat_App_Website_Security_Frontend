import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { decryptMessage, encryptMessage } from "../lib/crypto";
import { useAuthStore } from "./useAuthStore";
export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  groups: [],
  selectedUser: null,
  selectedGroup: null,
  isGroupsLoading:false,
  isUpdatingProfile:false,
  isUsersLoading: false,
  isMessagesLoading: false,
  blockedUsers: [],
adminDashboardData: null,  // Add this to hold the dashboard data
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      
      // Fetch blocked users from the database
      await get().getBlockedUsers();

      const blockedUserIds = get().blockedUsers.map(user => user._id);
      const filteredUsers = res.data.filter(user => !blockedUserIds.includes(user._id));

      set({ users: filteredUsers });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      set({ isUsersLoading: false });
    }
  },
  // Get individual messages and decrypt them
getMessages: async (userId) => {
  set({ isMessagesLoading: true });

  try {
    const res = await axiosInstance.get(`/messages/${userId}`);

    // Decrypt each message text before saving
    const decryptedMessages = res.data.map(msg => ({
      ...msg,
      text: decryptMessage(msg.text),
    }));

    set({ messages: decryptedMessages });
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to load messages");
  } finally {
    set({ isMessagesLoading: false });
  }
},



  getAdminDashboard: async () => {
    try {
      const res = await axiosInstance.get("/admin-dashboard");
      set({ adminDashboardData: res.data });
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch admin dashboard");
      return null;
    }
  },

// Get group messages and decrypt them
getGroupMessages: async (groupId) => {
  set({ isGroupsLoading: true });

  try {
    const res = await axiosInstance.get(`/groups/messages/${groupId}`);

    // Decrypt each message text before saving
    const decryptedMessages = res.data.messages.map(msg => ({
      ...msg,
      text: decryptMessage(msg.text),
    }));

    set({
      messages: decryptedMessages,
      profilePic: res.data.profilePic,
      groupName: res.data.groupName,
    });
  } catch (error) {
    toast.error("Failed to fetch messages");
  } finally {
    set({ isGroupsLoading: false });
  }
},

// Send group message with encryption
sendGroupMessage: async (messageData) => {
  const { selectedGroup, messages } = get();
  try {
    if (selectedGroup) {
      // Encrypt text before sending
      const encryptedText = encryptMessage(messageData.text);

      // Send encrypted message
      const res = await axiosInstance.post(`/groups/messages/${selectedGroup._id}`, {
        ...messageData,
        text: encryptedText,
      });

      // Decrypt message from server before adding to state
      const newMessage = res.data.newMessage || res.data;
      newMessage.text = decryptMessage(newMessage.text);

      set({ messages: [...messages, newMessage] });
    }
  } catch (error) {
    toast.error("Failed to send message");
  }
},




sendMessage: async (messageData) => {
  const { selectedUser, messages } = get();
  try {
    if (selectedUser) {
      const encryptedText = encryptMessage(messageData.text); // Encrypt before sending

      // Create a temporary optimistic message with a unique ID
      const optimisticId = Date.now(); // can use uuid also
      const optimisticMessage = {
        ...messageData,
        _id: optimisticId,
        text: messageData.text, // Show plain text in UI
        senderId: messageData.senderId,
        receiverId: selectedUser._id,
        createdAt: new Date().toISOString(),
        isPending: true,
      };

      // Optimistically update UI
      set({ messages: [...messages, optimisticMessage] });

      // Send encrypted message to server
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, {
        senderId: messageData.senderId,
        text: encryptedText,
      });

      // Replace optimistic message with server-confirmed message
      const updatedMessages = get().messages.map((msg) =>
        msg._id === optimisticId ? res.data : msg
      );
      set({ messages: updatedMessages });
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to send message");
  }
},


  

  deleteChat: async (userId) => {
    try {
      await axiosInstance.delete(`/messages/delete/${userId}`);
      toast.success("Chat deleted successfully");
  
      set((state) => ({
        users: state.users.map((user) =>
          user._id === userId ? { ...user, latestMessage: "" } : user
        ),
        selectedUser: null,
        messages: [], 
      }));
  
      await get().getUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete chat");
    }
  },  

  getBlockedUsers: async () => {
    try {
      const res = await axiosInstance.get("/messages/users/blocked");
      set({ blockedUsers: res.data.blockedUsers });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch blocked users");
    }
  },

  blockUser: async (userId) => {
    try {
      await axiosInstance.post(`/messages/users/block/${userId}`);
      toast.success("User blocked successfully");

      // Update UI immediately
      await get().getBlockedUsers();
      set((state) => ({
        users: state.users.filter(user => user._id !== userId),
        selectedUser: null,
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to block user");
    }
  },

  unblockUser: async (userId) => {
    try {
      const res = await axiosInstance.post(`/messages/users/unblock/${userId}`);

      if (res.data.blockedUsers) {
        toast.success("User unblocked successfully");

        set((state) => ({
          blockedUsers: state.blockedUsers.filter(user => user._id !== userId),
          users: [...state.users, res.data.unblockedUser],
        }));
      } else {
        toast.error("Failed to unblock user. Try again.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to unblock user");
    }
  },

  markAsSeen: async (userId) => {
    try {
      await axiosInstance.post("/messages/mark-seen", { senderId: userId });

      set((state) => ({
        users: state.users.map(user =>
          user._id === userId ? { ...user, isUnread: false } : user
        ),
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to mark messages as seen");
    }
  },

  markAsUnread: async (userId) => {
    try {
      await axiosInstance.post(`/messages/mark-unread/${userId}`);
      toast.success("Chat marked as unread");

      set((state) => ({
        users: state.users.map(user =>
          user._id === userId ? { ...user, isUnread: true } : user
        ),
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to mark as unread");
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  // setSelectedUser: (selectedUser) => set({ selectedUser }),

  setSelectedUser: (selectedUser) => {
    set({ selectedUser });

    if (selectedUser) {
      get().markAsSeen(selectedUser._id);
    }
  },


  getGroups: async () => {
    set({ isGroupsLoading: true });
    try {
      const res = await axiosInstance.get("/groups/get");
      set({ groups: res.data });
    } catch (error) {
      toast.error("Failed to fetch groups");
    } finally {
      set({ isGroupsLoading: false });
    }
  },

  createGroup: async (groupData) => {
    try {
        console.log("➡️ Sending Create Group Request:", groupData);

        if (!groupData.groupName || !groupData.members || groupData.members.length < 2) {
            console.error("❌ Invalid Group Data:", groupData);
            toast.error("Group name and at least 2 members are required");
            return;
        }

        const res = await axiosInstance.post("/groups/create", groupData);

        if (res.data?.group) {
            set((state) => ({
                groups: [...state.groups, res.data.group], 
            }));
            toast.success("Group created successfully");
            console.log("Group Created:", res.data.group);
        } else {
            throw new Error("Group creation failed");
        }
    } catch (error) {
        console.error("❌ Error Creating Group:", error.response?.data || error.message);
        toast.error(error.response?.data?.message || "Failed to create group");
    }
},


updateGroupProfile: async (groupId, data) => {
  set({ isUpdatingProfile: true });

  try {
    const res = await axiosInstance.put(`/groups/update-group-profile/${groupId}`, data);

    // Update the group details in the store
    set((state) => ({
      groups: state.groups.map((group) =>
        group._id === groupId ? { ...group, ...res.data } : group
      ),
      selectedGroup: state.selectedGroup?._id === groupId ? { ...state.selectedGroup, ...res.data } : state.selectedGroup,
    }));

    toast.success("Group profile updated successfully");
  } catch (error) {
    console.error("Error updating group profile:", error);
    toast.error(error.response?.data?.message || "Failed to update group profile");
  } finally {
    set({ isUpdatingProfile: false });
  }
},


updateGroupName: async (groupId, groupName) => {
  set({ isUpdatingProfile: true });

  try {
    if (!groupName) {
      toast.error("New group name is required");
      return;
    }

    const res = await axiosInstance.put(`/groups/update-group-name/${groupId}`, { groupName });

    // Update group name in the store
    set((state) => ({
      groups: state.groups.map((group) =>
        group._id === groupId ? { ...group, name: groupName } : group
      ),
      selectedGroup: state.selectedGroup?._id === groupId ? { ...state.selectedGroup, name: groupName } : state.selectedGroup,
    }));

    toast.success("Group name updated successfully");
  } catch (error) {
    console.error("Error updating group name:", error);
    toast.error(error.response?.data?.message || "Failed to update group name");
  } finally {
    set({ isUpdatingProfile: false });
  }
},

addUserToGroup: async (groupId, userId) => {
  try {
    const res = await axiosInstance.post(`/groups/add-user/${groupId}`, { userId });
    if (res.status === 200) {
      // If needed, update the state after adding the user to the group
      set((state) => ({
        groups: state.groups.map((group) =>
          group._id === groupId ? { ...group, users: [...group.users, res.data.user] } : group
        ),
        selectedGroup: state.selectedGroup?._id === groupId ? { ...state.selectedGroup, users: [...state.selectedGroup.users, res.data.user] } : state.selectedGroup,
      }));
      toast.success("User added to the group successfully");
    } else {
      throw new Error('Failed to add user');
    }
  } catch (error) {
    console.error('Error adding user to group:', error);
    toast.error(error.response?.data?.error || "Failed to add user to group");
  }
},

leaveGroup: async (groupId) => {
  try {
    // Send request to leave the group
    const res = await axiosInstance.post(`/groups/leave/${groupId}`);

    if (res.status === 200) {
      // Remove the group from the user's groups
      set((state) => ({
        groups: state.groups.filter((group) => group._id !== groupId), // Remove the group from the state
        selectedGroup: null, // Deselect the group if it was the selected one
        messages: [], // Clear the messages for that group
      }));
      toast.success("You have left the group successfully");
    } else {
      throw new Error('Failed to leave group');
    }
  } catch (error) {
    console.error('Error leaving group:', error);
    toast.error(error.response?.data?.message || "Failed to leave group");
  }
},
  createTipPaymentIntent: async ({ amount, tipperId, receiverId }) => {
    try {
      const res = await axiosInstance.post("/payments/create-payment-intent", {
        amount,
        tipperId,
        receiverId,
      });

      return res.data.clientSecret; // Return clientSecret to confirm on frontend
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create payment intent");
      return null;
    }
  },
  saveTip: async ({ tipperId, receiverId, amount,messageId,transactionId }) => {
  try {
    const res = await axiosInstance.post("/payments/save-tip", {
      tipperId,
      receiverId,
      amount,
      messageId,
      transactionId
    });
    toast.success("Tip saved successfully!");
    return res.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to save tip");
    return null;
  }
},

getTipByMessageId: async (messageId) => {
  try {
    const res = await axiosInstance.get(`/payments/get-tip/${messageId}`);
    return res.data; // This will contain the tip info
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to fetch tip");
    return null;
  }
},


  setSelectedGroup: (group) => set({ selectedGroup: group }),
}));

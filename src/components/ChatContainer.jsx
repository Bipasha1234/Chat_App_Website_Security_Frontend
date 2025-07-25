
import { Download, File } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../../src/core/public/store/useAuthStore";
import { useChatStore } from "../../src/core/public/store/useChatStore";
import userPlaceholder from "../assets/images/user.png";
import ChatHeader from "../components/ChatHeader";
import MessageInput from "../components/MessageInput";
import MessageSkeleton from "../components/skeletons/MessageSkeleton";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const messageRefs = useRef({});
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    if (selectedUser?._id && authUser) {
      console.log("Fetching messages for user:", selectedUser._id);
      getMessages(selectedUser._id);
      subscribeToMessages();
    }
  
    return () => {
      unsubscribeFromMessages();
    };
  }, [selectedUser?._id, authUser, getMessages, subscribeToMessages, unsubscribeFromMessages]);
  

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (searchQuery) {
      scrollToMessage();
    }
  }, [searchQuery]);

  const scrollToMessage = () => {
    const matchedMessage = messages.find((msg) =>
      msg.text?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (matchedMessage && messageRefs.current[matchedMessage._id]) {
      messageRefs.current[matchedMessage._id].scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const highlightMatch = (text, query) => {
    if (!query) return text;
    return text.split(new RegExp(`(${query})`, "gi")).map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? <mark key={index} className="bg-blue-300">{part}</mark> : part
    );
  };

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader onSearch={setSearchQuery} />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  if (!authUser || !selectedUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <p className="text-gray-500">Loading chat...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto   ">
      <ChatHeader onSearch={setSearchQuery} />

      {/* 🔹 Chat Messages Section */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => (
  <div 
    key={message._id || `message-${index}`} // ✅ Ensure a unique key is always present
    className={`flex ${message.senderId === authUser._id ? "justify-end" : "justify-start"}`}
  >


            {/* Sender's Profile Picture */}
            {message.senderId !== authUser._id && (
              <div className="mr-2">
                <div className="w-10 h-10 rounded-full border overflow-hidden">
                  <img src={selectedUser.profilePic || userPlaceholder} alt="Receiver Profile" className="w-full h-full object-cover" />
                </div>
              </div>
            )}

            <div className={`text-sm ${message.senderId === authUser._id ? "  text-white rounded-br-none" : "  text-black rounded-bl-none"}`}>
              {message.text && (
                <p className={`px-4 py-2 rounded-lg ${message.senderId === authUser._id ? "bg-[#81b9a4]" : "bg-gray-200"}`}>
                  {highlightMatch(message.text, searchQuery)}
                </p>
              )}

              {message.image && (
                <img src={message.image} alt="Attachment" className="w-40 h-40 rounded-md mt-2 object-cover" />
              )}

              {message.audio && (
                <div className="flex items-center gap-2 bg-[#d9ede5] p-2 rounded-lg shadow-md w-56">
                  <audio controls className="w-full" style={{ height: "32px", borderRadius: "8px", backgroundColor: "white" }}>
                    <source src={message.audio} type="audio/webm" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}

              {message.document && (
                <div className="flex items-center gap-3 bg-[#edf3f0] p-3 rounded-lg shadow-md mt-2 max-w-xs">
                  <File size={22} className="text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">
                      {message.documentName || "Document"}
                    </p>
                    <button
                      onClick={() => {
                        const fileExtension = message.document.split(".").pop();
                        if (["pdf", "jpg", "png"].includes(fileExtension.toLowerCase())) {
                          window.open(message.document, "_blank"); // Open in new tab
                        } else {
                          window.location.href = message.document; 
                        }
                      }}
                      className="text-blue-500 text-xs hover:underline"
                    >
                      Tap to Open
                    </button>
                  </div>
                  <a href={message.document} download={message.documentName || "document"} className="text-gray-600">
                    <Download size={20} />
                  </a>
                </div>
              )}

              <time className={`text-xs opacity-60 mt-2 text-gray-500 block ${message.senderId === authUser._id ? "text-right" : "text-right"}`}>
                {formatMessageTime(message.createdAt)}
              </time>
            </div>

            {message.senderId === authUser._id && (
              <div className="ml-2">
                <div className="w-10 h-10 rounded-full border overflow-hidden">
                  <img src={authUser.profilePic || userPlaceholder} alt="Sender Profile" className="w-full h-full object-cover" />
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;

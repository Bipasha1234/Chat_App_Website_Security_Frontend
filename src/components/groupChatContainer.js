import { Download, File } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import userPlaceholder from "../assets/images/group.png";
import GroupChatHeader from "../components/groupChatHeader";
import GroupMessageInput from "../components/groupMessageInput";
import { formatMessageTime } from "../lib/utils";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const GroupChatContainer = () => {
  const {
    messages,
    getGroupMessages,
    isGroupsLoading,
    selectedGroup,
    sendGroupMessage,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const messageRefs = useRef({});
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (selectedGroup?._id) {
      getGroupMessages(selectedGroup._id, { populateSender: true });
    }
  }, [selectedGroup]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    const messageData = {
      text: messageText,
      senderId: authUser._id,
      groupId: selectedGroup._id,
    };

    try {
      await sendGroupMessage(messageData);
      setTimeout(() => {
        getGroupMessages(selectedGroup._id, { populateSender: true });
      }, 500);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const scrollToMessage = () => {
    const matchedMessage = messages.find((msg) =>
      msg.text?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (matchedMessage && messageRefs.current[matchedMessage._id]) {
      messageRefs.current[matchedMessage._id].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  useEffect(() => {
    if (searchQuery) scrollToMessage();
  }, [searchQuery]);

  const highlightMatch = (text, query) => {
    if (!query) return text;
    return text.split(new RegExp(`(${query})`, "gi")).map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={index} className="bg-yellow-200">{part}</mark>
      ) : (
        part
      )
    );
  };

  if (isGroupsLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <GroupChatHeader onSearch={setSearchQuery} />
        <GroupMessageInput onSend={handleSendMessage} />
      </div>
    );
  }

  if (!selectedGroup) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <p className="text-gray-500">Select a group to start chatting.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <GroupChatHeader group={selectedGroup} onSearch={setSearchQuery} />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <p className="text-center">No messages yet.</p>
        ) : (
          messages.map((message) => {
            const isSender = message.senderId?._id === authUser._id;
            return (
              <div
                key={message._id}
                ref={(el) => (messageRefs.current[message._id] = el)}
                className={`flex gap-2 items-start ${
                  isSender ? "justify-end" : "justify-start"
                }`}
              >
                {!isSender && (
                  <img
                    src={message.senderId?.profilePic || userPlaceholder}
                    className="w-10 h-10 rounded-full border object-cover"
                    alt="Sender"
                  />
                )}
                <div
                  className={`max-w-[70%] px-5 py-3 rounded-2xl shadow-md text-sm ${
                    isSender
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white border border-blue-300 text-gray-900 rounded-bl-none"
                  }`}
                >
                  <p className="font-semibold mb-2">
                    {message.senderId?.fullName}
                  </p>

                  {/* Text Message */}
                  {message.text && (
                    <p className="leading-relaxed">
                      {highlightMatch(message.text, searchQuery)}
                    </p>
                  )}

                  {/* Image */}
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Attachment"
                      className="w-40 h-40 rounded-md mt-2 object-cover"
                    />
                  )}

                  {/* Audio */}
                  {message.audio && (
                    <div className="flex items-center gap-2 bg-[#d9ede5] p-2 rounded-lg shadow-md w-56 mt-2">
                      <audio controls className="w-full">
                        <source src={message.audio} type="audio/webm" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  )}

                  {/* Document */}
                  {message.document && (
                    <div className="flex items-center gap-3 bg-[#edf3f0] p-3 rounded-lg shadow-md mt-2 max-w-xs">
                      <File size={22} className="text-blue-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">
                          {message.documentName || "Document"}
                        </p>
                        <button
                          onClick={() => {
                            const ext = message.document.split(".").pop();
                            if (["pdf", "jpg", "png"].includes(ext.toLowerCase())) {
                              window.open(message.document, "_blank");
                            } else {
                              window.location.href = message.document;
                            }
                          }}
                          className="text-blue-500 text-xs hover:underline"
                        >
                          Tap to Open
                        </button>
                      </div>
                      <a
                        href={message.document}
                        download={message.documentName || "document"}
                        className="text-gray-600"
                      >
                        <Download size={20} />
                      </a>
                    </div>
                  )}

                  {/* Timestamp */}
                  <time className="text-xs opacity-70 mt-2 block">
                    {formatMessageTime(message.createdAt)}
                  </time>
                </div>
              </div>
            );
          })
        )}
        <div ref={messageEndRef} />
      </div>
      <GroupMessageInput onSend={handleSendMessage} />
    </div>
  );
};

export default GroupChatContainer;

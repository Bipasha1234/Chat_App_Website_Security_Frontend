import { Download, File } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import userPlaceholder from "../assets/images/user.png";
import { formatMessageTime } from "../lib/utils";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";

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
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (selectedUser?._id && authUser) {
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

  const highlightMatch = (text, query) => {
    if (!query) return text;
    return text.split(new RegExp(`(${query})`, "gi")).map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={index} className="bg-blue-300 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto bg-blue-50">
        <ChatHeader onSearch={setSearchQuery} />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  if (!authUser || !selectedUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-blue-50">
        <p className="text-blue-700">Loading chat...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto bg-blue-50">
      <ChatHeader onSearch={setSearchQuery} />

      {/* Chat Messages Section */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-blue-100">
        {messages.map((message, index) => {
          const isSender = message.senderId === authUser._id;
          return (
            <div
              key={message._id || `message-${index}`}
              className={`flex ${isSender ? "justify-end" : "justify-start"}`}
            >
              {/* Sender's Profile Picture (only on received messages) */}
              {!isSender && (
                <div className="mr-3 mt-auto">
                  <div className="w-12 h-12 rounded-full border-2 border-blue-400 overflow-hidden shadow-sm">
                    <img
                      src={selectedUser.profilePic || userPlaceholder}
                      alt="Receiver Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Message bubble */}
              <div
                className={`max-w-[70%] px-5 py-3 rounded-2xl shadow-md
                  ${isSender
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-white border border-blue-300 text-gray-900 rounded-bl-none"
                }`}
              >
                {message.text && (
                  <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                    {highlightMatch(message.text, searchQuery)}
                  </p>
                )}

                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="w-44 h-44 rounded-lg mt-3 object-cover shadow"
                  />
                )}

                {message.audio && (
                  <div className="flex items-center gap-3 bg-blue-100 p-2 rounded-lg shadow-md mt-3">
                    <audio
                      controls
                      className="w-full"
                      style={{ height: "34px", borderRadius: "8px", backgroundColor: "white" }}
                    >
                      <source src={message.audio} type="audio/webm" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}

                {message.document && (
                  <div className="flex items-center gap-3 bg-blue-100 p-3 rounded-lg shadow-md mt-3 max-w-xs">
                    <File size={22} className="text-blue-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-900">
                        {message.documentName || "Document"}
                      </p>
                      <button
                        onClick={() => {
                          const fileExtension = message.document.split(".").pop();
                          if (["pdf", "jpg", "png"].includes(fileExtension.toLowerCase())) {
                            window.open(message.document, "_blank");
                          } else {
                            window.location.href = message.document;
                          }
                        }}
                        className="text-blue-700 text-xs hover:underline"
                      >
                        Tap to Open
                      </button>
                    </div>
                    <a
                      href={message.document}
                      download={message.documentName || "document"}
                      className="text-blue-600 hover:text-blue-800 transition"
                      title="Download document"
                    >
                      <Download size={20} />
                    </a>
                  </div>
                )}

                <time
                  className={`block mt-2 text-xs opacity-70 ${
                    isSender ? "text-blue-100 text-right" : "text-blue-700 text-left"
                  }`}
                >
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>

              {/* Sender's Profile Picture (only for sent messages) */}
              {isSender && (
                <div className="ml-3 mt-auto">
                  <div className="w-12 h-12 rounded-full border-2 border-blue-600 overflow-hidden shadow-sm">
                    <img
                      src={authUser.profilePic || userPlaceholder}
                      alt="Sender Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
        <div ref={messageEndRef} />
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;

import { Download, File } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { IoMdCash } from "react-icons/io";
import userPlaceholder from "../assets/images/user.png";
import TipPaymentForm from "../core/tipPaymentForm";
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
    createTipPaymentIntent,
    saveTip,
    getTipByMessageId
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
const [messageTips, setMessageTips] = useState({});

const [tippingMessage, setTippingMessage] = useState(null); // message being tipped
const [tipAmount, setTipAmount] = useState(""); // amount to tip

 
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
useEffect(() => {
  const fetchTips = async () => {
    const tipsMap = {};
    for (const msg of messages) {
      try {
        const tip = await getTipByMessageId(msg._id);
        if (tip) {
          tipsMap[msg._id] = tip.amount;
        }
      } catch (err) {
        console.error(`Error fetching tip for message ${msg._id}`, err);
      }
    }
    setMessageTips(tipsMap);
  };

  if (messages.length > 0) {
    fetchTips();
  }
}, [messages, getTipByMessageId]);

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
    <div className="flex-1 flex flex-col overflow-auto ">
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
                  className={`block mt-2 text-xs opacity-70 ${isSender ? "text-blue-100 text-right" : "text-blue-700 text-left"}`}
                >
                  {formatMessageTime(message.createdAt)}
                </time>

                {/* Tip button for all messages except sender's own */}
                {!isSender && !messageTips[message._id] && (
  <button
    onClick={() => setTippingMessage(message)}
    className="mt-2 text-blue-600 hover:underline text-xs font-semibold"
    title={`Tip ${selectedUser.name || "user"}`}
  >
    Tip <IoMdCash size={16} className="inline-block text-green-500" />
  </button>
)}

              </div>
              {messageTips[message._id] && (
  <div className="mt-2 ml-2 text-sm text-yellow-600 font-medium">
    <IoMdCash size={16} className="inline-block text-green-500" /> Tipped: ₹{messageTips[message._id]}
  </div>
)}


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

      {tippingMessage && (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    onClick={() => setTippingMessage(null)}
  >
    <div
      className="bg-white p-6 rounded-lg shadow-lg w-80"
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className="text-lg font-semibold mb-4">
        Tip {selectedUser.name || "user"}
      </h3>

      <input
        type="number"
        min="1"
        placeholder="Enter tip amount ($)"
        value={tipAmount}
        onChange={(e) => setTipAmount(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* Import and use your TipPaymentForm here */}
      <TipPaymentForm
        tipAmount={tipAmount}
        receiverId={selectedUser._id}
        tipperId={authUser._id}
         messageId={tippingMessage?._id} 

        createTipPaymentIntent={createTipPaymentIntent} 
          saveTip={saveTip} 
        // pass backend function to create payment intent
        onClose={() => {
          setTippingMessage(null);
          setTipAmount("");
        }}
      />

      <button
        onClick={() => setTippingMessage(null)}
        className="mt-4 w-full py-2 rounded bg-gray-300 hover:bg-gray-400"
      >
        Cancel
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default ChatContainer;

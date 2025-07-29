import { useEffect, useRef, useState } from "react";
import { IoMdCash } from "react-icons/io";
import userPlaceholder from "../assets/images/group.png";
import GroupChatHeader from "../components/groupChatHeader";
import GroupMessageInput from "../components/groupMessageInput";
import TipPaymentForm from "../core/tipPaymentForm";
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

  const [tippingMessage, setTippingMessage] = useState(null);
  const [tipAmount, setTipAmount] = useState("");
  const [groupMessageTips, setGroupMessageTips] = useState({});
  const { getTipByMessageId, createTipPaymentIntent, saveTip } = useChatStore();

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
      setGroupMessageTips(tipsMap);
    };

    if (messages.length > 0) {
      fetchTips();
    }
  }, [messages, getTipByMessageId]);

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
        <mark key={index} className="bg-blue-700">{part}</mark>
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

                  {message.text && (
                    <p className="leading-relaxed">
                      {highlightMatch(message.text, searchQuery)}
                    </p>
                  )}

                  {!isSender && !groupMessageTips[message._id] && (
                    <button
                      onClick={() => setTippingMessage(message)}
                      className="mt-2 text-blue-600 hover:underline text-xs font-semibold ml-32"
                      title={`Tip ${message.senderId?.fullName || "user"}`}
                    >
                      Tip{" "}
                      <IoMdCash size={16} className="inline-block text-green-500" />
                    </button>
                  )}

                  {groupMessageTips[message._id] && (
                    <div className="mt-2 text-yellow-600 ml-32 text-xs font-medium">
                      <IoMdCash size={16} className="inline-block text-green-500" /> Tipped: Rs.
                      {groupMessageTips[message._id]}
                    </div>
                  )}

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
              Tip {tippingMessage?.senderId?.fullName || "user"}
            </h3>

            <input
              type="number"
              min="1"
              placeholder="Enter tip amount (Rs)"
              value={tipAmount}
              onChange={(e) => setTipAmount(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <TipPaymentForm
              tipAmount={tipAmount}
              receiverId={tippingMessage?.senderId?._id}
              tipperId={authUser._id}
              messageId={tippingMessage?._id}
              transactionId={tippingMessage?._id}
              createTipPaymentIntent={createTipPaymentIntent}
              saveTip={saveTip}
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

export default GroupChatContainer;

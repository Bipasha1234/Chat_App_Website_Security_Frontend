import { Send } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useChatStore } from "../store/useChatStore";

const MessageInput = () => {
  const [text, setText] = useState("");
  const { sendGroupMessage } = useChatStore();
  const [isTextEntered, setIsTextEntered] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!text.trim()) return;

    try {
      const messageData = { text: text.trim() };
      await sendGroupMessage(messageData);
      setText("");
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message. Please try again.");
    }
  };

  useEffect(() => {
    setIsTextEntered(text.trim() !== "");
  }, [text]);

  return (
    <div className="p-4 w-full relative">
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1">
          <input
            type="text"
            className="py-2 px-3 rounded-lg border outline-none shadow-sm w-full sm:text-md text-sm"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isTextEntered ? "" : "opacity-50 cursor-not-allowed"
          }`}
          disabled={!isTextEntered}
          aria-label="Send message"
        >
          <Send size={22} className="text-gray-600" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;

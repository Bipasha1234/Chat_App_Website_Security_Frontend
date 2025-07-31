import { File, Plus, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useChatStore } from "../store/useChatStore";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [documentPreview, setDocumentPreview] = useState(null);
  const [documentFile, setDocumentFile] = useState(null);
  const [isTextEntered, setIsTextEntered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const documentInputRef = useRef(null);

  const { sendMessage, getMessages, selectedUser } = useChatStore();

  const handleDocumentChange = (e) => {
    setShowMenu(false);
    const file = e.target.files[0];
    if (file) {
      setDocumentFile(file);
      setDocumentPreview(file.name);
    } else {
      toast.error("Please select a valid document.");
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !documentFile) return;

    try {
      const messageData = { text: text.trim() };

      if (documentFile) {
        const reader = new FileReader();
        reader.readAsDataURL(documentFile);
        reader.onloadend = async () => {
          messageData.document = reader.result;
          messageData.documentName = documentFile.name;

          await sendMessage(messageData);

          if (selectedUser?._id) {
            await getMessages(selectedUser._id);
          }

          setDocumentFile(null);
          setDocumentPreview(null);
        };
      } else {
        await sendMessage(messageData);

        if (selectedUser?._id) {
          await getMessages(selectedUser._id);
        }
      }

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
      {documentPreview && (
        <div className="mb-3 flex items-center gap-2">
          <span className="text-sm">{documentPreview}</span>
          <button onClick={() => setDocumentPreview(null)} className="text-red-500">
            <X size={16} />
          </button>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="relative">
          <button
            type="button"
            className="w-10 h-10 rounded-full flex items-center justify-center p-2"
            onClick={() => setShowMenu(!showMenu)}
            aria-label="Attach file"
          >
            <Plus size={24} className="text-gray-600" />
          </button>
          {showMenu && (
            <div className="absolute bottom-16 left-0 mt-2 w-36 bg-base-100 shadow-md rounded-md border p-2 flex flex-col gap-2">
              <button
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md"
                onClick={() => {
                  setShowMenu(false);
                  documentInputRef.current?.click();
                }}
              >
                <File size={20} className="text-purple-500" />
                Document
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="py-2 px-3 rounded-lg border outline-none bg-base-100 shadow-sm flex-1 sm:text-md text-sm"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
            className="hidden"
            ref={documentInputRef}
            onChange={handleDocumentChange}
          />
        </div>

        <button
          type="submit"
          className="w-10 h-10 rounded-full flex items-center justify-center"
          disabled={!text.trim() && !documentFile}
          aria-label="Send message"
        >
          <Send size={22} className="text-gray-600" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;

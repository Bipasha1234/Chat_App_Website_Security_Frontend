import ChatContainer from "../../components/ChatContainer";
import HeaderNav from "../../components/HeaderNav";
import MessagingSideBar from "../../components/messagingSideBar";
import NoChatSelected from "../../components/NoChatSelected";
import { useChatStore } from "../../store/useChatStore";

const Chat = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="bg-base-200 min-h-screen flex flex-col">
      {/* Top Header */}
      <HeaderNav />

      {/* Main Content Area below header */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <MessagingSideBar />

        {/* Main Chat Section */}
        <div className="bg-base-100 rounded-lg shadow w-full h-[calc(100vh-4rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;

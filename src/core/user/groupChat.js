import HeaderNav from "../../components/HeaderNav";
import NoChatSelected from "../../components/NoChatSelected";
import GroupChatContainer from "../../components/groupChatContainer";
import GroupMessagingSideBar from "../../components/groupMessagingSideBar";
import { useChatStore } from "../../store/useChatStore";

const GroupChat = () => {
  const { selectedGroup } = useChatStore(); 

  return (
    <div className="bg-base-200 min-h-screen flex flex-col">
      {/* Top Navigation */}
      <HeaderNav />

      {/* Main Chat Layout */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <GroupMessagingSideBar />

        {/* Main Chat Window */}
        <div className="bg-base-100 rounded-lg shadow-cl w-full h-[calc(100vh-4rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            {/* Chat Content */}
            {!selectedGroup ? <NoChatSelected /> : <GroupChatContainer />} 
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupChat;

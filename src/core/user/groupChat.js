import NoChatSelected from "../../components/NoChatSelected";
import SideBar from "../../components/SideBar";
import GroupChatContainer from "../../components/groupChatContainer";
import GroupMessagingSideBar from "../../components/groupMessagingSideBar";
import { useChatStore } from "../../store/useChatStore";

const GroupChat = () => {
  const { selectedGroup } = useChatStore(); 

  return (
    <div className="bg-base-200"> 
      <div className="flex">
        <SideBar /> 
        <div className="bg-base-100 rounded-lg shadow-cl w-full h-[calc(120vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <GroupMessagingSideBar /> 
            
            {!selectedGroup ? <NoChatSelected /> : <GroupChatContainer/>} 
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupChat;

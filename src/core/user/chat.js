import ChatContainer from "../../components/ChatContainer";
import MessagingSideBar from "../../components/messagingSideBar";
import NoChatSelected from "../../components/NoChatSelected";
import SideBar from "../../components/SideBar";
import { useChatStore } from "../../public/store/useChatStore";
const Chat = () => {
  const { selectedUser } = useChatStore();
  //  const { logout, authUser } = useAuthStore();

  return (
    
    <div className=" bg-base-200">
      
       
      <div className="flex   ">
      <SideBar/>
    
      
        <div className="bg-base-100 rounded-lg shadow-cl w-full  h-[calc(120vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
          <MessagingSideBar/>
         
        

            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}

            {/* {authUser && (
              <>
                <Link to={"/user/profile-setup"} className={`btn btn-sm gap-2`}>
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button className="flex gap-2 items-center" onClick={logout}>
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Chat;

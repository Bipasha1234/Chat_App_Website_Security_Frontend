
const NoChatSelected = () => {
  return (
    <div className="w-full h-screen flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50">
      <div className="max-w-md text-center space-y-2">
      
        <div className="flex justify-center items-center gap-1 mb-4">

        <h2 className="text-2xl font-bold">Welcome to Chattix!</h2>
        
          {/* <div className="relative">
            <div
              className="w-60 h-24 rounded-2xl flex items-center justify-center animate-bounce"
            >
              {/* <img src={chattix} alt="Chattix Icon" className="w-60 h-24" /> */}
            {/* </div> */}
          {/* </div> */} 
        </div>
        <p className="text-sm">
          Select a conversation from the Messaging sidebar to start chatting.
        </p>

        
      </div>
    </div>
  );
};

export default NoChatSelected;

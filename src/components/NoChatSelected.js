
const NoChatSelected = () => {
  return (
    <div className="w-full h-screen flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50">
      <div className="max-w-md text-center space-y-2">
      
        <div className="flex justify-center items-center gap-1 mb-4">

        <h2 className="text-2xl font-bold">Welcome to MessageI!</h2>
      
        </div>
        <p className="text-sm">
          Please, select a conversation from the sidebar for chat.
        </p>

        
      </div>
    </div>
  );
};

export default NoChatSelected;

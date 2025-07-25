import { useEffect } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./core/home.js";
import Login from "./core/login.js";
import Register from "./core/register.js";
import Chat from "./core/user/chat.js";
import GroupChat from "./core/user/groupChat.js";
import { useAuthStore } from "./store/useAuthStore.js";

function App() {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();

  console.log({ onlineUsers });

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser });

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
      
      </div>
    );

  return (
    
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
       
  
        <Route path="/register" element={!authUser ? <Register /> : <Navigate to="/chat" />} />
        <Route path="/login-customer" element={!authUser ? <Login /> : <Navigate to="/chat" />} />
            <Route path="/chat" element={authUser ? <Chat /> : <Navigate to="/login-customer" />} />
             <Route path="/group/chat" element={authUser ? <GroupChat/> : <Navigate to="/login-customer" />} />
      </Routes>
      
    </Router>
   
  );
}

export default App;
import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useChatStore } from "../../store/useChatStore";

const AdminDashboardComponent = () => {
  const getUsers = useChatStore((state) => state.getUsers);
  const users = useChatStore((state) => state.users);

  const getGroups = useChatStore((state) => state.getGroups);
  const groups = useChatStore((state) => state.groups);

  const getMessages = useChatStore((state) => state.getMessages);
  const messages = useChatStore((state) => state.messages);

  const logout = useAuthStore((state) => state.logout);

  // Local state for loading indicator
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch users and groups first
    async function fetchData() {
      setLoading(true);
      await getUsers();
      await getGroups();

      // To get messages count, one way is to sum all messages per user
      // But if messages are large, maybe just fetch messages of each user here for demo just get for first user or skip
      // Or you can get total messages count from backend directly if API supports

      // For demo, fetch messages for first user (if any)
      if (users.length > 0) {
        await getMessages(users[0]._id);
      }
      setLoading(false);
    }
    fetchData();
  }, [getUsers, getGroups, getMessages, users.length]);

  const handleLogout = () => {
    logout();
  };

  if (loading)
    return (
      <div
        style={{
          color: "#0056b3",
          padding: 20,
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        Loading...
      </div>
    );

  return (
    <div style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      {/* Header bar */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#007bff",
          color: "white",
          padding: "10px 20px",
          fontWeight: "bold",
          fontSize: "18px",
        }}
      >
        <div style={{ color: "#cce5ff" }}>Welcome Admin, here are your stats:</div>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#0056b3",
            border: "none",
            color: "white",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Logout
        </button>
      </header>

      {/* Stats Cards */}
      <main
        style={{
          padding: "20px",
          backgroundColor: "#e9f0ff",
          minHeight: "calc(100vh - 56px)",
          color: "#003366",
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            backgroundColor: "#cce0ff",
            flex: "1 1 200px",
            padding: "20px",
            borderRadius: "6px",
            textAlign: "center",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          }}
        >
          <h3>Total Users</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold" }}>{users.length}</p>
        </div>

        <div
          style={{
            backgroundColor: "#cce0ff",
            flex: "1 1 200px",
            padding: "20px",
            borderRadius: "6px",
            textAlign: "center",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          }}
        >
          <h3>Total Groups</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold" }}>{groups.length}</p>
        </div>

        <div
          style={{
            backgroundColor: "#cce0ff",
            flex: "1 1 200px",
            padding: "20px",
            borderRadius: "6px",
            textAlign: "center",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          }}
        >
          <h3>Total Messages (for first user)</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold" }}>{messages.length}</p>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardComponent;

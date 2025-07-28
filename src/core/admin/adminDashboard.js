import { LogOut } from "lucide-react"; // optional: can use any icon set
import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useChatStore } from "../../store/useChatStore";

const AdminDashboardComponent = () => {
  const getUsers = useChatStore((s) => s.getUsers);
  const getGroups = useChatStore((s) => s.getGroups);
  const getMessages = useChatStore((s) => s.getMessages);
  const getAdminDashboard = useChatStore((s) => s.getAdminDashboard);

  const users = useChatStore((s) => s.users);
  const groups = useChatStore((s) => s.groups);
  const messages = useChatStore((s) => s.messages);
  const adminDashboardData = useChatStore((s) => s.adminDashboardData);
  const logout = useAuthStore((s) => s.logout);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      await getUsers();
      await getGroups();
      if (users.length > 0) await getMessages(users[0]._id);
      await getAdminDashboard();
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) return <div className="text-blue-600 p-6 text-xl">Loading your dashboard...</div>;

  return (
    <div className="min-h-screen bg-blue-50 font-sans">
      {/* Header */}
      <header className="bg-blue-700 text-white px-8 py-5 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold">MessageI</h1>
        <button
          onClick={logout}
          className="bg-white text-blue-700 hover:bg-gray-100 px-4 py-2 rounded flex items-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </header>

      {/* Title */}
      <div className="px-8 py-4">
        <h2 className="text-xl text-blue-800 font-semibold mb-2">Hi Admin, here’s what’s happening:</h2>
        <p className="text-gray-600">Get insights on user activity, chat performance, and engagement metrics.</p>
      </div>

      {/* Dashboard Stats */}
      <main className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={users.length} desc="All registered users on the platform." />
        <StatCard title="Total Groups" value={groups.length} desc="Groups created for chatting." />
        <StatCard title="Total Messages" value={adminDashboardData?.totalMessages || messages.length} desc="All messages sent till date." />
        <StatCard title="Blocked Users" value={adminDashboardData?.blockedUsers || 0} desc="Users currently blocked." />
        <StatCard title="Total Chats" value={adminDashboardData?.totalChats || users.length} desc="One-on-one chat instances." />
        <StatCard title="Tips Given" value={adminDashboardData?.totalTips || 0} desc="Tips shared across users." />
        <StatCard title="Online Users Now" value={adminDashboardData?.onlineUsers || 0} desc="Users currently active." />
      </main>
    </div>
  );
};

const StatCard = ({ title, value, desc }) => (
  <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition">
    <div className="w-20 h-20 mx-auto mb-3 flex items-center justify-center rounded-full border-4 border-blue-300 bg-blue-50">
      <p className="text-2xl font-bold text-blue-700">{value}</p>
    </div>
    <h3 className="text-blue-800 font-semibold text-lg">{title}</h3>
    <p className="text-gray-500 text-sm mt-1">{desc}</p>
  </div>
);

export default AdminDashboardComponent;

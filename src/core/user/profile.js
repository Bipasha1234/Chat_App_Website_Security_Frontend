import { Camera, Mail, Pencil, User } from "lucide-react";
import { useState } from "react";
import userPlaceholder from "../../assets/images/user.png";
import ChatContainer from "../../components/ChatContainer";
import HeaderNav from "../../components/HeaderNav";
import NoChatSelected from "../../components/NoChatSelected";
import { useAuthStore } from "../../store/useAuthStore";
import { useChatStore } from "../../store/useChatStore";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const { selectedUser } = useChatStore();

  const [selectedImg, setSelectedImg] = useState(null);
  const [editingFullName, setEditingFullName] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [newFullName, setNewFullName] = useState(authUser?.fullName || "");
  const [newEmail, setNewEmail] = useState(authUser?.email || "");

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  const handleSave = () => {
    if (newFullName !== authUser?.fullName || newEmail !== authUser?.email) {
      updateProfile({ fullName: newFullName, email: newEmail });
    }
    setEditingFullName(false);
    setEditingEmail(false);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Top Navigation */}
      <HeaderNav />

      {/* Page Content */}
      <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
        {/* Left Panel - Profile */}
        <div className="w-96 p-4 bg-white border-r overflow-y-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Profile</h2>

          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-2 mb-6">
            <div className="relative">
              <img
                src={selectedImg || authUser?.profilePic || userPlaceholder}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-black"
              />
              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 bg-[#69aa92] hover:bg-[#82c6ad] text-white p-2 rounded-full cursor-pointer ${
                  isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                }`}
              >
                <Camera className="w-5 h-5" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-xs text-gray-500">
              {isUpdatingProfile ? "Uploading..." : "Click camera icon to change photo"}
            </p>
          </div>

          {/* Full Name */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-sm">
              <User size={16} />
              <span>Full Name</span>
            </div>
            <div className="flex items-center gap-2">
              {editingFullName ? (
                <input
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  className="border rounded px-2 text-sm"
                />
              ) : (
                <p className="text-sm px-2">{authUser?.fullName}</p>
              )}
              <button onClick={() => setEditingFullName((prev) => !prev)}>
                <Pencil size={16} />
              </button>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Mail size={16} />
              <span>Email</span>
            </div>
            <div className="flex items-center gap-2">
              {editingEmail ? (
                <input
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="border rounded px-2 text-sm"
                />
              ) : (
                <p className="text-sm px-2">{authUser?.email}</p>
              )}
              <button onClick={() => setEditingEmail((prev) => !prev)}>
                <Pencil size={16} />
              </button>
            </div>
          </div>

          {/* Save Button */}
          {(editingFullName || editingEmail) && (
            <button
              onClick={handleSave}
              className="mt-4 w-full bg-emerald-700 text-white py-2 rounded"
              disabled={isUpdatingProfile}
            >
              Save
            </button>
          )}

          {/* Account Info */}
          <div className="mt-6 border-t pt-4">
            <h3 className="text-md font-medium text-gray-700 mb-2">Account Information</h3>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span>Member Since:</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="text-green-600 font-semibold">Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Chat Preview */}
        <div className="flex-1 bg-white shadow-inner overflow-hidden">
          {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

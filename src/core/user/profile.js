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
    <div className="bg-gray-100 min-h-screen flex flex-col">
        <HeaderNav />
      {/* Main Content */}
      <div className="flex flex-1 ">
        {/* Left Panel - Profile */}
        <div className="w-96  p-6 bg-white border-r overflow-y-auto ">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Profile</h2>

          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-2 mb-6">
            <div className="relative">
              <img
                src={selectedImg || authUser?.profilePic || userPlaceholder}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 "
              />
              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full cursor-pointer transition ${{
                  'animate-pulse pointer-events-none': isUpdatingProfile
                }}`}
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
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to change photo"}
            </p>
          </div>

          {/* Full Name */}
          <div className="mb-4">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <User size={16} /> Full Name
            </label>
            <div className="flex items-center gap-2 mt-1">
              {editingFullName ? (
                <input
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  className="flex-1 border px-3 py-1 rounded text-sm"
                />
              ) : (
                <p className="text-sm text-gray-800 flex-1">{authUser?.fullName}</p>
              )}
              <button onClick={() => setEditingFullName((prev) => !prev)}>
                <Pencil size={16} />
              </button>
            </div>
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Mail size={16} /> Email
            </label>
            <div className="flex items-center gap-2 mt-1">
              {editingEmail ? (
                <input
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="flex-1 border px-3 py-1 rounded text-sm"
                />
              ) : (
                <p className="text-sm text-gray-800 flex-1">{authUser?.email}</p>
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
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition mt-4"
              disabled={isUpdatingProfile}
            >
              Save Changes
            </button>
          )}

          {/* Account Info */}
          <div className="mt-6 pt-4 border-t">
            <h3 className="text-md font-semibold text-gray-700 mb-2">Account Info</h3>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span>Member Since:</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
            </div>
          </div>
        </div>

     <div className="bg-white rounded-lg shadow w-full h-[calc(100vh-4rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;

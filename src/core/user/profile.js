import { Camera, Mail, Pencil, User } from "lucide-react"; // Import Pencil icon for edit
import { useState } from "react";
import userPlaceholder from "../../../assets/images/user.png";
import ChatContainer from "../../../components/ChatContainer";
import NoChatSelected from "../../../components/NoChatSelected";
import SideBar from "../../../components/SideBar";
import { useAuthStore } from "../../../store/useAuthStore";
import { useChatStore } from "../../../store/useChatStore";


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
      console.log("Updated Profile Data: ", { fullName: newFullName, email: newEmail }); 
      updateProfile({ fullName: newFullName, email: newEmail });
    }
    setEditingFullName(false);
    setEditingEmail(false);
  };

  return (
    <div className={`flex font-open-sans border-r border-base-300 h-screen ${theme === "dark" ? "" : "bg-gray-100"}`}>
      <SideBar active="Profile" />

      <div className="flex-1 max-w-sm border-r border-base-300">
        <div
          className={`shadow px-4 py-8 space-y-5 ${theme === "dark" ? " text-white" : "bg-opacity-60 bg-white"} h-full`}
        >
          <div className="text-start space-y-1">
            <p className={`text-xl font-semibold ${theme === "dark" ? "text-white" : "text-gray-800"}`}>Profile</p>
          </div>

          {/* Avatar Upload Section */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <img
                src={selectedImg || authUser?.profilePic || userPlaceholder}
                alt="Profile"
                className="w-34 h-32 rounded-full object-cover border-4 border-black"
              />

              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 bg-[#69aa92] hover:bg-[#82c6ad] text-white p-2 rounded-full cursor-pointer transition-transform duration-200 ${
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
            <p className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>

          {/* Profile Details */}
          <div className="flex justify-center items-center">
            <div className="grid grid-cols-1 gap-1 w-80">
              {/* Full Name */}
              <div className="p-4 rounded-lg shadow-sm space-y-1.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="text-xs">FullName</span>
                </div>
                <div className="flex items-center gap-2 mr-4">
                  {editingFullName ? (
                    <input
                      type="text"
                      value={newFullName}
                      onChange={(e) => setNewFullName(e.target.value)}
                      className="px-2 text-xs py-2.5 rounded-lg border"
                    />
                  ) : (
                    <p className="px-8 text-xs py-2.5 rounded-lg border">{authUser?.fullName}</p>
                  )}
                  <button
                    onClick={() => setEditingFullName((prev) => !prev)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Email */}
              <div className="p-4 rounded-lg shadow-sm space-y-1.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span className="text-xs">Email</span>
                </div>
                <div className="flex items-center gap-2">
                  {editingEmail ? (
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="text-xs px-5 py-2.5 rounded-lg border"
                    />
                  ) : (
                    <p className="text-xs px-5 py-2.5 rounded-lg border">{authUser?.email}</p>
                  )}
                  <button
                    onClick={() => setEditingEmail((prev) => !prev)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          {(editingFullName || editingEmail) && (
            <div className="flex justify-center mt-4">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-emerald-700 text-white rounded-lg"
                disabled={isUpdatingProfile}
              >
                Save
              </button>
            </div>
          )}

          {/* Account Information Section */}
          <div className="mt-6 p-2 rounded-xl shadow-sm">
            <h2 className={`text-xl font-medium ${theme === "dark" ? "text-white" : "text-gray-800"} mb-4`}>
              Account Information
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-gray-300">
                <span className="">Member Since</span>
                <span className="">{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="">Account Status</span>
                <span className="text-green-600 font-semibold">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-[3]">
        <div className="bg-base-100 shadow-cl w-100 h-[calc(120vh-8rem)]">
          <div className="flex h-full overflow-hidden">
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

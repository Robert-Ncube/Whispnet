import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Mail, User, Edit, Check, X } from "lucide-react";
import Avatar from "../components/Avatar"; // Import the new component

const Profile = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");

  const user = authUser?.user || {};

  // Initialize edited name
  useEffect(() => {
    setEditedName(user.fullname || "");
  }, [user.fullname]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      try {
        await updateProfile({ profilePic: base64Image });
      } catch (error) {
        setSelectedImg(null); // Reset on error
      }
    };
  };

  const handleNameUpdate = async () => {
    if (editedName.trim() && editedName !== user.fullname) {
      await updateProfile({ fullname: editedName });
    }
    setIsEditingName(false);
  };

  return (
    <div className="h-fit pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center  border-b-4 border-base-10 py-1">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* Avatar Section using new component */}
          <div className="flex flex-col items-center gap-4">
            <label htmlFor="avatar-upload" className="cursor-pointer">
              <Avatar
                user={user}
                image={selectedImg}
                size="xxl"
                showEditIcon
                className=""
              />
              <input
                type="file"
                id="avatar-upload"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUpdatingProfile}
              />
            </label>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile
                ? "Uploading..."
                : "Click the avatar to update your photo"}
            </p>
          </div>

          <div className="space-y-6">
            {/* Full Name Section */}
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>

              {isEditingName ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="px-4 py-2.5 bg-base-200 rounded-lg border flex-1"
                    disabled={isUpdatingProfile}
                    autoFocus
                  />
                  <button
                    onClick={handleNameUpdate}
                    disabled={isUpdatingProfile}
                    className="p-2 bg-green-500 rounded-lg hover:bg-green-600"
                  >
                    <Check className="w-5 h-5 text-white" />
                  </button>
                  <button
                    onClick={() => setIsEditingName(false)}
                    className="p-2 bg-red-500 rounded-lg hover:bg-red-600"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <p className="px-4 py-2.5 bg-base-200 rounded-lg border flex-1">
                    {user?.fullname}
                  </p>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="p-2 rounded-lg hover:bg-base-100"
                    disabled={isUpdatingProfile}
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Email Section */}
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {user?.email}
              </p>
            </div>
          </div>

          {/* Account Info Section */}
          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

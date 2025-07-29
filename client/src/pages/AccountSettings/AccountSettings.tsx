import { useEffect, useState } from "react";
import { useAuth } from "@/auth/context/AuthContext";
import axios from "axios";
import EditProfileModal from "./EditProfileModal";

type FullUser = {
  _id: string;
  username: string;
  email: string;
  role: string;
  bio?: string;
  createdAt: string;
  testing?: number;
  image?: string;
};

const AccountSettings = () => {
  const { token } = useAuth();
  const [userData, setUserData] = useState<FullUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(res.data);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      }
    };

    if (token) fetchUserData();
  }, [token]);

  const formattedDate = userData?.createdAt
    ? new Date(userData.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown";

  const handleProfileUpdate = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(res.data);
    } catch (err) {
      console.error("Failed to refresh user after update:", err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 py-6">
      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={userData}
        token={token}
        onSave={handleProfileUpdate}
      />

      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl">
        {/* LEFT SIDE */}
        <div className="flex flex-col items-center w-full lg:w-1/3 bg-darkgray border-2 border-neonblue rounded-2xl p-6 shadow-xl text-white">
          <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-neonblue shadow-md">
            <img
              src={
                userData?.image
                  ? `http://localhost:5000/uploads/${userData.image}`
                  : "default.png"
              }
              alt="Display"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="text-center mt-4">
            <h2 className="text-2xl font-bold text-neonblue">
              @{userData?.username || "username"}
            </h2>
            <button
              className="mt-2 px-5 py-1.5 bg-neonblue hover:bg-blue-600 text-sm font-semibold rounded-full shadow transition"
              onClick={() => setIsModalOpen(true)}
            >
              Edit Profile
            </button>
          </div>

          <div className="w-full mt-6 space-y-3 bg-darkbg border border-neonblue rounded-lg p-4 text-sm shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Joined</span>
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Total Builds</span>
              <span>0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Role</span>
              <span className="text-neonblue font-medium">
                {userData?.role || "Student"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Email</span>
              <span className="truncate max-w-[140px] text-right">
                {userData?.email}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Testing</span>
              <span>{userData?.testing}</span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col w-full lg:w-2/3 space-y-6">
          <div className="bg-darkgray border-2 border-neonblue rounded-xl p-5 text-white text-sm min-h-[100px] shadow-lg">
            <span className="text-neonblue font-semibold block mb-2">Bio:</span>
            {userData?.bio || (
              <span className="text-gray-400">No bio added yet.</span>
            )}
          </div>

          <div className="bg-darkgray border-2 border-neonblue rounded-xl p-5 text-white shadow-lg">
            <span className="text-neonblue font-semibold text-base block mb-3">
              Saved Builds
            </span>
            <p className="text-gray-400 text-sm">
              You haven't saved any builds yet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;

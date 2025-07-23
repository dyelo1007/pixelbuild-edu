import { useEffect, useState } from "react";
import { useAuth } from "@/auth/context/AuthContext";
import axios from "axios";

{
  /**Edit Profile Modal */
}
import EditProfileModal from "./EditProfileModal";

interface FullUser {
  _id: string;
  username: string;
  email: string;
  role: string;
  bio?: string;
  createdAt: string;
  testing?: number;
  image?: string;
} // temporary muna to

const AccountSettings = () => {
  const {token } = useAuth();
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
        console.log("Fetched user:", res.data);
        setUserData(res.data as FullUser);
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

  //Eto yung para mag reflect agad data ka close ng modal
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
    <div className="flex justify-center items-center h-screen">
      {/**
       * Close Open Close Open
       */}
      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={userData}
        token={token}
        onSave={handleProfileUpdate}
      />
      <div className="flex w-[1000px] h-[600px] p-6 rounded-md gap-6">
        <div className="flex flex-col items-center w-[300px] h-full bg-darkgray border-2 border-neonblue rounded-sm p-4">
          {/* Profile Picture */}
          <div className="mb-4 mt-2">
            <img
              src={userData?.image ? `http://localhost:5000/uploads/${userData.image}` : "default.png"}
              alt="Display Picture"
              className="w-24 h-24 outline-1 outline-white"
            />
          </div>
          <div className="text-neonblue font-bold text-xl mb-3">
            @{userData?.username || "username"}
          </div>

          <button
            className="bg-neonblue text-white px-4 py-1 mb-6 outline-white outline-1 transition cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            Edit Profile
          </button>
          <ul className="text-white text-sm text-left space-y-2">
            <li>• Joined: {formattedDate}</li>
            <li>• Total Builds: 0</li>
            <li className="text-2xl">• Role: {userData?.role || "Student"}</li>
            <li> Email: {userData?.email}</li>
            <li> Fetch from Database: {userData?.testing}</li>
          </ul>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col flex-grow justify-between w-[650px] h-full">
          <div className="h-[120px] bg-darkgray border-2 border-neonblue rounded-sm p-4 text-white text-sm leading-snug">
            <span className="text-neonblue font-semibold">Bio: </span>
           {userData?.bio}
          </div>
          <div className="flex flex-col justify-start h-[430px] bg-darkgray border-2 border-neonblue rounded-sm p-4 text-white">
            <span className="text-neonblue font-semibold mb-2">
              Saved Builds
            </span>
            {/* Add build components here later */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;

import { useEffect, useState } from "react";
import { useAuth } from "../auth/context/AuthContext";
import type { User } from "../auth/context/AuthContext";
import axios from "axios";


const AccountSettings = () => {
  const { user: contextUser, token } = useAuth();
  const [userData, setUserData] = useState< User | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Fetched user:", res.data);
        setUserData(res.data as User);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      }
    };

    if (token) {
      fetchUserData();
    } else if (contextUser && contextUser.createdAt) {
      setUserData(contextUser as User);
    }
  }, [token]);

  const formattedDate = userData?.createdAt
    ? new Date(userData.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown";


  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex w-[1000px] h-[600px] p-6 rounded-md gap-6">
        <div className="flex flex-col items-center w-[300px] h-full bg-darkgray border-2 border-neonblue rounded-sm p-4">
          {/* Profile Picture */}
          <div className="mb-4 mt-2">
            <img
              src=""
              alt="Display Picture"
              className="w-24 h-24 outline-1 outline-white"
            />
          </div>
          <div className="text-neonblue font-bold text-xl mb-3">
            @{userData?.username || "username"}
          </div>
          <button className="bg-neonblue text-white px-4 py-1 mb-6 outline-white outline-1 transition cursor-pointer">
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
            Enthusiast builder, obsessed with airflow and RGB. Looking for the
            perfect mini-ITX setup.
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

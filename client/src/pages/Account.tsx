import { useAuth } from "../auth/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Account = () => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  {
    /**
    //
    SAMPLE OR PLACEHOLDER TEXTS ARE USED
    //
    */
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex w-[1000px] h-[600px]  p-6 rounded-md gap-6">
        <div className="flex flex-col items-center w-[300px] h-full bg-darkgray border-2 border-neonblue rounded-sm p-4">
          {/* PLACEHOLDER FOR DISPLAY PICTURE */}
          <div className="mb-4 mt-2">
            <img
              src=""
              alt="Display Picture"
              className="w-24 h-24 outline-1 outline-white"
            />
          </div>
          <div className="text-neonblue font-bold text-xl mb-3">
            @{user?.username || "username"}
          </div>
          <button className="bg-neonblue text-white px-4 py-1 mb-6 outline-white outline-1 transition cursor-pointer">
            Edit Profile
          </button>
          <ul className="text-white text-sm text-left space-y-2">
            <li>• Joined: April 2025</li>
            <li>• Total Builds: 0</li>
            <li className="text-2xl">• Role: {user?.role || "Student"}</li>
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
            {/* BUILDS HERE */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;

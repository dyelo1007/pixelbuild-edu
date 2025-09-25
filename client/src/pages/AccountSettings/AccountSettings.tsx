import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/auth/context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import API from "@/utils/api";
import EditProfileModal from "./EditProfileModal";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";


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

type SavedBuild = {
  _id: string;
  name: string;
  parts: {
    case?: string;
    motherboard?: string;
    processor?: string;
    gpu?: string;
    ram?: string;
    storage?: string;
    psu?: string;
    cooler?: string;
  };
};


const AccountSettings = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<FullUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedBuilds, setSavedBuilds] = useState<SavedBuild[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [userRes, buildsRes] = await Promise.all([
        API.get("/user/me"),
        API.get("/savedbuilds"),
      ]);
      setUserData(userRes.data);
      setSavedBuilds(buildsRes.data);
    } catch (err) {
      console.error("Failed to fetch account data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formattedDate = userData?.createdAt
    ? new Date(userData.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown";

  const uploadBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  if (loading) {
    return <AccountSettingsSkeleton />;
  }

  const handleDeleteBuild = async (id: string) => {
    if (!token) return;

    try {
      await axios.delete(`http://localhost:5000/api/savedbuilds/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update state so UI refreshes without reload
      setSavedBuilds((prev) => prev.filter((build) => build._id !== id));
    } catch (err) {
      console.error("Failed to delete build:", err);
      alert("Failed to delete the build. Please try again.");
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={userData}
        onSave={fetchData}
      />

      <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto">
        {/* LEFT  Profile Card */}
        <Card className="w-full lg:w-1/3 border-neonblue/20 bg-lightbg dark:bg-darkbg flex flex-col items-center p-6">
          <Avatar className="w-28 h-28 border-4 border-neonblue">
            <AvatarImage
              src={
                userData?.image
                  ? `${uploadBaseUrl}/uploads/${userData.image}`
                  : "default.png"
              }
            />
            <AvatarFallback className="text-4xl">
              {userData?.username.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="text-center mt-4">
            <h2 className="text-2xl font-bold text-neonblue">
              @{userData?.username || "username"}
            </h2>
            <Button
              className="mt-2 bg-neonblue text-black hover:bg-hoverprimary"
              size="sm"
              onClick={() => setIsModalOpen(true)}
            >
              Edit Profile
            </Button>
          </div>
          <div className="w-full mt-6 space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Joined</span>
              <span className="text-gray-900 dark:text-white font-medium">
                {formattedDate}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">
                Total Builds
              </span>
              <span className="text-gray-900 dark:text-white font-medium">
                {savedBuilds.length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Role</span>
              <span className="font-medium text-neonblue capitalize">
                {userData?.role}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Email</span>
              <span className="truncate max-w-[150px] text-gray-900 dark:text-white font-medium">
                {userData?.email}
              </span>
            </div>
          </div>
        </Card>

        {/* RIGHT Bio and Builds */}
        <div className="flex flex-col w-full lg:w-2/3 space-y-6">
          <Card className="border-neonblue/20 bg-lightbg dark:bg-darkbg">
            <CardHeader>
              <CardTitle className="text-neonblue">Bio</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300">
                {userData?.bio || (
                  <span className="text-gray-500">No bio added yet.</span>
                )}
              </p>
            </CardContent>
          </Card>

          <Card className="border-neonblue/20 bg-lightbg dark:bg-darkbg">
            <CardHeader>
              <CardTitle className="text-neonblue">Saved Builds</CardTitle>
            </CardHeader>
            <CardContent>
              {savedBuilds.length === 0 ? (
                <p className="text-gray-500">
                  You haven't saved any builds yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {savedBuilds.map((build) => (
                    <div
                      key={build._id}
                      className="flex items-center justify-between bg-lightfill dark:bg-darkfill border border-neonblue/10 rounded-lg p-3"
                    >
                      <span className="font-medium text-gray-900 dark:text-white">
                        {build.name}
                      </span>
                      <Button
                        size="sm"
                        className="bg-neonblue text-black hover:bg-hoverprimary"
                        onClick={() => navigate(`/build/${build._id}`)}
                      >
                        Load Build
                      </Button>
                        <button
                        onClick={() => handleDeleteBuild(build._id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-md text-sm font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const AccountSettingsSkeleton = () => (
  <div className="p-4 sm:p-6 lg:p-8">
    <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto">
      <div className="w-full lg:w-1/3 flex flex-col items-center p-6 space-y-4">
        <Skeleton className="w-28 h-28 rounded-full" />
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-6 w-24" />
        <div className="w-full mt-6 space-y-4 pt-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
      <div className="w-full lg:w-2/3 space-y-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    </div>
  </div>
);

export default AccountSettings;

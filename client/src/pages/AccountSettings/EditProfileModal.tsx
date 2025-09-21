import { useState, useEffect } from "react";
import axios from "axios";

type EditProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  user: {
    username: string;
    bio?: string;
    image?: string;
  } | null;
  token: string | null;
  onSave: () => void;
};

const EditProfileModal = ({
  isOpen,
  onClose,
  user,
  token,
  onSave,
}: EditProfileModalProps) => {
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (isOpen && user) {
      setUsername(user.username);
      setBio(user.bio || "");
    }
  }, [isOpen, user]);

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("bio", bio);
      if (file) formData.append("image", file); // 👈 Add file only if selected

      const res = await axios.put(
        "http://localhost:5000/api/user/me",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // 👈 Important for file upload
          },
        }
      );

      console.log("Update response:", res.data);
      onSave();
      onClose();
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/20 backdrop-blur-sm">
      <div className="w-[400px] bg-darkgray text-white border-2 border-neonblue rounded-md p-6">
        <h2 className="text-3xl font-bold mb-4 text-neonblue font-pixel">
          Edit Profile
        </h2>

        <div className="flex flex-col items-center">
          {/* Profile Image Preview */}
          <img
            src={
              file
                ? URL.createObjectURL(file)
                : user?.image
                ? `http://localhost:5000/uploads/${user.image}`
                : "/default-profile.png"
            }
            alt="Profile Preview"
            className="w-24 h-24 mb-3 object-cover rounded-full border border-white"
          />

          <input
            id="file-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />

          <label
            htmlFor="file-upload"
            className="flex items-center mb-4 cursor-pointer"
          >
            <div className="bg-white text-black px-3 py-1 font-pixel">
              Choose a File
            </div>
            <span className="ml-2">{file?.name || "No file chosen"}</span>
          </label>
        </div>

        {/* USERNAME DITO BOSS*/}
        <label className="block mt-4 font-semibold">Username</label>
        <input
          className="w-full mt-1 px-3 py-2 rounded-sm bg-black text-white border border-neonblue placeholder-gray-400"
          placeholder="@username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* BIODERM */}
        <label className="block mt-4 font-semibold">Bio</label>
        <textarea
          className="w-full mt-1 px-3 py-2 rounded-sm bg-black text-white border border-neonblue placeholder-gray-400"
          placeholder="Enter your bio here"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />

        {/* BUTTONS DITO BOSS */}
        <div className="flex justify-between mt-6">
          <button
            className="border outline-1 bg-darkbg border-neonblue text-neonblue px-6 py-1 hover:bg-neonblue hover:text-black transition"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="border outline-1 bg-darkbg border-neonblue text-neonblue px-8 py-1 hover:bg-neonblue hover:text-black transition"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;

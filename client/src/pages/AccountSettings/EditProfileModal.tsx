import { useState } from "react";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditProfileModal = ({ isOpen, onClose }: EditProfileModalProps) => {
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [file, setFile] = useState<File | null>(null);

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
            src={file ? URL.createObjectURL(file) : ""}
            alt="Profile Preview"
            className="w-24 h-24 mb-3 object-cover"
          />

          <label className="mb-4">
            <input
              type="file"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <button className="bg-white text-black px-3 py-1 font-pixel">
              Choose a File
            </button>
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
          <button className="border outline-1 bg-darkbg border-neonblue text-neonblue px-8 py-1 hover:bg-neonblue hover:text-black transition">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;

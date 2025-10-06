import { useState, useEffect } from "react";
import API from "@/utils/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import { useCurrentUser } from "@/auth/context/currentUser";

type EditProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  user: {
    username: string;
    bio?: string;
    image?: string;
  } | null;
  onSave: () => void;
};

const EditProfileModal = ({
  isOpen,
  onClose,
  user,
  onSave,
}: EditProfileModalProps) => {
  const { refreshCurrentUser, setCurrentUser } = useCurrentUser();

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      setUsername(user.username);
      setBio(user.bio || "");
      setFile(null);
    }
  }, [isOpen, user]);

   const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("bio", bio);
      if (file) formData.append("image", file);

      const res = await API.put("/user/me", formData);
      const updated = res.data; // ensure your API returns the updated user object

      // ✅ Immediately reflect changes in the global header/user menu
      if (updated) {
        setCurrentUser(prev => ({ ...(prev ?? {} as any), ...updated }));
        // keep localStorage (AuthContext) in sync so refreshes stay correct
        const raw = localStorage.getItem("user");
        if (raw) {
          const merged = { ...JSON.parse(raw), ...updated };
          localStorage.setItem("user", JSON.stringify(merged));
        }
      } else {
        // Fallback if your PUT doesn't return the user
        await refreshCurrentUser();
      }

        onSave?.();
      } catch (err) {
        console.error("Failed to update profile:", err);
      } finally {
        setSaving(false); // ✅ reset before closing
        onClose();        // ✅ close after
      }
  };

  // Consistent base URL for uploads
  const uploadBaseUrl = (
    import.meta.env.VITE_API_URL || "http://localhost:5000/api"
  ).replace("/api", "");

  const previewSrc =
    file
      ? URL.createObjectURL(file)
      : user?.image
      ? `${uploadBaseUrl}/uploads/${user.image}`
      : "/default-profile.png";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-lightbg dark:bg-darkbg border border-neonblue/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-neonblue">
            Edit Profile
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={previewSrc} alt="Profile Preview" />
              <AvatarFallback className="text-3xl">
                {user?.username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex items-center text-sm">
              <Label
                htmlFor="file-upload"
                className="bg-neonblue text-black hover:bg-hoverprimary h-8 px-3 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium cursor-pointer"
              >
                Choose File
              </Label>
              <Input
                id="file-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <span className="ml-3 text-gray-600 dark:text-gray-400 truncate">
                {file?.name || "No file chosen"}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username" className="text-gray-800 dark:text-gray-200">
              Username
            </Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="text-gray-800 dark:text-gray-200">
              Bio
            </Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" disabled={saving}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleSave}
            className="bg-neonblue text-black hover:bg-hoverprimary"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;

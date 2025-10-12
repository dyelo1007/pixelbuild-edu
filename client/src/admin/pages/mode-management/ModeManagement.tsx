import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getPlatformSettings,
  updatePlatformSettings,
  type IPlatformSettings,
} from "@/services/platformSettingsService";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";

// Define the structure for the modes we want to manage
const modeConfig = [
  { key: "isFreeBuildVisible", label: "Free Build Mode" },
  { key: "isChallengeModeVisible", label: "Challenge Mode" },
  { key: "isQuizModeVisible", label: "Quiz Mode" },
  { key: "isReviewModeVisible", label: "Review Mode" },
  { key: "isRepairModeVisible", label: "Repair Mode" },
] as const; // Use 'as const' for stronger typing

const ModeManagement = () => {
  const [settings, setSettings] = useState<Partial<IPlatformSettings>>({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getPlatformSettings();
        setSettings(data);
      } catch (err) {
        console.error("Failed to load settings:", err);
        toast.error("Could not load platform settings.");
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleToggle = (key: keyof IPlatformSettings, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Saving changes...");
    try {
      await updatePlatformSettings(settings);
      toast.success("Settings updated successfully!", { id: toastId });
    } catch (err) {
      console.error("Failed to save settings:", err);
      toast.error("Failed to save changes.", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-neonblue">Mode Management</h1>
        <Button variant="ghost" asChild>
          <Link to="/content-management">Back to Content</Link>
        </Button>
      </div>
      <Card className="border border-neonblue/30 shadow-lg bg-lightbg dark:bg-darkbg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
            Learning Mode Visibility
          </CardTitle>
          <CardDescription>
            Control which learning modes are visible to students on their
            dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading
            ? // Show skeleton loaders while fetching data
              Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between space-x-2 rounded-md border p-4 border-neonblue/10 bg-lightfill dark:bg-darkfill"
                >
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-6 w-11" />
                </div>
              ))
            : // Display the actual toggle switches
              modeConfig.map((mode) => (
                <div
                  key={mode.key}
                  className="flex items-center justify-between space-x-2 rounded-md border p-4 border-neonblue/10 bg-lightfill dark:bg-darkfill"
                >
                  <Label
                    htmlFor={mode.key}
                    className="font-semibold text-gray-800 dark:text-gray-200"
                  >
                    {mode.label}
                  </Label>
                  <Switch
                    id={mode.key}
                    checked={settings[mode.key] ?? false}
                    onCheckedChange={(value) => handleToggle(mode.key, value)}
                    aria-label={`Toggle ${mode.label}`}
                  />
                </div>
              ))}
          <div className="flex justify-end pt-4">
            <Button
              onClick={handleSaveChanges}
              disabled={isSaving || loading}
              className="bg-neonblue text-black hover:bg-hoverprimary"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModeManagement;

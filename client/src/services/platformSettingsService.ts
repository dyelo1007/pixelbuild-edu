import API from "@/utils/api";

// Define the structure of the settings data for the frontend
export interface IPlatformSettings {
  isFreeBuildVisible: boolean;
  isChallengeModeVisible: boolean;
  isQuizModeVisible: boolean;
  isReviewModeVisible: boolean;
  isRepairModeVisible: boolean;
}

// Fetches the current platform settings (publicly accessible)
export const getPlatformSettings = async (): Promise<IPlatformSettings> => {
  const response = await API.get("/settings");
  return response.data;
};

// Updates the platform settings (admin only)
export const updatePlatformSettings = async (
  settings: Partial<IPlatformSettings>
): Promise<IPlatformSettings> => {
  const response = await API.put("/settings", settings);
  return response.data;
};

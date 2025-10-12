import { Request, Response } from "express";
import PlatformSetting, { IPlatformSettings } from "../models/PlatformSettings";

// A helper function to ensure the settings document exists
const getSettingsDocument = async () => {
  // We need to cast the model to 'any' to access our custom static method
  const model = PlatformSetting as any;
  return await model.getSingleton();
};

// GET /api/settings - Fetches the current platform settings (publicly accessible)
export const getPlatformSettings = async (req: Request, res: Response) => {
  try {
    const settings = await getSettingsDocument();
    res.json(settings);
  } catch (error: any) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// PUT /api/settings - Updates the platform settings (admin only)
export const updatePlatformSettings = async (req: Request, res: Response) => {
  try {
    const settings = await getSettingsDocument();

    // Update the settings with the data from the request body
    const updates: Partial<IPlatformSettings> = req.body;
    Object.assign(settings, updates);

    await settings.save();
    res.json(settings);
  } catch (error: any) {
    res
      .status(400)
      .json({ message: "Error updating settings", error: error.message });
  }
};

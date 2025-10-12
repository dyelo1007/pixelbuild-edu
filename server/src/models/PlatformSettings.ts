import mongoose, { Document, Schema } from "mongoose";

export interface IPlatformSettings extends Document {
  isFreeBuildVisible: boolean;
  isChallengeModeVisible: boolean;
  isQuizModeVisible: boolean;
  isReviewModeVisible: boolean;
  isRepairModeVisible: boolean;
}

const platformSettingsSchema = new Schema<IPlatformSettings>({
  isFreeBuildVisible: { type: Boolean, default: true },
  isChallengeModeVisible: { type: Boolean, default: true },
  isQuizModeVisible: { type: Boolean, default: true },
  isReviewModeVisible: { type: Boolean, default: true },
  isRepairModeVisible: { type: Boolean, default: true },
});

// We'll use a single document to store all settings, so we can give it a fixed ID
platformSettingsSchema.statics.getSingleton = async function () {
  const settings = await this.findOne();
  if (!settings) {
    return this.create({}); // Create the document if it doesn't exist
  }
  return settings;
};

const PlatformSetting = mongoose.model<IPlatformSettings>(
  "PlatformSetting",
  platformSettingsSchema
);
export default PlatformSetting;

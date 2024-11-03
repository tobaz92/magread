import mongoose from "mongoose";

const userSettingsSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },

  // Interface
  theme: { type: String, default: "light" }, // "light", "dark", "system"
  language: { type: String, default: "en" }, // "en", "fr", etc.
  timezone: { type: String, default: "Europe/Paris" }, // ex: "Europe/Paris"
  dateFormat: { type: String, default: "DD/MM/YYYY" }, // ex: "MM/DD/YYYY", "YYYY-MM-DD"
  timeFormat: { type: String, default: "24-hour" }, // "12-hour", "24-hour"
  fontSize: { type: String, default: "medium" }, // "small", "medium", "large"

  // Notifications
  emailNotifications: { type: Boolean, default: true },
  pushNotifications: { type: Boolean, default: false },
  smsNotifications: { type: Boolean, default: false },
  notificationFrequency: { type: String, default: "instant" }, // "instant", "daily", "weekly"

  // Sécurité
  twoFactorAuth: { type: Boolean, default: false },
  loginNotifications: { type: Boolean, default: true },
  sessionTimeout: { type: Number, default: 30 }, // Timeout en minutes
  passwordExpirationDays: { type: Number, default: 90 }, // Expiration du mot de passe en jours
});

const UserModel = mongoose.model("userSettings", userSettingsSchema);
export default UserModel;

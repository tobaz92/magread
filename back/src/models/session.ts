import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  browserFingerprint: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const SessionModel = mongoose.model("sessions", sessionSchema);

export default SessionModel;
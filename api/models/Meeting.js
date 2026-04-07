import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema({
  groupName: { type: String, required: true },
  members: [String],
  location: { type: String, required: true },
  dateTime: { type: String, required: true },
  status: { type: String, enum: ["upcoming", "completed", "cancelled"], default: "upcoming" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Meeting", meetingSchema, "Meetings");
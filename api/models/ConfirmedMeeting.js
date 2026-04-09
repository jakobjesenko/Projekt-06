// api/models/ConfirmedMeeting.js
import mongoose from "mongoose";

const confirmedMeetingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Popravi: ObjectId namesto Number
  groupName: { type: String, required: true },
  members: [String],
  location: { type: String, required: true },
  dateTime: { type: String, required: true },
  confirmedAt: { type: Date, default: Date.now }
});

export default mongoose.model("ConfirmedMeeting", confirmedMeetingSchema, "ConfirmedMeetings");
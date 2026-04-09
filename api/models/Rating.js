// api/models/Rating.js
import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // ObjectId
  userName: { type: String, required: true },
  groupName: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, default: "" },
  date: { type: Date, default: Date.now }
});

export default mongoose.model("Rating", ratingSchema, "Ratings");
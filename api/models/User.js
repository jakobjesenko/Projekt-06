import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  location: { type: String, default: "" },
  interests: [{
    id: Number,
    name: String,
    icon: String
  }],
  timeSlots: [String],
  activeSearch: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", userSchema, "Users");
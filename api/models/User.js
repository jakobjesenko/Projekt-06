// api/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  age: { type: Number, required: true, min: 16, max: 120 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  // Lokacija z zemljevidom (samo koordinate in radij)
  location: {
    lat: { type: Number, required: false },
    lng: { type: Number, required: false },
    radius: { type: Number, default: 5 } // km
  },
  
  // Interesi (shranjeni kot array stringov)
  interests: [{ type: String }],
  
  // Razpoložljivost (termini)
  availability: [{ type: String }],
  
  activeSearch: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  isAdmin: { type: Boolean, default: false },
  termsAccepted: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

// 2d sphere index za geolokacijske poizvedbe
userSchema.index({ "location.lat": 1, "location.lng": 1 });

export default mongoose.model("User", userSchema, "Users");
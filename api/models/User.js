// api/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  birthday: { type: Date, required: true }, // Rojstni dan (YYYY-MM-DD)
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  termsAccepted: { type: Boolean, default: true },
  
  // Lokacija
  location: {
    lat: { type: Number, default: null },
    lng: { type: Number, default: null },
    radius: { type: Number, default: 5 }
  },
  
  interests: [{ type: String }],
  availability: [{ type: String }],
  
  activeSearch: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Metoda za izračun starosti iz rojstnega dne
userSchema.methods.getAge = function() {
  const today = new Date();
  const birthDate = new Date(this.birthday);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export default mongoose.model("User", userSchema, "Users");
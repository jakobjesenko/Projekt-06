import User from "../models/User.js";

// Registracija
const register = async (req, res) => {
  try {
    const { username, email, password, location, interests, timeSlots } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Uporabnik s tem e-poštnim naslovom že obstaja." });
    }
    
    const newUser = new User({
      id: Date.now(),
      username,
      email,
      password,
      location,
      interests: interests || [],
      timeSlots: timeSlots || [],
      activeSearch: false,
      isActive: true,
      isAdmin: false
    });
    
    await newUser.save();
    res.status(201).json({ success: true, user: newUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Prijava
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Admin prijava
    if (email === "admin@srecajmose.si" && password === "admin123") {
      return res.status(200).json({ 
        success: true, 
        isAdmin: true,
        admin: { email: "admin@srecajmose.si", role: "admin" }
      });
    }
    
    // User prijava
    const user = await User.findOne({ email, password, isActive: true });
    if (!user) {
      return res.status(401).json({ message: "Napačna e-pošta ali geslo." });
    }
    
    res.status(200).json({ success: true, isAdmin: false, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Pozabljeno geslo
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email, isActive: true });
    
    if (!user) {
      return res.status(404).json({ message: "Uporabnik s tem e-poštnim naslovom ne obstaja." });
    }
    
    // V realni aplikaciji bi poslali email
    const resetToken = Math.random().toString(36).substring(2, 15);
    res.status(200).json({ 
      success: true, 
      message: "Povezava za ponastavitev gesla je bila poslana.",
      resetLink: `/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Posodobi profil
const updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { username, email, password, location, interests, timeSlots } = req.body;
    
    const updateData = { username, email, location, interests, timeSlots };
    if (password && password.trim()) {
      updateData.password = password;
    }
    
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: "Uporabnik ni najden." });
    }
    
    res.status(200).json({ success: true, user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Aktiviraj iskanje
const activateSearch = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndUpdate(userId, { activeSearch: true }, { new: true });
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default {
  register,
  login,
  forgotPassword,
  updateProfile,
  activateSearch
};
// api/controllers/auth.js
import User from "../models/User.js";

const register = async (req, res) => {
  try {
    console.log("=== REGISTRATION ===");
    console.log("Received body:", req.body);
    
    const { 
      firstName, lastName, username, birthday, email, password, 
      terms, interests, availability, 
      locationLat, locationLng, locationRadius 
    } = req.body;
    
    // Preveri obvezna polja
    if (!firstName || !lastName || !username || !birthday || !email || !password) {
      return res.status(400).json({ message: "Izpolnite vsa obvezna polja." });
    }
    
    // Preveri, če uporabnik že obstaja
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "Uporabnik s tem e-poštnim naslovom ali uporabniškim imenom že obstaja." });
    }
    
    // Preveri starost (vsaj 18 let)
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 18) {
      return res.status(400).json({ message: "Stari morate biti vsaj 18 let za registracijo." });
    }
    
    // Parsiraj interese
    let parsedInterests = [];
    if (interests) {
      try {
        parsedInterests = typeof interests === 'string' ? JSON.parse(interests) : interests;
      } catch(e) {
        parsedInterests = [];
      }
    }
    
    // Parsiraj availability
    let parsedAvailability = [];
    if (availability) {
      try {
        parsedAvailability = typeof availability === 'string' ? JSON.parse(availability) : availability;
      } catch(e) {
        parsedAvailability = [];
      }
    }
    
    // Ustvari uporabnika
    const newUser = new User({
      firstName,
      lastName,
      username,
      birthday: birthDate,
      email,
      password,
      termsAccepted: terms === 'on',
      interests: parsedInterests,
      availability: parsedAvailability,
      location: {
        lat: locationLat ? parseFloat(locationLat) : null,
        lng: locationLng ? parseFloat(locationLng) : null,
        radius: locationRadius ? parseInt(locationRadius) : 5
      },
      activeSearch: true,
      isActive: true,
      isAdmin: email === "admin@srecajmose.si"
    });
    
    await newUser.save();
    
    // Shrani v session
    req.session.user = {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      birthday: newUser.birthday,
      age: newUser.getAge(),
      interests: newUser.interests,
      availability: newUser.availability,
      location: newUser.location,
      activeSearch: newUser.activeSearch,
      isAdmin: newUser.isAdmin
    };
    
    console.log("User registered successfully:", newUser.username);
    res.status(201).json({ success: true, user: newUser });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    console.log("=== LOGIN ===");
    console.log("Email:", req.body.email);
    
    const { email, password } = req.body;
    
    // Admin prijava
    if (email === "admin@srecajmose.si" && password === "admin123") {
      req.session.admin = { email: "admin@srecajmose.si", role: "admin" };
      return res.status(200).json({ success: true, isAdmin: true });
    }
    
    // User prijava
    const user = await User.findOne({ email, password, isActive: true });
    if (!user) {
      return res.status(401).json({ message: "Napačna e-pošta ali geslo." });
    }
    
    // Shrani uporabnika v session
    req.session.user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      birthday: user.birthday,
      age: user.getAge(),
      interests: user.interests,
      availability: user.availability,
      location: user.location,
      activeSearch: user.activeSearch,
      isAdmin: user.isAdmin
    };
    
    res.status(200).json({ success: true, isAdmin: false, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email, isActive: true });
    
    if (!user) {
      return res.status(404).json({ message: "Uporabnik s tem e-poštnim naslovom ne obstaja." });
    }
    
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

const updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { firstName, lastName, username, birthday, email, password, interests, availability, location } = req.body;
    
    console.log("Updating user:", userId);
    console.log("Update data:", { firstName, lastName, username, birthday, email, interests, availability, location });
    
    const updateData = { 
      firstName, 
      lastName, 
      username, 
      email, 
      interests, 
      availability, 
      location 
    };
    
    if (birthday) {
      const birthDate = new Date(birthday);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 18) {
        return res.status(400).json({ message: "Stari morate biti vsaj 18 let." });
      }
      updateData.birthday = birthDate;
    }
    
    if (password && password.trim()) {
      updateData.password = password;
    }
    
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
    
    if (!updatedUser) {
      return res.status(404).json({ message: "Uporabnik ni najden." });
    }
    
    // Posodobi session
    req.session.user = {
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      birthday: updatedUser.birthday,
      age: updatedUser.getAge(),
      interests: updatedUser.interests,
      availability: updatedUser.availability,
      location: updatedUser.location,
      activeSearch: updatedUser.activeSearch,
      isAdmin: updatedUser.isAdmin
    };
    
    console.log("User updated successfully:", updatedUser.username);
    res.status(200).json({ success: true, user: updatedUser });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: err.message });
  }
};

const activateSearch = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndUpdate(userId, { activeSearch: true }, { new: true });
    
    if (req.session.user) {
      req.session.user.activeSearch = true;
    }
    
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ⚠️ POMEMBNO: Ta export mora biti na KONCU datoteke!
export default {
  register,
  login,
  forgotPassword,
  updateProfile,
  activateSearch
};
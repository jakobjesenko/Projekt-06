// api/controllers/auth.js - popravi updateProfile funkcijo

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
      if (age < 16) {
        return res.status(400).json({ message: "Stari morate biti vsaj 16 let." });
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
// api/controllers/users.js
import User from "../models/User.js";

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deactivateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId, 
      { isActive: false, activeSearch: false }, 
      { new: true }
    );
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const activateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId, { isActive: true }, { new: true });
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default {
  getAllUsers,
  deactivateUser,
  activateUser
};
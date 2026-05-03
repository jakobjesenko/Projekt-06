// api/controllers/users.js
import User from "../models/users.js";

const getSessionUser = (user) => ({
  _id: user._id,
  username: user.username,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  birthday: user.birthday,
  age: typeof user.getAge === 'function' ? user.getAge() : null,
  interests: user.interests,
  availability: user.availability,
  location: user.location,
  activeSearch: user.activeSearch,
  role: user.role,
});

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } });
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

export const updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const {
      firstName,
      lastName,
      username,
      birthday,
      email,
      password,
      interests,
      availability,
      location
    } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Uporabnik ni najden.'
      });
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.username = username;
    user.email = email;
    user.interests = interests ?? [];
    user.availability = availability ?? [];

    user.location = {
      lat: location?.lat ?? null,
      lng: location?.lng ?? null,
      radius: location?.radius ?? 5
    };

    if (birthday) {
      const birthDate = new Date(birthday);

      if (Number.isNaN(birthDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Neveljaven datum rojstva.'
        });
      }

      user.birthday = birthDate;
    }

    if (password && password.trim()) {
      user.password = password.trim();
    }

    const updatedUser = await user.save();

    if (req.session) {
      req.session.user = getSessionUser(updatedUser);
    }

    return res.status(200).json({
      success: true,
      user: getSessionUser(updatedUser)
    });
  } catch (error) {
    console.error('Update profile error:', error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Uporabniško ime ali email je že v uporabi.'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Napaka pri posodobitvi profila.'
    });
  }
};

export const activateSearch = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndUpdate(userId, { activeSearch: true }, { new: true });

    if (req.session?.user) {
      req.session.user.activeSearch = true;
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deactivateSearch = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndUpdate(userId, { activeSearch: false }, { new: true });

    if (req.session?.user) {
      req.session.user.activeSearch = false;
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  getAllUsers,
  deactivateUser,
  activateUser,
  updateProfile,
  activateSearch,
  deactivateSearch,
};
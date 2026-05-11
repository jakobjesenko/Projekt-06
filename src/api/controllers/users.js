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

/**
 * @openapi
 * /users/admin/strikes/{userId}:
 *  post:
 *   summary: Add strike to user
 *   description: Adds a strike to a user for violation of community guidelines. Maximum 3 strikes allowed. When reaching 3 strikes, user is automatically blocked. Accessible only to admin users.
 *   tags: [Users]
 *   security:
 *    - jwt: []
 *   parameters:
 *    - name: userId
 *      in: path
 *      required: true
 *      schema:
 *       type: string
 *       pattern: '^[a-fA-F\d]{24}$'
 *      description: ID of the user to add strike to
 *      example: 507f1f77bcf86cd799439011
 *   responses:
 *    '200':
 *     description: Successfully added strike to user
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         success:
 *          type: boolean
 *          example: true
 *         user:
 *          type: object
 *          properties:
 *           _id:
 *            type: string
 *            example: 507f1f77bcf86cd799439011
 *           username:
 *            type: string
 *            example: janez_novak
 *           strikes:
 *            type: integer
 *            example: 1
 *           status:
 *            type: string
 *            example: active
 *    '400':
 *     description: Invalid input data or max strikes reached
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         success:
 *          type: boolean
 *          example: false
 *         message:
 *          type: string
 *          example: Uporabnik je že dosegel maksimalno število strajkov.
 *    '404':
 *     description: User not found
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         success:
 *          type: boolean
 *          example: false
 *         message:
 *          type: string
 *          example: Uporabnik ni najden.
 *    '500':
 *     description: Server error
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         success:
 *          type: boolean
 *          example: false
 *         message:
 *          type: string
 *          example: Napaka pri dodajanju strike-a.
 */
export const addStrike = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Uporabnik ni najden.'
      });
    }

    const currentStrikes = user.strikes || 0;

    if (currentStrikes >= 3) {
      return res.status(400).json({
        success: false,
        message: 'Uporabnik je že dosegel maksimalno število strajkov.'
      });
    }

    user.strikes = currentStrikes + 1;

    // Avtomatski blokira uporabnika na tretjem strajku
    if (user.strikes === 3) {
      user.status = 'blocked';
    }

    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      user: updatedUser
    });
  } catch (error) {
    console.error('Add strike error:', error);
    return res.status(500).json({
      success: false,
      message: 'Napaka pri dodajanju strike-a.'
    });
  }
};

/**
 * @openapi
 * /users/admin/strikes/{userId}:
 *  get:
 *   summary: Get user strike count
 *   description: Retrieves the current strike count for a user. Accessible only to admin users.
 *   tags: [Users]
 *   security:
 *    - jwt: []
 *   parameters:
 *    - name: userId
 *      in: path
 *      required: true
 *      schema:
 *       type: string
 *       pattern: '^[a-fA-F\d]{24}$'
 *      description: ID of the user
 *      example: 507f1f77bcf86cd799439011
 *   responses:
 *    '200':
 *     description: Successfully retrieved user strike count
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         success:
 *          type: boolean
 *          example: true
 *         username:
 *          type: string
 *          example: janez_novak
 *         strikes:
 *          type: integer
 *          example: 2
 *    '404':
 *     description: User not found
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         success:
 *          type: boolean
 *          example: false
 *         message:
 *          type: string
 *          example: Uporabnik ni najden.
 *    '500':
 *     description: Server error
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         success:
 *          type: boolean
 *          example: false
 *         message:
 *          type: string
 *          example: Napaka pri pridobivanju strike-jev.
 */
export const getUserStrikes = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Uporabnik ni najden.'
      });
    }

    return res.status(200).json({
      success: true,
      username: user.username,
      strikes: user.strikes || 0
    });
  } catch (error) {
    console.error('Get user strikes error:', error);
    return res.status(500).json({
      success: false,
      message: 'Napaka pri pridobivanju strike-jev.'
    });
  }
};

/**
 * @openapi
 * /users/admin/strikes/{userId}:
 *  put:
 *   summary: Update user strike count
 *   description: Updates the strike count for a user. Accessible only to admin users.
 *   tags: [Users]
 *   security:
 *    - jwt: []
 *   parameters:
 *    - name: userId
 *      in: path
 *      required: true
 *      schema:
 *       type: string
 *       pattern: '^[a-fA-F\d]{24}$'
 *      description: ID of the user
 *      example: 507f1f77bcf86cd799439011
 *   requestBody:
 *    description: New strike count
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        strikes:
 *         type: integer
 *         minimum: 0
 *         maximum: 3
 *         description: New strike count for the user (0-3)
 *         example: 2
 *       required:
 *        - strikes
 *   responses:
 *    '200':
 *     description: Successfully updated user strike count
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         success:
 *          type: boolean
 *          example: true
 *         user:
 *          type: object
 *          properties:
 *           _id:
 *            type: string
 *            example: 507f1f77bcf86cd799439011
 *           username:
 *            type: string
 *            example: janez_novak
 *           strikes:
 *            type: integer
 *            example: 2
 *    '400':
 *     description: Invalid input data
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         success:
 *          type: boolean
 *          example: false
 *         message:
 *          type: string
 *          example: Število strike-jev mora biti celo število med 0 in 3.
 *    '404':
 *     description: User not found
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         success:
 *          type: boolean
 *          example: false
 *         message:
 *          type: string
 *          example: Uporabnik ni najden.
 *    '500':
 *     description: Server error
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         success:
 *          type: boolean
 *          example: false
 *         message:
 *          type: string
 *          example: Napaka pri posodobitvi strike-jev.
 */
export const updateStrikes = async (req, res) => {
  try {
    const { userId } = req.params;
    const { strikes } = req.body;

    if (strikes === undefined || strikes === null) {
      return res.status(400).json({
        success: false,
        message: 'Število strike-jev je obvezno.'
      });
    }

    if (!Number.isInteger(strikes) || strikes < 0 || strikes > 3) {
      return res.status(400).json({
        success: false,
        message: 'Število strike-jev mora biti celo število med 0 in 3.'
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { strikes },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Uporabnik ni najden.'
      });
    }

    return res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Update strikes error:', error);
    return res.status(500).json({
      success: false,
      message: 'Napaka pri posodobitvi strike-jev.'
    });
  }
};

/**
 * @openapi
 * /users/admin/status/{userId}:
 *  put:
 *   summary: Update user status
 *   description: Changes the status of a user (active/blocked/pending). Accessible only to admin users.
 *   tags: [Users]
 *   security:
 *    - jwt: []
 *   parameters:
 *    - name: userId
 *      in: path
 *      required: true
 *      schema:
 *       type: string
 *       pattern: '^[a-fA-F\d]{24}$'
 *      description: ID of the user to update
 *      example: 507f1f77bcf86cd799439011
 *   requestBody:
 *    description: New status for the user
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        status:
 *         type: string
 *         enum: [active, blocked, pending]
 *         description: New status for the user
 *         example: blocked
 *       required:
 *        - status
 *   responses:
 *    '200':
 *     description: Successfully updated user status
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         success:
 *          type: boolean
 *          example: true
 *         message:
 *          type: string
 *          example: Status uporabnika janez_novak posodobljen na "blocked".
 *         data:
 *          type: object
 *          properties:
 *           _id:
 *            type: string
 *            example: 507f1f77bcf86cd799439011
 *           username:
 *            type: string
 *            example: janez_novak
 *           email:
 *            type: string
 *            example: janez@example.com
 *           status:
 *            type: string
 *            example: blocked
 *    '400':
 *     description: Invalid input data
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         success:
 *          type: boolean
 *          example: false
 *         message:
 *          type: string
 *          example: "Neveljaven status. Dovoljeni statusi: active, blocked, pending."
 *    '404':
 *     description: User not found
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         success:
 *          type: boolean
 *          example: false
 *         message:
 *          type: string
 *          example: Uporabnik ne obstaja.
 *    '500':
 *     description: Server error
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         success:
 *          type: boolean
 *          example: false
 *         message:
 *          type: string
 *          example: Napaka pri posodabljanju statusa uporabnika.
 */
export const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    // Validacija statusa
    const allowedStatuses = ['active', 'blocked', 'pending'];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Neveljaven status. Dovoljeni statusi: active, blocked, pending.'
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { status },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Uporabnik ne obstaja.'
      });
    }

    console.log(`User ${userId} status updated to ${status}`);

    return res.status(200).json({
      success: true,
      message: `Status uporabnika ${user.username} posodobljen na "${status}".`,
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Update user status error:', error);
    return res.status(500).json({
      success: false,
      message: 'Napaka pri posodabljanju statusa uporabnika.'
    });
  }
};

export default {
  getAllUsers,
  deactivateUser,
  activateUser,
  updateProfile,
  activateSearch,
  deactivateSearch,
  addStrike,
  getUserStrikes,
  updateStrikes,
  updateUserStatus
};
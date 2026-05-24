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

/**
 * @openapi
 * /users/admin:
 *  get:
 *   summary: Get all users (admin)
 *   description: Returns a paginated list of all non-admin users for admin dashboard.
 *   tags: [Users]
 *   security:
 *    - jwt: []
 *   parameters:
 *    - name: page
 *      in: query
 *      schema:
 *       type: integer
 *       minimum: 1
 *       default: 1
 *      description: Page number for pagination
 *    - name: limit
 *      in: query
 *      schema:
 *       type: integer
 *       minimum: 1
 *       maximum: 100
 *       default: 30
 *      description: Number of items per page
 *    - name: status
 *      in: query
 *      schema:
 *       type: string
 *       enum: [active, blocked, pending]
 *      description: Filter users by status
 *    - name: search
 *      in: query
 *      schema:
 *       type: string
 *      description: Search by username, email, first name, or last name
 *   responses:
 *    '200':
 *     description: Successfully retrieved users
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         success:
 *          type: boolean
 *         data:
 *          type: array
 *          items:
 *           $ref: '#/components/schemas/User'
 *         pagination:
 *          type: object
 *          properties:
 *           total:
 *            type: integer
 *           page:
 *            type: integer
 *           totalPages:
 *            type: integer
 *       example:
 *        success: true
 *        data: []
 *        pagination:
 *         total: 0
 *         page: 1
 *         totalPages: 0
 *    '401':
 *     description: Unauthorized - admin access only
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        success: false
 *        message: Nimate dovoljenja za ta dejanje.
 *    '500':
 *     description: Server error
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        success: false
 *        message: Napaka pri pridobivanju uporabnikov.
 */
const getAllUsers = async (req, res) => {
  try {
    let page = Number.parseInt(req.query.page, 10) || 1;
    let limit = Number.parseInt(req.query.limit, 10) || 30;

    if (page < 1) page = 1;
    if (limit < 1) limit = 30;
    if (limit > 100) limit = 100;

    const offset = (page - 1) * limit;

    const allowedStatuses = ['active', 'blocked', 'pending'];
    const status = allowedStatuses.includes(req.query.status) ? req.query.status : null;
    const search = req.query.search || '';

    const query = { role: { $ne: 'admin' } };
    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
      ];
    }

    const [users, totalCount] = await Promise.all([
      User.find(query)
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .lean(),
      User.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        total: totalCount,
        page,
        totalPages: totalCount > 0 ? Math.ceil(totalCount / limit) : 0,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @openapi
 * /users/admin/{userId}/deactivate:
 *  put:
 *   summary: Deactivate user (admin)
 *   description: Deactivates a user account and disables active search.
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
 *      description: User ID to deactivate
 *      example: 507f1f77bcf86cd799439011
 *   responses:
 *    '200':
 *     description: User deactivated
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         success:
 *          type: boolean
 *         user:
 *          $ref: '#/components/schemas/User'
 *       example:
 *        success: true
 *    '500':
 *     description: Server error
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 */
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

/**
 * @openapi
 * /users/admin/{userId}/activate:
 *  put:
 *   summary: Activate user (admin)
 *   description: Activates a user account.
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
 *      description: User ID to activate
 *      example: 507f1f77bcf86cd799439011
 *   responses:
 *    '200':
 *     description: User activated
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         success:
 *          type: boolean
 *         user:
 *          $ref: '#/components/schemas/User'
 *       example:
 *        success: true
 *    '500':
 *     description: Server error
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 */
const activateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId, { isActive: true }, { new: true });
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @openapi
 * /users/profile/{userId}:
 *  put:
 *   summary: Update user profile (self/admin)
 *   description: Updates user profile details including interests, availability, and location.
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
 *      description: User ID to update
 *      example: 507f1f77bcf86cd799439011
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        firstName:
 *         type: string
 *        lastName:
 *         type: string
 *        username:
 *         type: string
 *        birthday:
 *         type: string
 *         format: date
 *        email:
 *         type: string
 *         format: email
 *        password:
 *         type: string
 *        interests:
 *         type: array
 *         items:
 *          type: string
 *        availability:
 *         type: array
 *         items:
 *          type: string
 *        location:
 *         type: object
 *         properties:
 *          lat:
 *           type: number
 *          lng:
 *           type: number
 *          radius:
 *           type: number
 *      example:
 *       firstName: Ana
 *       lastName: Novak
 *       username: ana_novak
 *       birthday: 1995-07-22
 *       email: ana@mail.com
 *       interests: [kava, joga]
 *       availability: ["Pon__zvecer", "Sob__dopoldne"]
 *       location: { lat: 46.0569, lng: 14.5058, radius: 10 }
 *   responses:
 *    '200':
 *     description: Profile updated
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         success:
 *          type: boolean
 *         user:
 *          type: object
 *       example:
 *        success: true
 *    '400':
 *     description: Bad request
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *    '404':
 *     description: User not found
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *    '409':
 *     description: Conflict (duplicate username/email)
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *    '500':
 *     description: Server error
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 */
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

/**
 * @openapi
 * /users/admin/activate-search/{userId}:
 *  put:
 *   summary: Activate search (admin)
 *   description: Enables active search for a user.
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
 *      description: User ID
 *      example: 507f1f77bcf86cd799439011
 *   responses:
 *    '200':
 *     description: Active search enabled
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         success:
 *          type: boolean
 *         user:
 *          $ref: '#/components/schemas/User'
 *    '500':
 *     description: Server error
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 */
export const activateSearch = async (req, res) => {
  try {
    const { userId } = req.params;

    const requester = req.user;
    const isAdmin = requester?.role === 'admin';
    if (!isAdmin && String(requester?._id) !== String(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Nimate dovoljenja za to dejanje.',
      });
    }

    const target = await User.findById(userId).select('isActive');
    if (!target) {
      return res.status(404).json({
        success: false,
        message: 'Uporabnik ne obstaja.',
      });
    }

    if (!target.isActive) {
      return res.status(409).json({
        success: false,
        message: 'Deaktivirani ste. Za ponovno aktivacijo iskanja kontaktirajte administratorja.',
      });
    }

    const user = await User.findByIdAndUpdate(userId, { activeSearch: true }, { new: true });

    if (req.session?.user) {
      req.session.user.activeSearch = true;
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @openapi
 * /users/admin/deactivate-search/{userId}:
 *  put:
 *   summary: Deactivate search (admin)
 *   description: Disables active search for a user.
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
 *      description: User ID
 *      example: 507f1f77bcf86cd799439011
 *   responses:
 *    '200':
 *     description: Active search disabled
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         success:
 *          type: boolean
 *         user:
 *          $ref: '#/components/schemas/User'
 *    '500':
 *     description: Server error
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 */
export const deactivateSearch = async (req, res) => {
  try {
    const { userId } = req.params;

    const requester = req.user;
    const isAdmin = requester?.role === 'admin';
    if (!isAdmin && String(requester?._id) !== String(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Nimate dovoljenja za to dejanje.',
      });
    }

    const user = await User.findByIdAndUpdate(userId, { activeSearch: false }, { new: true });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Uporabnik ne obstaja.',
      });
    }

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

    // Pri tretjem strajku se uporabnika deaktivira od iskanja
    if (user.strikes >= 3) {
      user.status = 'blocked';
      user.isActive = false;
      user.activeSearch = false;
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
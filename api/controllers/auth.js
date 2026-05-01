import mongoose from 'mongoose';
import crypto from 'node:crypto';
import { generateToken, setTokenCookie, clearTokenCookie } from '../utils/jwt.js';
import { sendVerificationEmail } from '../utils/email.js';
import { profile } from 'node:console';
import dotenv from 'dotenv';

dotenv.config();

let APP_URL;
if (process.env.NODE_ENV === 'production') {
  APP_URL = process.env.PROD_APP_URL || 'https://';
}
// je docker ali development
else {
  APP_URL = process.env.APP_URL || 'http://localhost:3000';
}

const User = mongoose.model('User');

// Pomožne metode za parsiranje in normalizacijo polj

const parseArrayField = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

const normalizeInterests = (interests) => {
  return parseArrayField(interests)
    .map((item) => {
      if (typeof item === 'string') return item.trim();
      if (item && typeof item.name === 'string') return item.name.trim();
      return '';
    })
    .filter(Boolean);
};

/**
 * @openapi
 * /auth/register:
 *  post:
 *   description: Register a new user with 3-step registration data and send email verification link.
 *   tags: [Auth]
 *   requestBody:
 *    required: true
 *    description: Registration data for a new user (step 1/3 basic profile, step 2/3 interests, step 3/3 location and availability).
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        email:
 *         type: string
 *         format: email
 *         example: user@example.com
 *        username:
 *         type: string
 *         example: username123
 *        password:
 *         type: string
 *         format: password
 *         example: password123
 *        firstName:
 *         type: string
 *         example: Marko
 *        lastName:
 *         type: string
 *         example: Novak
 *        birthday:
 *         type: string
 *         format: date
 *         example: 2000-05-10
 *        terms:
 *         type: boolean
 *         example: true
 *        interests:
 *         type: array
 *         items:
 *          type: string
 *         example: [kava, druzabne igre]
 *        availability:
 *         type: array
 *         items:
 *          type: string
 *         example: [ponedeljek-popoldne, petek-zvecer]
 *        locationLat:
 *         type: number
 *         example: 46.0569
 *        locationLng:
 *         type: number
 *         example: 14.5058
 *        locationRadius:
 *         type: number
 *         example: 10
 *       required:
 *        - email
 *        - username
 *        - password
 *        - firstName
 *        - lastName
 *        - birthday
 *        - terms
 *        - interests
 *        - availability
 *        - locationLat
 *        - locationLng
 *        - locationRadius
 *   responses:
 *    '201':
 *     description: Created – user registered successfully, verification email sent.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         success:
 *          type: boolean
 *         message:
 *          type: string
 *         requiresEmailVerification:
 *          type: boolean
 *         user:
 *          type: object
 *          properties:
 *           id:
 *            type: string
 *           email:
 *            type: string
 *           username:
 *            type: string
 *           firstName:
 *            type: string
 *           lastName:
 *            type: string
 *           birthday:
 *            type: string
 *            format: date
 *           terms:
 *            type: boolean
 *           interests:
 *            type: array
 *            items:
 *             type: string
 *           availability:
 *            type: array
 *            items:
 *             type: string
 *           locationLat:
 *            type: number
 *           locationLng:
 *            type: number
 *           locationRadius:
 *            type: number
 *       example:
 *        success: true
 *        message: Registracija uspešna! Preverite svoj email za potrditev.
 *        requiresEmailVerification: true
 *        user:
 *         id: 65f1a3c4e9d1b20012345678
 *         email: user@example.com
 *         username: username123
 *         firstName: Marko
 *         lastName: Novak
 *         birthday: 2000-05-10
 *         terms: true
 *         interests: [kava, druzabne igre]
 *         availability: [ponedeljek-popoldne, petek-zvecer]
 *         locationLat: 46.0569
 *         locationLng: 14.5058
 *         locationRadius: 10
 *    '400':
 *     description: Bad Request – missing fields or duplicate email/username.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       examples:
 *        missingFields:
 *         value:
 *          message: Vsa obvezna polja morajo biti izpolnjena
 *        emailExists:
 *         value:
 *          message: Uporabnik s tem emailom že obstaja
 *        usernameTaken:
 *         value:
 *          message: Uporabniško ime je že zasedeno
 *    '500':
 *     description: Internal Server Error – error while registering user.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: Napaka pri registraciji. Poskusite ponovno.
 */
export const register = async (req, res) => {
  try {
    const {
      email,
      username,
      password,
      firstName,
      lastName,
      birthday,
      terms,
      interests,
      availability,
      locationLat,
      locationLng,
      locationRadius,
    } = req.body;

    if (!email || !username || !password || !firstName || !lastName || !birthday) {
      return res.status(400).json({
        success: false,
        message: 'Vsa obvezna polja morajo biti izpolnjena',
      });
    }

    const birthDate = new Date(birthday);
    if (Number.isNaN(birthDate.getTime())) {
      return res.status(400).json({ success: false, message: 'Neveljaven datum rojstva' });
    }

    const now = new Date();
    let age = now.getFullYear() - birthDate.getFullYear();
    const monthDiff = now.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 18) {
      return res.status(400).json({
        success: false,
        message: 'Stari morate biti vsaj 18 let za registracijo.',
      });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    const existingEmail = await User.findOne({ email: normalizedEmail });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'Uporabnik s tem emailom že obstaja',
      });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: 'Uporabniško ime je že zasedeno',
      });
    }

    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;

    const newUser = new User({
      email: normalizedEmail,
      username,
      password,
      firstName,
      lastName,
      birthday: birthDate,
      termsAccepted: terms === true || terms === 'true' || terms === 'on',
      interests: normalizeInterests(interests),
      availability: parseArrayField(availability).map(String),
      location: {
        lat: locationLat !== undefined && locationLat !== null && locationLat !== '' ? parseFloat(locationLat) : null,
        lng: locationLng !== undefined && locationLng !== null && locationLng !== '' ? parseFloat(locationLng) : null,
        radius: locationRadius ? parseInt(locationRadius, 10) : 5,
      },
      accountSecurity: {
        emailVerified: process.env.NODE_ENV !== 'production',
        emailVerificationToken,
        emailVerificationExpires,
      },
      status: process.env.NODE_ENV === 'production' ? 'pending' : 'active',
      role: 'user',
      activeSearch: true,
      isActive: true,
    });

    await newUser.save();

    const emailResult = await sendVerificationEmail(
      newUser.email,
      emailVerificationToken,
      newUser.firstName,
    );

    if (!emailResult.success) {
      console.error('Failed to send verification email:', emailResult.error);
    }

    return res.status(201).json({
      success: true,
      message: 'Registracija uspešna! Preverite svoj email za potrditev.',
      requiresEmailVerification: true,
      user: {
        id: newUser._id,
        email: newUser.email,
        username: newUser.username,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Napaka pri registraciji. Poskusite ponovno.',
    });
  }
};

/**
 * @openapi
 * /auth/login:
 *  post:
 *   summary: Login user
 *   description: Authenticate user with email or username and password. Sets JWT token cookie on success.
 *   tags: [Auth]
 *   requestBody:
 *    required: true
 *    description: User credentials (email or username and password).
 *    content:
 *     application/x-www-form-urlencoded:
 *      schema:
 *       type: object
 *       properties:
 *        email:
 *         type: string
 *         description: Email address or username.
 *         example: user@example.com
 *        password:
 *         type: string
 *         format: password
 *         description: User password.
 *         example: password123
 *       required:
 *        - email
 *        - password
 *   responses:
 *    '200':
 *     description: OK – user successfully authenticated.
 *     headers:
 *      Set-Cookie:
 *       description: HTTP-only cookie with JWT token.
 *       schema:
 *        type: string
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         success:
 *          type: boolean
 *         message:
 *          type: string
 *         token:
 *          type: string
 *         user:
 *          type: object
 *          properties:
 *           id:
 *            type: string
 *           email:
 *            type: string
 *           username:
 *            type: string
 *           firstName:
 *            type: string
 *           lastName:
 *            type: string
 *           role:
 *            type: string
 *           profileImage:
 *            type: string
 *            nullable: true
 *           spotifyConnected:
 *            type: boolean
 *    '400':
 *     description: Bad Request – missing email or password.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: Email in geslo sta obvezna
 *    '401':
 *     description: Unauthorized – wrong email or password.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       examples:
 *        wrongEmail:
 *         value:
 *          message: Napačen email
 *        wrongPassword:
 *         value:
 *          message: Napačno  geslo
 *    '403':
 *     description: Forbidden – account blocked or email not verified.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       examples:
 *        blocked:
 *         value:
 *          message: Vaš račun je blokiran. Kontaktirajte podporo.
 *        pending:
 *         value:
 *          message: Prosimo, najprej potrdite svoj email naslov.
 *    '500':
 *     description: Internal Server Error – error while logging in.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: Napaka pri prijavi. Poskusite ponovno.
 */
// POST /api/authController : Prijava uporabnika
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email in geslo sta obvezna',
      });
    }

    // Najdi uporabnika po emailu ali username (email lahko uporabimo tudi kot username)
    const user = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: email }],
    }).select('+password'); // ← Dodaj .select('+password') da dobiš password

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Napačen email',
      });
    }

    // Preveri geslo
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Napačno  geslo',
      });
    }

    // Preveri status uporabnika
    if (user.status === 'blocked') {
      return res.status(403).json({
        success: false,
        message: 'Vaš račun je blokiran. Kontaktirajte podporo.',
      });
    }

    if (user.status === 'pending') {
      return res.status(403).json({
        success: false,
        message: 'Prosimo, najprej potrdite svoj email naslov.',
        requiresEmailVerification: true,
      });
    }

    // Generiraj JWT token
    const token = generateToken(user);
    setTokenCookie(res, token);

    return res.status(200).json({
      success: true,
      message: 'Prijava uspešna!',
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        profileImage: user.profileImage,
        spotifyConnected: user.spotifyConnected,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Napaka pri prijavi. Poskusite ponovno.',
    });
  }
};

/**
 * @openapi
 * /auth/logout:
 *  post:
 *   description: Logs out the currently authenticated user by clearing JWT cookie.
 *   tags: [Auth]
 *   security:
 *    - jwt: []
 *   responses:
 *    '200':
 *     description: OK – user logged out successfully.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         success:
 *          type: boolean
 *         message:
 *          type: string
 *       example:
 *        success: true
 *        message: Odjava uspešna
 *    '500':
 *     description: Internal Server Error – error while logging out.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: Napaka pri odjavi
 */
// POST /api/authController : Odjava uporabnika
export const logout = async (req, res) => {
  try {
    // Počisti JWT cookie
    clearTokenCookie(res);

    return res.status(200).json({
      success: true,
      message: 'Odjava uspešna',
    });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({
      success: false,
      message: 'Napaka pri odjavi',
    });
  }
};

/**
 * @openapi
 * /auth/verify-email:
 *  get:
 *   description: Verify user's email address with a verification token from email link.
 *   tags: [Auth]
 *   parameters:
 *    - name: token
 *      in: query
 *      required: true
 *      description: Verification token sent in the email.
 *      schema:
 *       type: string
 *       example: 2f4c9a5b5e2d4a1b9a5b2f4c9a5b5e2d
 *   responses:
 *    '200':
 *     description: OK – email successfully verified.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         success:
 *          type: boolean
 *         message:
 *          type: string
 *         user:
 *          type: object
 *          properties:
 *           id:
 *            type: string
 *           email:
 *            type: string
 *           username:
 *            type: string
 *           firstName:
 *            type: string
 *           lastName:
 *            type: string
 *       example:
 *        success: true
 *        message: Email uspešno potrjen! Vaš račun je zdaj aktiven.
 *        user:
 *         id: 65f1a3c4e9d1b20012345678
 *         email: user@example.com
 *         username: username123
 *         firstName: Marko
 *         lastName: Novak
 *    '400':
 *     description: Bad Request – missing, invalid or expired verification token.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       examples:
 *        missing:
 *         value:
 *          message: Verification token manjka
 *        invalid:
 *         value:
 *          message: Neveljaven ali potekel verification token
 *    '500':
 *     description: Internal Server Error – error while verifying email.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: Napaka pri potrjevanju emaila
 */
// GET /api/authController : Verifikacija email-a
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    console.log('🔍 Verify email request received');
    console.log('Token from URL:', token);

    if (!token) {
      console.log('❌ Token missing');
      return res.status(400).json({
        success: false,
        message: 'Verification token manjka',
      });
    }

    // Najdi uporabnika s tem tokenom
    const user = await User.findOne({
      'accountSecurity.emailVerificationToken': token,
      'accountSecurity.emailVerificationExpires': { $gt: Date.now() },
    });
    console.log('User found:', user ? `✅ ${user.email}` : '❌ No user found');
    if (!user) {
      console.log('❌ Invalid or expired token');
      return res.status(400).json({
        success: false,
        message: 'Neveljaven ali potekel verification token',
      });
    }

    user.accountSecurity.emailVerified = true;
    user.status = 'active';
    user.accountSecurity.emailVerificationToken = undefined;
    user.accountSecurity.emailVerificationExpires = undefined;
    await user.save();

    console.log('Email verified successfully for:', user.email);

    return res.status(200).json({
      success: true,
      message: 'Email uspešno potrjen! Vaš račun je zdaj aktiven.',
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.error('Email verification error:', error);
    return res.status(500).json({
      success: false,
      message: 'Napaka pri potrjevanju emaila',
    });
  }
};

/**
 * @openapi
 * /auth/resend-verification:
 *  post:
 *   summary: Resend verification email
 *   description: Resends an email with verification link for a user whose account is still pending.
 *   tags: [Auth]
 *   requestBody:
 *    required: true
 *    description: User's email address.
 *    content:
 *     application/x-www-form-urlencoded:
 *      schema:
 *       type: object
 *       properties:
 *        email:
 *         type: string
 *         format: email
 *         example: user@example.com
 *       required:
 *        - email
 *   responses:
 *    '200':
 *     description: OK – verification email resent.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         success:
 *          type: boolean
 *         message:
 *          type: string
 *       example:
 *        success: true
 *        message: Verification email ponovno poslan. Preverite svojo pošto.
 *    '400':
 *     description: Bad Request – missing email or account already verified.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       examples:
 *        missingEmail:
 *         value:
 *          message: Email je obvezen
 *        alreadyActive:
 *         value:
 *          message: Vaš račun je že potrjen
 *    '404':
 *     description: Not Found – user with given email does not exist.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: Uporabnik ne obstaja
 *    '500':
 *     description: Internal Server Error – error while sending verification email.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: Napaka pri pošiljanju emaila
 */
// POST /api/authController : ponovno pošiljanje verifikacijskega emaila
export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email je obvezen',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Uporabnik ne obstaja',
      });
    }

    if (user.status === 'active') {
      return res.status(400).json({
        success: false,
        message: 'Vaš račun je že potrjen',
      });
    }

    // Generiraj nov verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;

    user.accountSecurity.emailVerificationToken = emailVerificationToken;
    user.accountSecurity.emailVerificationExpires = emailVerificationExpires;
    await user.save();
    console.log('Verification email token updated for:', user.email);
    // Pošlji email
    const emailResult = await sendVerificationEmail(
      user.email,
      emailVerificationToken,
      user.firstName,
    );

    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Napaka pri pošiljanju emaila',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Verification email ponovno poslan. Preverite svojo pošto.',
    });
  } catch (error) {
    console.error('Resend verification email error:', error);
    return res.status(500).json({
      success: false,
      message: 'Napaka pri pošiljanju emaila',
    });
  }
};

/**
 * @openapi
 * /auth/forgot-password:
 *  post:
 *   description: Sends a password reset email with reset token if the user exists.
 *   tags: [Auth]
 *   requestBody:
 *    required: true
 *    description: Email address of the user who forgot their password.
 *    content:
 *     application/x-www-form-urlencoded:
 *      schema:
 *       type: object
 *       properties:
 *        email:
 *         type: string
 *         format: email
 *         example: user@example.com
 *       required:
 *        - email
 *   responses:
 *    '200':
 *     description: OK – password reset email sent (if user exists).
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         success:
 *          type: boolean
 *         message:
 *          type: string
 *       example:
 *        success: true
 *        message: Email za ponastavitev gesla je bil poslan
 *    '400':
 *     description: Bad Request – missing email or user with this email does not exist.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       examples:
 *        missingEmail:
 *         value:
 *          message: Email je obvezen!
 *        userNotFound:
 *         value:
 *          message: Uporabnik s tem emailom ne obstaja!
 *    '500':
 *     description: Internal Server Error – error while requesting password reset.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: Napaka pri zahtevi za ponastavitev gesla
 */
// POST /api/authController : zahteva za ponastavitev gesla
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email je obvezen!',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Uporabnik s tem emailom ne obstaja!',
      });
    }

    // Generiraj reset token (upora
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = Date.now() + 3600000; // 1 ura

    user.accountSecurity.passwordResetToken = resetToken;
    user.accountSecurity.passwordResetExpires = resetTokenExpires;
    await user.save();

    // Pošlji mail
    //const passResetLink = `${process.env.BASE_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    const emailResult = await sendVerificationEmail(
      user.email,
      resetToken,
      user.firstName,
      'reset',
    );
    if (!emailResult.success) {
      console.error('Failed to send reset email:', emailResult.error);
      return res.status(500).json({
        success: false,
        message: 'Napaka pri pošiljanju emaila!',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Email za ponastavitev gesla je bil poslan',
    });
  } catch (error) {
    console.error('Forgot password error', error);
    return res.status(500).json({
      success: false,
      message: 'Napaka pri zahtevi za ponastavitev gesla',
    });
  }
};

/**
 * @openapi
 * /auth/reset-password:
 *  post:
 *   summary: Reset password
 *   description: Resets user's password using a valid password reset token.
 *   tags: [Auth]
 *   requestBody:
 *    required: true
 *    description: Reset token and new password.
 *    content:
 *     application/x-www-form-urlencoded:
 *      schema:
 *       type: object
 *       properties:
 *        token:
 *         type: string
 *         description: Password reset token from email link.
 *         example: 2f4c9a5b5e2d4a1b9a5b2f4c9a5b5e2d
 *        newPassword:
 *         type: string
 *         format: password
 *         description: New password to be set.
 *         example: password1234
 *       required:
 *        - token
 *        - newPassword
 *   responses:
 *    '200':
 *     description: OK – password successfully reset.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         success:
 *          type: boolean
 *         message:
 *          type: string
 *       example:
 *        success: true
 *        message: Geslo uspešno ponastavljeno!
 *    '400':
 *     description: Bad Request – missing token/password or invalid/expired token.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       examples:
 *        missing:
 *         value:
 *          message: Token in novo geslo sta obvezna!
 *        invalid:
 *         value:
 *          message: Neveljaven ali potekel token
 *    '500':
 *     description: Internal Server Error – error while resetting password.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: Napaka pri ponastavitvi gesla
 */
// POST /api/authController : resetiranje gesla
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token in novo geslo sta obvezna!',
      });
    }

    const user = await User.findOne({
      'accountSecurity.passwordResetToken': token,
      'accountSecurity.passwordResetExpires': { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Neveljaven ali potekel token',
      });
    }

    user.password = newPassword;
    user.accountSecurity.passwordResetToken = undefined;
    user.accountSecurity.passwordResetExpires = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Geslo uspešno ponastavljeno!',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({
      success: false,
      message: 'Napaka pri ponastavitvi gesla',
    });
  }
};

export default {
  register,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  resendVerificationEmail,
};

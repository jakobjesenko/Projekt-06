// api/models/User.js
import mongoose from "mongoose";
import bcrypt from 'bcryptjs'; // kriptiranje gesel
//import dotenv from 'dotenv';

//dotenv.config();

let APP_URL;
if (process.env.NODE_ENV === 'production') {
  APP_URL = process.env.PROD_APP_URL || 'https://';
}
// je docker ali development
else {
  APP_URL = process.env.APP_URL || 'http://localhost:3000';
}

/**
 * @openapi
 * components:
 *  schemas:
 *   User:
 *    type: object
 *    description: Schema for a user in the meeting application.
 *    properties:
 *     _id:
 *      type: string
 *      description: <b>Unique identifier</b> of user
 *      example: 507f1f77bcf86cd799439011
 *     firstName:
 *      type: string
 *      description: <b>First name</b> of user
 *      minLength: 2
 *      maxLength: 50
 *      example: Janez
 *     lastName:
 *      type: string
 *      description: <b>Last name</b> of user
 *      minLength: 2
 *      maxLength: 50
 *      example: Novak
 *     profileImage:
 *      type: string
 *      description: <b>Profile image URL</b> of user
 *      nullable: true
 *      example: /uploads/users/default-avatar.png
 *     username:
 *      type: string
 *      description: <b>Username</b> of user
 *      minLength: 3
 *      maxLength: 30
 *      pattern: ^[a-zA-Z0-9_.]+$
 *      example: user_123
 *     birthday:
 *      type: string
 *      format: date
 *      description: <b>Birthday</b> of user (YYYY-MM-DD)
 *      pattern: ^\\d{4}-\\d{2}-\\d{2}$
 *      example: 2000-05-15
 *     email:
 *      type: string
 *      description: <b>Email address</b> of user
 *      format: email
 *      pattern: ^\\S+@\\S+\\.\\S+$
 *      example: user@gmail.com
 *     password:
 *      type: string
 *      description: <b>Password hash</b> of user
 *      maxLength: 100
 *      example: $2a$12$wJwQH6h8X0s8g2W3mY1p4uAq8wzV3eQh8y8r0bXr8C2zP4nM0kQ5K
 *     termsAccepted:
 *      type: boolean
 *      description: <b>Indicates if terms are accepted</b>
 *      default: true
 *      example: true
 *     location:
 *      type: object
 *      description: <b>User location preferences</b>
 *      properties:
 *       lat:
 *        type: number
 *        format: double
 *        description: <b>Latitude</b> value
 *        nullable: true
 *        example: 46.0569
 *       lng:
 *        type: number
 *        format: double
 *        description: <b>Longitude</b> value
 *        nullable: true
 *        example: 14.5058
 *       radius:
 *        type: number
 *        description: <b>Search radius</b> in kilometers
 *        default: 5
 *        example: 10
 *      example:
 *       lat: 46.0569
 *       lng: 14.5058
 *       radius: 10
 *     interests:
 *      type: array
 *      description: <b>List of user interests</b>
 *      minItems: 0
 *      items:
 *       type: string
 *      example: [music, hiking, coding]
 *     availability:
 *      type: array
 *      description: <b>List of user availability slots</b>
 *      minItems: 0
 *      items:
 *       type: string
 *      example: [weekends, evenings]
 *     activeSearch:
 *      type: boolean
 *      description: <b>Indicates if user is actively searching for meetings</b>
 *      default: false
 *      example: true
 *     isActive:
 *      type: boolean
 *      description: <b>Indicates if account is active</b>
 *      default: true
 *      example: true
 *     role:
 *      type: string
 *      description: <b>Role</b> of user in the system
 *      enum: [user, admin, guest]
 *      example: user
 *     status:
 *      type: string
 *      description: <b>Status</b> of user in the system
 *      enum: [active, blocked, pending]
 *      example: pending
 *     strikes:
 *      type: integer
 *      description: <b>Number of strikes/warnings</b> for user
 *      minimum: 0
 *      example: 0
 *     accountSecurity:
 *      type: object
 *      description: <b>Account security details</b> of user
 *      properties:
 *       emailVerified:
 *        type: boolean
 *        description: <b>Indicates if email is verified</b>
 *        example: false
 *       emailVerificationToken:
 *        type: string
 *        description: <b>Email verification token</b>
 *        example: someEmailVerificationToken
 *       emailVerificationExpires:
 *        type: string
 *        format: date-time
 *        description: <b>Email verification token expiration date</b>
 *        example: 2024-01-31T23:59:59Z
 *       passwordResetToken:
 *        type: string
 *        description: <b>Password reset token</b>
 *        example: somePasswordResetToken
 *       passwordResetExpires:
 *        type: string
 *        format: date-time
 *        description: <b>Password reset token expiration date</b>
 *        example: 2024-01-31T23:59:59Z
 *      example:
 *       emailVerified: false
 *       emailVerificationToken: someEmailVerificationToken
 *       emailVerificationExpires: 2024-01-31T23:59:59Z
 *       passwordResetToken: somePasswordResetToken
 *       passwordResetExpires: 2024-01-31T23:59:59Z
 *     createdAt:
 *      type: string
 *      format: date-time
 *      description: <b>Creation date</b> of user
 *      example: 2024-01-01T12:00:00Z
 *     updatedAt:
 *      type: string
 *      format: date-time
 *      description: <b>Last update date</b> of user
 *      example: 2024-01-15T12:00:00Z
 *    required:
 *    - firstName
 *    - lastName
 *    - email
 *    - username
 *    - birthday
 *    - password
 *    - role
 *    - status
 *    - createdAt
 *    - updatedAt
 *    - location
 *    - interests
 */

const userSchema = new mongoose.Schema({
  firstName: {
    // ime
    type: String,
    required: [true, 'First name je obvezen'],
    trim: true,
    minlength: [2, 'First name must be at least 2 characters'],
    maxlength: [50, 'First name is too long'],
  },
  lastName: {
    // priimek
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    minlength: [2, 'Last name must be at least 2 characters'],
    maxlength: [50, 'Last name is too long'],
  },
  // lhku pustis tako in mas prek poti
  profileImage: {
    // slika profila
    type: String,
    default: `${APP_URL}/uploads/users/default-avatar.png`, // privzeta slika profila, moramo sed dodati to sliko v nek direktorij, kjer hranimo slike uporabnikov
  },
  username: {
    // uporabniško ime
    type: String,
    required: [true, 'Uporabniško ime je obvezno'],
    unique: true,
    trim: true,
    minlength: [3, 'Uporabniško ime mora imeti vsaj 3 znake'],
    maxlength: [30, 'Uporabniško ime je predolgo'],
    match: [
      /^[a-zA-Z0-9_.]+$/,
      'Uporabniško ime lahko vsebuje samo črke, številke, podčrtaje in pike',
    ],
  },
  birthday: { 
    // Rojstni dan (YYYY-MM-DD)
    type: Date, 
    required: true,
  },
  email: {
    // email uporabnika
    type: String,
    required: [true, 'Email je obvezen'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Prosimo, vnesite veljaven email'],
  },
  password: { 
    type: String, 
    required: true 
  },
  termsAccepted: { 
    type: Boolean, 
    default: true 
  },
  // Lokacija
  location: {
    lat: { type: Number, default: null },
    lng: { type: Number, default: null },
    radius: { type: Number, default: 5 }
  },
  interests: [{ 
    type: String 
  }],
  availability: [{ 
    type: String 
  }],
  activeSearch: { 
    type: Boolean, 
    default: false },
  isActive: { 
    type: Boolean, 
    default: true 
  },
   role: {
    // vloga uporabnika
    type: String,
    enum: ['user', 'admin', 'guest'],
    default: 'user',
  },
  status: {
    // status uporabnika
    type: String,
    enum: ['active', 'blocked', 'pending'],
    default: 'pending',
  },
  strikes: {
    // število opozoril uporabnika
    type: Number,
    default: 0,
  },
  accountSecurity: {
    // Potrditev e-pošte
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  createdAt: {
    // datum kreiranja uporabnika
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    // datum zadnje posodobitve uporabnika
    type: Date,
    default: Date.now,
  },
});

// hash gesla pred shranjevanjem
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// posodobi datum zadnje posodobitve
userSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// primerja geslo
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// STATIC METHOD: get paginated users
userSchema.statics.getPaginatedUsers = async function ({ offset, limit, status, search }) {
  const query = {};

  if (status) {
    query.status = status;
  }

  // Search by username, email, firstName, or lastName
  if (search) {
    query.$or = [
      { username: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
    ];
  }

  const [users, totalCount] = await Promise.all([
    this.find(query)
      .sort({ createdAt: -1 }) // najnovejši najprej
      .skip(offset)
      .limit(limit)
      .lean(),
    this.countDocuments(query),
  ]);

  return { users, totalCount };
};

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

export default mongoose.model('User', userSchema, 'users'); // ime modela je User ime zbirke (collection v mongo bazi) pa users
import jwt from 'jsonwebtoken';

// JWT Secret Creds
const JWT_SECRET = process.env.JWT_SECRET || '8LXTn83pW2CAP5u1xDpmHQ6UeaPG9bgq';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const JWT_COOKIE_EXPIRES_IN = process.env.JWT_COOKIE_EXPIRES_IN || 7;

// Generiraj JWT token
export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
    },
  );
};

// Preveri JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Nastavi JWT token v cookie
export const setTokenCookie = (res, token) => {
  const cookieOptions = {
    expires: new Date(Date.now() + JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true, // prepreči dostop preko JavaScript
    secure: process.env.NODE_ENV === 'production', // samo HTTPS v produkciji
    sameSite: 'strict', // CSRF zaščita
  };

  res.cookie('jwt', token, cookieOptions);
};

// Počisti JWT cookie
export const clearTokenCookie = (res) => {
  res.cookie('jwt', 'logged-out', {
    expires: new Date(Date.now() + 1000), // 1s
    httpOnly: true,
  });
};
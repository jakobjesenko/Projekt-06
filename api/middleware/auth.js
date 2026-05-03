import mongoose from 'mongoose';
import { verifyToken } from '../utils/jwt.js';

const User = mongoose.model('User');

// Middleware za zaščito route-ov -> preveri JWT token
export const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Prefer the Authorization header when present — it always carries the
    //    current localStorage token. Fall back to the cookie only when there
    //    is no header, so browser-native requests (no JS) still work.
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Niste prijavljeni. Prosimo, prijavite se.',
      });
    }

    // 2. Verifikacija tokena
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Neveljaven ali potekel token. Prosimo, prijavite se ponovno.',
      });
    }

    // 3. Preveri če uporabnik še obstaja
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Uporabnik s tem tokenom ne obstaja več.',
      });
    }

    // 4. Preveri če je uporabnik aktiven
    if (user.status === 'blocked') {
      return res.status(403).json({
        success: false,
        message: 'Vaš račun je blokiran.',
      });
    }

    // 5. Dovoli dostop do zaščitene route
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({
      success: false,
      message: 'Napaka pri avtentikaciji.',
    });
  }
};

// Preverjanje vloge uporabnika -> Če se bo rablo -> Trenutno not in use
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(401).json({
        success: false,
        message: 'Nimate dovoljenja za ta dejanje.',
      });
    }
    next();
  };
};
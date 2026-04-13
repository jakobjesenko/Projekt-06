import mongoose from 'mongoose';
import { verifyToken } from '../utils/jwt.js';

const User = mongoose.model('User');

// Middleware za zaščito route-ov -> preveri JWT token
export const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Preveri če token obstaja v cookie-jih
    if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    // 2. Preveri če token obstaja v auth. header (za API klice)
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Niste prijavljeni. Prosimo, prijavite se.',
      });
    }

    // 3. Verifikacja tokena
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Neveljaven ali potekel token. Prosimo, prijavite se ponovno.',
      });
    }

    // 4. Preveri če uporabnik še obstaja
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Uporabnik s tem tokenom ne obstaja več.',
      });
    }

    // 5. Preveri če je uporabnik aktiven
    if (user.status === 'blocked') {
      return res.status(403).json({
        success: false,
        message: 'Vaš račun je blokiran.',
      });
    }

    // 6. Dovoli dostop do zaščitene route
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
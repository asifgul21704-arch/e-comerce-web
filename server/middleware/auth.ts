import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../store';
import { IUser } from '../../src/types';

const JWT_SECRET = process.env.JWT_SECRET || 'e-commerce-super-secret-jwt-key-2026';

export interface AuthRequest extends Request {
  user?: IUser;
}

export function generateToken(user: IUser): string {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function authenticateUser(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    let token = req.cookies?.token;

    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication required. Please log in.' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
    const user = db.findUserById(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found or session invalid.' });
    }

    // Exclude password
    const safeUser = { ...user };
    delete safeUser.password;

    req.user = safeUser;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token. Please log in again.' });
  }
}

export function authenticateAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  authenticateUser(req, res, () => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: Administrator privileges required.'
      });
    }
    next();
  });
}

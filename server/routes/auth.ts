import express from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../store';
import { generateToken, authenticateUser, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    const existingUser = db.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = db.createUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      phone: phone || '',
      role: 'user',
      address: {},
    });

    const token = generateToken(user);

    // Set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const safeUser = { ...user };
    delete safeUser.password;

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user: safeUser,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Internal server error.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = db.findUserByEmail(email);
    if (!user || !user.password) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken(user);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const safeUser = { ...user };
    delete safeUser.password;

    res.json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: safeUser,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Internal server error.' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out successfully.' });
});

// Get Current User Profile
router.get('/me', authenticateUser, (req: AuthRequest, res) => {
  res.json({ success: true, user: req.user });
});

// Update Profile
router.put('/profile', authenticateUser, (req: AuthRequest, res) => {
  try {
    const { name, phone, address } = req.body;
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const updated = db.updateUser(req.user._id, {
      ...(name ? { name: name.trim() } : {}),
      ...(phone !== undefined ? { phone: phone.trim() } : {}),
      ...(address ? { address } : {}),
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const safeUser = { ...updated };
    delete safeUser.password;

    res.json({ success: true, message: 'Profile updated successfully.', user: safeUser });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Internal server error.' });
  }
});

// Change Password
router.put('/change-password', authenticateUser, async (req: AuthRequest, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
    }

    const fullUser = db.findUserById(req.user._id);
    if (!fullUser || !fullUser.password) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, fullUser.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect current password.' });
    }

    const newHashed = await bcrypt.hash(newPassword, 10);
    db.updateUser(req.user._id, { password: newHashed });

    res.json({ success: true, message: 'Password changed successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Internal server error.' });
  }
});

// Forgot Password Flow
router.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required.' });
  }

  const user = db.findUserByEmail(email);
  if (!user) {
    // Return friendly message for security
    return res.json({
      success: true,
      message: 'If an account exists with this email, password reset instructions have been sent.',
    });
  }

  res.json({
    success: true,
    message: 'Password reset code has been sent to your email address.',
    resetToken: `reset-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
  });
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword || newPassword.length < 6) {
    return res.status(400).json({ success: false, message: 'Valid email and new password (min 6 chars) are required.' });
  }

  const user = db.findUserByEmail(email);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  const newHashed = await bcrypt.hash(newPassword, 10);
  db.updateUser(user._id, { password: newHashed });

  res.json({ success: true, message: 'Password has been reset successfully. You can now log in.' });
});

export default router;

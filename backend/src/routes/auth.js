import express from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { User } from '../models/User.js';
import { Profile } from '../models/Profile.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

router.post(
  '/register',
  [
    body('username').trim().isLength({ min: 2 }).withMessage('Username at least 2 chars'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password at least 6 chars'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const { username, email, password } = req.body;
      const exists = await User.findOne({ $or: [{ email }, { username }] });
      if (exists) {
        return res.status(400).json({ message: 'Email or username already in use.' });
      }

      const user = await User.create({ username, email, password });
      await Profile.create({ user: user._id, name: username });

      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

router.post(
  '/login',
  [
    body('email').optional().isEmail().normalizeEmail(),
    body('username').optional().trim(),
    body('password').exists().withMessage('Password required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const { email, username, password } = req.body;
      const query = email ? { email } : username ? { username } : null;
      if (!query) return res.status(400).json({ message: 'Email or username required.' });

      const user = await User.findOne(query).select('+password');
      if (!user || !(await user.matchPassword(password))) {
        return res.status(401).json({ message: 'Invalid email/username or password.' });
      }

      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

router.get('/me', protect, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id })
      .populate('user', 'username email');
    res.json(profile || { user: req.user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

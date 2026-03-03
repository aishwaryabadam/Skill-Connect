import express from 'express';
import { Profile } from '../models/Profile.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find()
      .populate('user', 'username email')
      .sort({ updatedAt: -1 });
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/me', protect, async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user._id }).populate('user', 'username email');
    if (!profile) {
      profile = await Profile.create({
        user: req.user._id,
        name: req.user.username,
      });
      await profile.populate('user', 'username email');
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.id }).populate('user', 'username email');
    if (!profile) return res.status(404).json({ message: 'Profile not found.' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/me', protect, async (req, res) => {
  try {
    const allowed = [
      'name', 'aboutMe', 'availability', 'skillsICanTeach', 'skillsIWantToLearn',
      'instagramId', 'linkedInId', 'githubId', 'educationDetails',
    ];
    const updates = {};
    allowed.forEach((k) => {
      if (req.body[k] !== undefined) updates[k] = req.body[k];
    });

    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('user', 'username email');

    if (!profile) {
      const newProfile = await Profile.create({
        user: req.user._id,
        ...updates,
        name: updates.name || req.user.username,
      });
      return res.json(await newProfile.populate('user', 'username email'));
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

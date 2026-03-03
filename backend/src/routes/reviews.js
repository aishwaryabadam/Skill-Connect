import express from 'express';
import { Session } from '../models/Session.js';
import { Review } from '../models/Review.js';
import { Notification } from '../models/Notification.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/given', protect, async (req, res) => {
  try {
    const reviews = await Review.find({ fromUser: req.user._id })
      .populate('toUser', 'username email')
      .populate('session')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/received', protect, async (req, res) => {
  try {
    const reviews = await Review.find({ toUser: req.user._id })
      .populate('fromUser', 'username email')
      .populate('session')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { sessionId, rating, comment } = req.body;
    if (!sessionId || rating == null) {
      return res.status(400).json({ message: 'sessionId and rating required.' });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be 1-5.' });
    }

    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: 'Session not found.' });
    if (session.status !== 'completed') {
      return res.status(400).json({ message: 'Can only review completed sessions.' });
    }

    const isLearner = session.learner.toString() === req.user._id.toString();
    const toUser = isLearner ? session.tutor : session.learner;
    if (!isLearner) {
      return res.status(403).json({ message: 'Only learner can submit review for this session.' });
    }

    const existing = await Review.findOne({ session: sessionId, fromUser: req.user._id });
    if (existing) return res.status(400).json({ message: 'You already reviewed this session.' });

    const review = await Review.create({
      session: sessionId,
      fromUser: req.user._id,
      toUser,
      rating: Number(rating),
      comment: comment || '',
    });

    await Notification.create({
      user: toUser,
      type: 'review_received',
      title: 'New review',
      body: `You received a ${rating}-star review.`,
      link: '/reviews',
      relatedId: review._id,
    });

    const populated = await Review.findById(review._id)
      .populate('fromUser', 'username email')
      .populate('toUser', 'username email')
      .populate('session');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const reviews = await Review.find({ toUser: req.params.userId })
      .populate('fromUser', 'username email')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

import express from 'express';
import { body, validationResult } from 'express-validator';
import { Request } from '../models/Request.js';
import { Session } from '../models/Session.js';
import { Notification } from '../models/Notification.js';
import { protect } from '../middleware/auth.js';
import { emitToUser } from '../services/socketService.js';

const router = express.Router();

const sessionValidation = [
  body('requestId').isMongoId().withMessage('Valid requestId required'),
  body('sessionType').isIn(['online', 'offline']).withMessage('sessionType must be online or offline'),
];

router.post(
  '/',
  protect,
  sessionValidation,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const { requestId, sessionType, locationDetails, googleMapsLink, sessionDate, sessionTime } = req.body;

      const request = await Request.findById(requestId);
      if (!request) return res.status(404).json({ message: 'Request not found.' });
      if (request.tutor.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Only tutor can create session.' });
      }
      if (request.status !== 'accepted') {
        return res.status(400).json({ message: 'Request must be accepted first.' });
      }

      if (sessionType === 'offline') {
        if (!googleMapsLink || !googleMapsLink.trim()) {
          return res.status(400).json({ message: 'Google Maps link is mandatory for offline sessions.' });
        }
      }
      if (sessionType === 'online') {
        if (!sessionDate || !sessionTime) {
          return res.status(400).json({ message: 'Session date and time required for online sessions.' });
        }
      }

      const session = await Session.create({
        request: requestId,
        tutor: request.tutor,
        learner: request.learner,
        sessionType,
        locationDetails: sessionType === 'offline' ? locationDetails : undefined,
        googleMapsLink: sessionType === 'offline' ? googleMapsLink : undefined,
        sessionDate: sessionType === 'online' ? new Date(sessionDate) : undefined,
        sessionTime: sessionType === 'online' ? sessionTime : undefined,
      });

      const notif = await Notification.create({
        user: request.learner,
        type: 'session_created',
        title: 'Session scheduled',
        body: `Your ${sessionType} session has been scheduled.`,
        link: '/sessions',
        relatedId: session._id,
      });
      emitToUser(request.learner.toString(), 'notification', notif);
      emitToUser(request.learner.toString(), 'session_update', { sessionId: session._id });

      const populated = await Session.findById(session._id)
        .populate('request')
        .populate('tutor', 'username email')
        .populate('learner', 'username email');
      res.status(201).json(populated);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

router.get('/', protect, async (req, res) => {
  try {
    const asTutor = await Session.find({ tutor: req.user._id })
      .populate('request')
      .populate('learner', 'username email')
      .sort({ createdAt: -1 });
    const asLearner = await Session.find({ learner: req.user._id })
      .populate('request')
      .populate('tutor', 'username email')
      .sort({ createdAt: -1 });
    res.json({ asTutor, asLearner });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('request')
      .populate('tutor', 'username email')
      .populate('learner', 'username email');
    if (!session) return res.status(404).json({ message: 'Session not found.' });
    const isParticipant =
      session.tutor._id.toString() === req.user._id.toString() ||
      session.learner._id.toString() === req.user._id.toString();
    if (!isParticipant) return res.status(403).json({ message: 'Not allowed.' });
    res.json(session);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id/start', protect, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found.' });
    const isParticipant =
      session.tutor.toString() === req.user._id.toString() ||
      session.learner.toString() === req.user._id.toString();
    if (!isParticipant) return res.status(403).json({ message: 'Not allowed.' });

    session.status = 'in_progress';
    await session.save();

    const populated = await Session.findById(session._id)
      .populate('request')
      .populate('tutor', 'username email')
      .populate('learner', 'username email');
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id/complete', protect, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found.' });
    const isParticipant =
      session.tutor.toString() === req.user._id.toString() ||
      session.learner.toString() === req.user._id.toString();
    if (!isParticipant) return res.status(403).json({ message: 'Not allowed.' });

    session.status = 'completed';
    session.completedAt = new Date();
    await session.save();

    const populated = await Session.findById(session._id)
      .populate('request')
      .populate('tutor', 'username email')
      .populate('learner', 'username email');
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

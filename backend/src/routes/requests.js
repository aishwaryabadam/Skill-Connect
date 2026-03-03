import express from 'express';
import { Request } from '../models/Request.js';
import { Profile } from '../models/Profile.js';
import { Session } from '../models/Session.js';
import { Notification } from '../models/Notification.js';
import { protect } from '../middleware/auth.js';
import { emitToUser } from '../services/socketService.js';

const router = express.Router();

function computeMatchScore(learnerProfile, tutorProfile, skillToLearn, skillToTeach) {
  let score = 50;
  const tutorTeaches = (tutorProfile?.skillsICanTeach || []).map((s) => s.toLowerCase());
  const learnerWants = (learnerProfile?.skillsIWantToLearn || []).map((s) => s.toLowerCase());
  const learnerTeaches = (learnerProfile?.skillsICanTeach || []).map((s) => s.toLowerCase());
  const tutorWants = (tutorProfile?.skillsIWantToLearn || []).map((s) => s.toLowerCase());

  if (tutorTeaches.includes(skillToLearn.toLowerCase())) score += 20;
  if (learnerTeaches.includes(skillToTeach.toLowerCase())) score += 20;
  if (learnerWants.includes(skillToLearn.toLowerCase())) score += 5;
  if (tutorWants.includes(skillToTeach.toLowerCase())) score += 5;
  return Math.min(100, score);
}

router.get('/recommendations', protect, async (req, res) => {
  try {
    const myProfile = await Profile.findOne({ user: req.user._id });
    const myTeach = (myProfile?.skillsICanTeach || []).map((s) => s.toLowerCase());
    const myLearn = (myProfile?.skillsIWantToLearn || []).map((s) => s.toLowerCase());

    const profiles = await Profile.find({ user: { $ne: req.user._id } })
      .populate('user', 'username email');

    const recommendations = [];
    for (const p of profiles) {
      const canTeach = (p.skillsICanTeach || []).map((s) => s.toLowerCase());
      const wantLearn = (p.skillsIWantToLearn || []).map((s) => s.toLowerCase());

      for (const skill of myLearn) {
        if (canTeach.includes(skill)) {
          const swap = (p.skillsIWantToLearn || []).find(
            (s) => myTeach.includes(s.toLowerCase())
          ) || (p.skillsIWantToLearn || [])[0];
          const score = computeMatchScore(myProfile, p, skill, swap || skill);
          recommendations.push({
            profile: p,
            skillToLearn: skill,
            skillToTeach: swap || skill,
            matchScore: score,
          });
        }
      }
    }

    recommendations.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    res.json(recommendations.slice(0, 20));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { tutorId, skillToLearn, skillToTeach, message } = req.body;
    if (!tutorId || !skillToLearn || !skillToTeach) {
      return res.status(400).json({ message: 'tutorId, skillToLearn, skillToTeach required.' });
    }

    const learnerProfile = await Profile.findOne({ user: req.user._id });
    const tutorProfile = await Profile.findOne({ user: tutorId }).populate('user', 'username email');
    if (!tutorProfile) return res.status(404).json({ message: 'Tutor profile not found.' });

    const matchScore = computeMatchScore(learnerProfile, tutorProfile, skillToLearn, skillToTeach);

    const existing = await Request.findOne({
      learner: req.user._id,
      tutor: tutorId,
      skillToLearn,
      status: { $in: ['pending', 'accepted'] },
    });
    if (existing) return res.status(400).json({ message: 'Request already exists.' });

    const request = await Request.create({
      learner: req.user._id,
      tutor: tutorId,
      skillToLearn,
      skillToTeach,
      message: message || '',
      matchScore,
    });

    const notif = await Notification.create({
      user: tutorId,
      type: 'request',
      title: 'New skill swap request',
      body: `${req.user.username} wants to learn ${skillToLearn} and teach ${skillToTeach}`,
      link: '/requests',
      relatedId: request._id,
    });
    emitToUser(tutorId, 'notification', notif);
    emitToUser(tutorId, 'request_update', { type: 'new' });

    const populated = await Request.findById(request._id)
      .populate('learner', 'username email')
      .populate('tutor', 'username email');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    const incoming = await Request.find({ tutor: req.user._id })
      .populate('learner', 'username email')
      .sort({ createdAt: -1 });
    const outgoing = await Request.find({ learner: req.user._id })
      .populate('tutor', 'username email')
      .sort({ createdAt: -1 });
    res.json({ incoming, outgoing });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id/accept', protect, async (req, res) => {
  try {
    const request = await Request.findOne({ _id: req.params.id, tutor: req.user._id });
    if (!request) return res.status(404).json({ message: 'Request not found.' });
    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request is not pending.' });
    }

    request.status = 'accepted';
    await request.save();

    const notif = await Notification.create({
      user: request.learner,
      type: 'request_accepted',
      title: 'Request accepted',
      body: 'Your skill swap request was accepted. Session can be created.',
      link: '/sessions',
      relatedId: request._id,
    });
    emitToUser(request.learner.toString(), 'notification', notif);
    emitToUser(request.learner.toString(), 'request_update', { type: 'accepted' });

    const populated = await Request.findById(request._id)
      .populate('learner', 'username email')
      .populate('tutor', 'username email');
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id/reject', protect, async (req, res) => {
  try {
    const request = await Request.findOne({ _id: req.params.id, tutor: req.user._id });
    if (!request) return res.status(404).json({ message: 'Request not found.' });
    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request is not pending.' });
    }

    request.status = 'rejected';
    await request.save();

    await Notification.create({
      user: request.learner,
      type: 'request_rejected',
      title: 'Request rejected',
      body: 'Your skill swap request was declined.',
      relatedId: request._id,
    });

    const populated = await Request.findById(request._id)
      .populate('learner', 'username email')
      .populate('tutor', 'username email');
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id/reschedule', protect, async (req, res) => {
  try {
    const request = await Request.findOne({ _id: req.params.id, tutor: req.user._id });
    if (!request) return res.status(404).json({ message: 'Request not found.' });
    request.status = 'rescheduled';
    request.rescheduleMessage = req.body.message || '';
    await request.save();

    await Notification.create({
      user: request.learner,
      type: 'request',
      title: 'Request reschedule',
      body: request.rescheduleMessage || 'Tutor suggested rescheduling.',
      link: '/requests',
      relatedId: request._id,
    });

    const populated = await Request.findById(request._id)
      .populate('learner', 'username email')
      .populate('tutor', 'username email');
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

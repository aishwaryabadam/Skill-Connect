import express from 'express';
import { Session } from '../models/Session.js';
import { Test } from '../models/Test.js';
import { Notification } from '../models/Notification.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, async (req, res) => {
  try {
    const { sessionId, title, questions } = req.body;
    if (!sessionId || !title || !Array.isArray(questions) || !questions.length) {
      return res.status(400).json({ message: 'sessionId, title, and questions array required.' });
    }

    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: 'Session not found.' });
    if (session.tutor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only tutor can create test.' });
    }
    if (session.status !== 'completed') {
      return res.status(400).json({ message: 'Session must be completed first.' });
    }

    // Validate MCQ format
    const normalized = questions.map((q, index) => {
      if (!q.question || !Array.isArray(q.options) || q.options.length < 2) {
        throw new Error(`Question ${index + 1}: Must have a question and at least 2 options.`);
      }
      if (typeof q.correctOption !== 'number' || q.correctOption < 0 || q.correctOption >= q.options.length) {
        throw new Error(`Question ${index + 1}: correctOption must be a valid option index.`);
      }
      return {
        question: q.question.trim(),
        options: q.options.map(opt => opt.trim()),
        correctOption: q.correctOption,
      };
    });

    const test = await Test.create({
      session: sessionId,
      tutor: session.tutor,
      learner: session.learner,
      title,
      questions: normalized,
    });

    await Notification.create({
      user: session.learner,
      type: 'test_created',
      title: 'New test',
      body: `Test "${title}" is available.`,
      link: `/sessions/${sessionId}`,
      relatedId: test._id,
    });

    const populated = await Test.findById(test._id)
      .populate('session')
      .populate('tutor', 'username email')
      .populate('learner', 'username email');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/session/:sessionId', protect, async (req, res) => {
  try {
    const test = await Test.findOne({ session: req.params.sessionId })
      .populate('session')
      .populate('tutor', 'username email')
      .populate('learner', 'username email');
    if (!test) return res.status(404).json({ message: 'Test not found.' });
    const isParticipant =
      test.tutor._id.toString() === req.user._id.toString() ||
      test.learner._id.toString() === req.user._id.toString();
    if (!isParticipant) return res.status(403).json({ message: 'Not allowed.' });

    const out = test.toObject();
    // Hide correct answers from learner
    if (test.learner._id.toString() === req.user._id.toString()) {
      out.questions = out.questions.map((q) => ({ 
        _id: q._id, 
        question: q.question,
        options: q.options 
      }));
    }
    res.json(out);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/:testId/attempt', protect, async (req, res) => {
  try {
    const test = await Test.findById(req.params.testId);
    if (!test) return res.status(404).json({ message: 'Test not found.' });
    if (test.learner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only learner can attempt.' });
    }

    const answers = Array.isArray(req.body.answers) ? req.body.answers : [];
    let correct = 0;
    
    test.questions.forEach((q, i) => {
      const userAnswer = answers[i];
      if (typeof userAnswer === 'number' && userAnswer === q.correctOption) {
        correct++;
      }
    });

    const total = test.questions.length;
    const score = total ? Math.round((correct / total) * 100) : 0;

    test.attempts.push({
      learner: req.user._id,
      answers,
      score,
      totalQuestions: total,
    });
    await test.save();

    res.json({
      score,
      totalQuestions: total,
      correct,
      attempts: test.attempts,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
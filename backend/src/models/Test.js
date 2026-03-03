import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }], // Array of options (A, B, C, D)
  correctOption: { type: Number, required: true, min: 0 }, // Index of correct option (0, 1, 2, 3)
}, { _id: true });

const attemptSchema = new mongoose.Schema({
  learner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answers: [{ type: Number }], // Array of selected option indices
  score: { type: Number, default: 0 },
  totalQuestions: { type: Number },
  attemptedAt: { type: Date, default: Date.now },
}, { _id: true });

const testSchema = new mongoose.Schema(
  {
    session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
    tutor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    learner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    questions: [questionSchema],
    attempts: [attemptSchema],
  },
  { timestamps: true }
);

export const Test = mongoose.model('Test', testSchema);
import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema(
  {
    learner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tutor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    skillToLearn: { type: String, required: true },
    skillToTeach: { type: String, required: true },
    message: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'rescheduled', 'cancelled'],
      default: 'pending',
    },
    matchScore: { type: Number, min: 0, max: 100 },
    rescheduleMessage: { type: String },
  },
  { timestamps: true }
);

requestSchema.index({ learner: 1, tutor: 1, skillToLearn: 1 });
export const Request = mongoose.model('Request', requestSchema);

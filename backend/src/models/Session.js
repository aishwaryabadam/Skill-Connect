import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
  {
    request: { type: mongoose.Schema.Types.ObjectId, ref: 'Request', required: true },
    tutor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    learner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sessionType: { type: String, enum: ['online', 'offline'], required: true },
    // Offline
    locationDetails: { type: String },
    googleMapsLink: { type: String },
    // Online
    sessionDate: { type: Date },
    sessionTime: { type: String },
    status: {
      type: String,
      enum: ['scheduled', 'in_progress', 'completed', 'cancelled'],
      default: 'scheduled',
    },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

export const Session = mongoose.model('Session', sessionSchema);

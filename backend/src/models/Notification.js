import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['request', 'request_accepted', 'request_rejected', 'session_created', 'session_reminder', 'test_created', 'review_received', 'chat'],
    },
    title: { type: String, required: true },
    body: { type: String, default: '' },
    link: { type: String },
    relatedId: mongoose.Schema.Types.Mixed,
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Notification = mongoose.model('Notification', notificationSchema);

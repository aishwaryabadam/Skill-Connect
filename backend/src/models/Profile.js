import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema({
  institution: String,
  degree: String,
  field: String,
  year: String,
}, { _id: false });

const profileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    name: { type: String, trim: true },
    aboutMe: { type: String, default: '' },
    availability: { type: String, default: '' },
    skillsICanTeach: [{ type: String, trim: true }],
    skillsIWantToLearn: [{ type: String, trim: true }],
    instagramId: { type: String, trim: true, default: '' },
    linkedInId: { type: String, trim: true, default: '' },
    githubId: { type: String, trim: true, default: '' },
    educationDetails: [educationSchema],
  },
  { timestamps: true }
);

export const Profile = mongoose.model('Profile', profileSchema);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SavedSearchSchema = new Schema({
  name: String,
  q: String,
  location: String,
  minSalary: Number,
  maxSalary: Number,
  remote: Boolean,
  createdAt: { type: Date, default: Date.now }
});

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['jobseeker', 'employer', 'admin'], default: 'jobseeker' },
  company: { type: String },
  phone: { type: String },
  location: { type: String },
  skills: { type: String },
  experience: { type: String },
  education: { type: String },
  summary: { type: String },
  linkedin: { type: String },
  portfolio: { type: String },
  resume: { type: String },
  verified: { type: Boolean, default: false },
  savedSearches: [SavedSearchSchema]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);

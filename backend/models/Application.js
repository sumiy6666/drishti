const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ApplicationSchema = new Schema({
  job: { type: Schema.Types.ObjectId, ref: 'Job' },
  applicant: { type: Schema.Types.ObjectId, ref: 'User' },
  coverLetter: { type: String },
  resumeUrl: { type: String },
  status: { type: String, enum: ['applied','reviewing','rejected','accepted'], default: 'applied' }
}, { timestamps: true });

module.exports = mongoose.model('Application', ApplicationSchema);

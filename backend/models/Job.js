const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JobSchema = new Schema({
  title: { type: String, required: true, text: true },
  description: { type: String, text: true },
  location: { type: String, index: true },
  salaryMin: { type: Number },
  salaryMax: { type: Number },
  salaryText: { type: String },
  company: { type: String },
  employer: { type: Schema.Types.ObjectId, ref: 'User' },
  skills: [String],
  remote: { type: Boolean, default: false },
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
  resumeRequired: { type: Boolean, default: false },
  customFields: [{
    label: String,
    value: String
  }]
}, { timestamps: true });

// text index
JobSchema.index({ title: 'text', description: 'text', skills: 'text', company: 'text' });

module.exports = mongoose.model('Job', JobSchema);

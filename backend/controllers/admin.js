const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

exports.users = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.jobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate('employer', 'name email company');
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    console.log(job, "huu");
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json({ ok: true, message: 'Job deleted successfully' });
  } catch (err) {
    console.error('Error deleting job:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.analytics = async (req, res) => {
  try {
    const users = await User.countDocuments();
    const jobs = await Job.countDocuments();
    const applications = await Application.countDocuments();
    res.json({ users, jobs, applications });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

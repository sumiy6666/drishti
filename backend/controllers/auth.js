const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mailer = require('../utils/mailer');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, company } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: 'User exists' });
    const hashed = await bcrypt.hash(password, 10);
    user = await User.create({ name, email, password: hashed, role, company });
    // send verification email
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email/${token}`;
    await mailer.send({ to: email, subject: 'Verify your email', html: `<p>Click <a href="${verifyUrl}">here</a> to verify your email</p>` });
    const authToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token: authToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role, verified: user.verified }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.me = async (req, res) => {
  try {
    const auth = require('../middleware/auth');
    await auth.verify(req, res, async () => {
      res.json({ user: req.user });
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, location, company, skills, experience, education, summary, linkedin, portfolio } = req.body;

    // Build update object
    const updateFields = {};
    if (name) updateFields.name = name;
    if (phone) updateFields.phone = phone;
    if (location) updateFields.location = location;
    if (company) updateFields.company = company;
    if (skills) updateFields.skills = skills;
    if (experience) updateFields.experience = experience;
    if (education) updateFields.education = education;
    if (summary) updateFields.summary = summary;
    if (linkedin) updateFields.linkedin = linkedin;
    if (portfolio) updateFields.portfolio = portfolio;
    if (req.body.resume) updateFields.resume = req.body.resume;

    const user = await User.findByIdAndUpdate(req.user.id, { $set: updateFields }, { new: true }).select('-password');
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const token = req.params.token;
    const payload = jwt.verify(token, JWT_SECRET);
    await User.findByIdAndUpdate(payload.id, { verified: true });
    res.send({ ok: true, message: 'Email verified' });
  } catch (err) {
    res.status(400).send({ error: 'Invalid or expired token' });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'No user' });
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${token}`;
    await mailer.send({ to: email, subject: 'Password reset', html: `<p>Reset: <a href="${resetUrl}">${resetUrl}</a></p>` });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const token = req.params.token;
    const { password } = req.body;
    const payload = jwt.verify(token, JWT_SECRET);
    const hashed = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(payload.id, { password: hashed });
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: 'Invalid or expired token' });
  }
};

exports.getPublicProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -savedSearches -savedJobs');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

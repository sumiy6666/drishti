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
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    user = await User.create({
      name, email, password: hashed, role, company,
      otp, otpExpires
    });

    try {
      await mailer.send({
        to: email,
        subject: 'Verify your Konnectt Account',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
            <h2 style="color: #2563eb;">Welcome to Konnectt!</h2>
            <p>Please use the following One-Time Password (OTP) to verify your account. This code is valid for 5 minutes.</p>
            <div style="background: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1f2937;">${otp}</span>
            </div>
            <p>If you didn't create an account with us, please ignore this email.</p>
          </div>
        `,
        text: `Your Konnectt verification code is: ${otp}`
      });
    } catch (mailErr) {
      // Rollback: delete the created user if email fails
      await User.findByIdAndDelete(user._id);
      console.error("Registration Mail Error:", mailErr);
      return res.status(500).json({ error: 'Failed to send verification email. Please try again.' });
    }

    const authToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
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
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
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

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp, type } = req.body; // type: 'register' or 'reset'
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    if (type === 'register') {
      user.verified = true;
    }

    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ ok: true, message: 'OTP verified' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    await mailer.send({
      to: email,
      subject: 'Your Konnectt OTP',
      html: `<p>Your new OTP is: <strong>${otp}</strong>. Valid for 5 minutes.</p>`,
      text: `Your new Konnectt OTP is: ${otp}`
    });

    res.json({ ok: true, message: 'OTP resent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    await mailer.send({
      to: email,
      subject: 'Password Reset OTP - Konnectt',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="color: #2563eb;">Password Reset Request</h2>
          <p>You requested a password reset. Use the code below to set a new password. This code is valid for 5 minutes.</p>
          <div style="background: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1f2937;">${otp}</span>
          </div>
          <p>If you didn't request this, please ignore this email or contact support if you have concerns.</p>
        </div>
      `,
      text: `Your password reset OTP is: ${otp}`
    });

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
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

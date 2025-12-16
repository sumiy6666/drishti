const Message = require('../models/Message');
const User = require('../models/User');

exports.sendMessage = async (req,res) => {
  try {
    const { to, text, job } = req.body;
    const msg = await Message.create({ from: req.user._id, to, text, job });
    res.json(msg);
  } catch (err) {
    res.status(500).json({error:'Server error'});
  }
};

exports.getConversation = async (req,res) => {
  try {
    const other = req.params.userId;
    const msgs = await Message.find({ $or: [{ from: req.user._id, to: other }, { from: other, to: req.user._id }] }).sort({ createdAt: 1 });
    res.json(msgs);
  } catch (err) {
    res.status(500).json({error:'Server error'});
  }
};

exports.inbox = async (req,res) => {
  try {
    const agg = await Message.aggregate([
      { $match: { $or: [{ from: req.user._id }, { to: req.user._id }] } },
      { $sort: { createdAt: -1 } },
      { $group: { _id: { $cond: [{ $eq: ['$from', req.user._id] }, '$to', '$from'] }, lastMsg: { $first: '$$ROOT' } } }
    ]);
    res.json(agg);
  } catch (err) {
    res.status(500).json({error:'Server error'});
  }
};

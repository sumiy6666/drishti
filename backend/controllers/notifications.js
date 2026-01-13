const Notification = require('../models/Notification');

exports.list = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .limit(20); // Limit to last 20 notifications

        const unreadCount = await Notification.countDocuments({ user: req.user._id, read: false });

        res.json({ notifications, unreadCount });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.markRead = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findById(id);

        if (!notification) return res.status(404).json({ error: 'Not found' });
        if (notification.user.toString() !== req.user._id.toString()) return res.status(403).json({ error: 'Forbidden' });

        notification.read = true;
        await notification.save();

        res.json(notification);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.markAllRead = async (req, res) => {
    try {
        await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

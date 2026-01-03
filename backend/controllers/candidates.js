const User = require('../models/User');

exports.list = async (req, res) => {
    try {
        const { q, location, skills, page = 1, limit = 10 } = req.query;

        // Base filter: only jobseekers
        const filter = { role: 'jobseeker' };

        if (location) {
            filter.location = { $regex: location, $options: 'i' };
        }

        if (skills) {
            // Assuming skills is a comma-separated string in query, and a string in DB (or array)
            // If DB has skills as string:
            filter.skills = { $regex: skills, $options: 'i' };
        }

        if (q) {
            filter.$or = [
                { name: { $regex: q, $options: 'i' } },
                { skills: { $regex: q, $options: 'i' } },
                { summary: { $regex: q, $options: 'i' } }
            ];
        }

        const total = await User.countDocuments(filter);

        const candidates = await User.find(filter)
            .select('-password -savedSearches -savedJobs') // Exclude private info
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        res.json({
            data: candidates,
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / limit)
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.get = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password -savedSearches -savedJobs');
        if (!user || user.role !== 'jobseeker') {
            return res.status(404).json({ error: 'Candidate not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

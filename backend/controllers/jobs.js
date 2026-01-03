const Job = require('../models/Job');
const Application = require('../models/Application');
const User = require('../models/User');

exports.list = async (req, res) => {
  try {
    console.log("Jobs List API Hit");
    console.log("Query Params:", req.query);

    const { q, location, skills, page = 1, limit = 10, minSalary, maxSalary, remote } = req.query;
    // const filter = { status: 'open' }; // Temporarily removed for debugging
    const filter = {};
    if (location) filter.location = location;
    if (skills) filter.skills = { $in: skills.split(',') };
    if (remote !== undefined) filter.remote = remote === 'true';
    if (minSalary) filter.salaryMin = { $gte: parseInt(minSalary) };
    if (maxSalary) filter.salaryMax = { $lte: parseInt(maxSalary) };

    console.log("Constructed Filter:", JSON.stringify(filter));

    const allJobsCount = await Job.countDocuments({});
    console.log("Total Jobs in DB (Unfiltered):", allJobsCount);

    let query;
    if (q) {
      query = Job.find({ $text: { $search: q }, ...filter });
    } else {
      query = Job.find(filter);
    }
    const total = await Job.countDocuments(query.getFilter ? query.getFilter() : query);
    console.log("Total Jobs Found:", total);

    const jobs = await query
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })
      .populate('employer', 'name company email');

    res.json({ data: jobs, total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.get = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('employer', 'name company email');
    if (!job) return res.status(404).json({ error: 'Not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.create = async (req, res) => {
  try {
    const body = req.body;
    body.employer = req.user._id;
    const job = await Job.create(body);
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.update = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Not found' });
    if (job.employer.toString() !== req.user._id.toString() && req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    Object.assign(job, req.body);
    await job.save();
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.remove = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Not found' });
    if (job.employer.toString() !== req.user._id.toString() && req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    await job.remove();
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.apply = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Not found' });
    const existing = await Application.findOne({ job: job._id, applicant: req.user._id });
    if (existing) return res.status(400).json({ error: 'Already applied' });
    const app = await Application.create({ job: job._id, applicant: req.user._id, coverLetter: req.body.coverLetter || '', resumeUrl: req.body.resumeUrl || '' });
    res.json(app);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getApplications = async (req, res) => {
  try {
    console.log(`Fetching applications for job ${req.params.id}`);
    const apps = await Application.find({ job: req.params.id })
      .populate('applicant', 'name email resume') // Light payload: only essential info
      .sort({ createdAt: -1 });

    // Filter out applications where applicant is null (deleted user)
    const validApps = apps.filter(app => app.applicant);

    console.log(`Found ${apps.length} total applications, ${validApps.length} valid`);

    res.json(validApps);
  } catch (err) {
    console.error("Error in getApplications:", err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getApplicationDetails = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id)
      .populate('applicant', 'name email phone location skills experience education summary linkedin portfolio resume')
      .populate('job', 'title company');

    if (!app) return res.status(404).json({ error: 'Application not found' });

    res.json(app);
  } catch (err) {
    console.error("Error in getApplicationDetails:", err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.myApplications = async (req, res) => {
  console.log("myApplications controller hit");
  try {
    if (!req.user) {
      console.log("No req.user found");
      return res.status(401).json({ error: 'User not authenticated' });
    }
    console.log("User ID:", req.user._id);

    // Step 1: Find applications without populate
    console.log("Finding applications...");
    const appsRaw = await Application.find({ applicant: req.user._id });
    console.log(`Found ${appsRaw.length} raw applications`);

    // Step 2: Populate
    console.log("Populating...");
    const apps = await Application.find({ applicant: req.user._id })
      .populate({
        path: 'job',
        populate: { path: 'employer', select: 'company' }
      })
      .sort({ createdAt: -1 });

    console.log("Population complete. Sending response.");
    res.json(apps);
  } catch (err) {
    console.error("Error fetching my applications:", err);
    console.error("Stack:", err.stack);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

exports.saveSearch = async (req, res) => {
  try {
    const user = req.user;
    const { name, q, location, minSalary, maxSalary, remote } = req.body;
    user.savedSearches.push({ name, q, location, minSalary, maxSalary, remote });
    await user.save();
    res.json(user.savedSearches);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getSavedSearches = async (req, res) => {
  try {
    const user = req.user;
    res.json(user.savedSearches || []);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.toggleSave = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const jobId = req.params.id;

    const index = user.savedJobs.indexOf(jobId);
    if (index === -1) {
      user.savedJobs.push(jobId);
    } else {
      user.savedJobs.splice(index, 1);
    }
    await user.save();
    res.json(user.savedJobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/User');
const Job = require('./models/Job');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/jobportal', {
  useNewUrlParser: true, useUnifiedTopology: true
});

async function seed(){
  await User.deleteMany({});
  await Job.deleteMany({});
  const pass = await bcrypt.hash('password',10);
  const admin = await User.create({ name:'Admin', email:'admin@demo.com', password:pass, role:'admin', verified:true });
  const employer = await User.create({ name:'Acme HR', email:'hr@acme.com', password:pass, role:'employer', company:'Acme Corp', verified:true });
  const seeker = await User.create({ name:'John Doe', email:'john@demo.com', password:pass, role:'jobseeker', verified:true });

  await Job.create({
    title: 'Frontend Developer',
    description: 'Looking for React developer with 2+ years experience',
    location: 'Bangalore',
    salaryMin: 800000, salaryMax: 1200000, salaryText: '8-12 LPA',
    company: 'Acme Corp',
    employer: employer._id,
    skills: ['react','javascript','css'],
    remote: false
  });

  await Job.create({
    title: 'Backend Developer (Node.js)',
    description: 'Node.js, Express, MongoDB experience required',
    location: 'Remote',
    salaryMin: 1000000, salaryMax: 1800000, salaryText: '10-18 LPA',
    company: 'Acme Corp',
    employer: employer._id,
    skills: ['node','express','mongodb'],
    remote: true
  });

  console.log('Seed done. Users: admin@demo.com / hr@acme.com / john@demo.com  (password: password)');
  process.exit(0);
}

seed();

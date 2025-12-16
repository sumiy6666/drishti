import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function EmployerDashboard() {
  const [jobs, setJobs] = useState([]);

  const token = localStorage.getItem('token');

  const fetchJobs = async () => {
    try {
      const res = await fetch((process.env.REACT_APP_API || 'http://localhost:5000') + '/api/jobs', {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      const data = await res.json();
      setJobs(data.data || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-10 pt-24 text-white relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-2">Employer Dashboard</h1>
          <p className="text-gray-400">Post new opportunities and manage your listings.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Post Job Action */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-3xl sticky top-24 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-4">Actions</h2>
              <p className="text-gray-400 text-sm mb-6">Create a new job listing to find the perfect candidate for your company.</p>

              <Link
                to="/post-job"
                className="block w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center font-bold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all transform hover:-translate-y-0.5"
              >
                + Post a New Job
              </Link>

              <div className="mt-8 pt-8 border-t border-white/10">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Quick Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <span className="block text-3xl font-bold text-blue-400 mb-1">{jobs.length}</span>
                    <span className="text-xs text-gray-400 font-medium">Active Jobs</span>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <span className="block text-3xl font-bold text-purple-400 mb-1">
                      {jobs.reduce((acc, job) => acc + (job.applications?.length || 0), 0)}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">Total Applicants</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Your Jobs List */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-white mb-6">Your Posted Jobs</h2>
            <div className="space-y-4">
              {jobs.filter(j => j.employer && j.employer._id).length === 0 ? (
                <div className="text-center py-12 bg-white/5 rounded-3xl border border-white/10">
                  <div className="text-4xl mb-3">📂</div>
                  <p className="text-gray-400">You haven't posted any jobs yet.</p>
                </div>
              ) : (
                jobs.filter(j => j.employer && j.employer._id).map(j => (
                  <div key={j._id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group hover:border-blue-500/30">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <Link to={`/jobs/${j._id}`} className="group-hover:text-blue-400 transition-colors">
                          <h3 className="text-xl font-bold text-white">{j.title}</h3>
                        </Link>
                        <p className="text-gray-400 text-sm">{j.company}</p>
                      </div>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${j.remote ? 'bg-green-500/20 text-green-400 border border-green-500/20' : 'bg-blue-500/20 text-blue-400 border border-blue-500/20'}`}>
                        {j.remote ? 'Remote' : 'On-site'}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                      <span className="flex items-center gap-1">📍 {j.location}</span>
                      <span className="flex items-center gap-1">💰 {j.salaryText || 'Negotiable'}</span>
                    </div>

                    <p className="text-gray-500 text-sm line-clamp-2 mb-4">{j.description}</p>

                    <div className="flex gap-3">
                      <Link to={`/jobs/${j._id}`} className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">View Details</Link>
                      <Link to={`/jobs/${j._id}/applications`} className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors">View Applicants</Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

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
    <div className="min-h-screen bg-light py-10 pt-32 text-body relative overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-bold text-dark mb-2">Employer Dashboard</h1>
          <p className="text-secondary font-medium">Post new opportunities and manage your listings.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Post Job Action */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-100 p-8 rounded-3xl sticky top-32 shadow-card">
              <h2 className="text-xl font-bold text-dark mb-4">Actions</h2>
              <p className="text-body text-sm mb-6">Create a new job listing to find the perfect candidate for your company.</p>

              <Link
                to="/post-job"
                className="block w-full py-4 bg-primary text-white text-center font-bold rounded-xl hover:bg-blue-700 transition-all shadow-button hover:-translate-y-0.5"
              >
                + Post a New Job
              </Link>

              <div className="mt-8 pt-8 border-t border-gray-100">
                <h3 className="text-xs font-bold text-secondary uppercase tracking-wider mb-4">Quick Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
                    <span className="block text-3xl font-bold text-primary mb-1">{jobs.length}</span>
                    <span className="text-xs text-secondary font-bold">Active Jobs</span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
                    <span className="block text-3xl font-bold text-blue-500 mb-1">
                      {jobs.reduce((acc, job) => acc + (job.applications?.length || 0), 0)}
                    </span>
                    <span className="text-xs text-secondary font-bold">Total Applicants</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Your Jobs List */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-dark mb-6">Your Posted Jobs</h2>
            <div className="space-y-4">
              {jobs.filter(j => j.employer && j.employer._id).length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm">
                  <div className="text-6xl mb-4 opacity-50">📂</div>
                  <h3 className="text-lg font-bold text-dark mb-2">No Jobs Posted Yet</h3>
                  <p className="text-body">Get started by posting your first job opportunity.</p>
                </div>
              ) : (
                jobs.filter(j => j.employer && j.employer._id).map(j => (
                  <div key={j._id} className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-card-hover transition-all duration-300 group relative">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <Link to={`/jobs/${j._id}`} className="group-hover:text-primary transition-colors">
                          <h3 className="text-xl font-bold text-dark">{j.title}</h3>
                        </Link>
                        <p className="text-secondary text-sm font-medium">{j.company}</p>
                      </div>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${j.remote ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                        {j.remote ? 'Remote' : 'On-site'}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-body mb-4 font-medium">
                      <span className="flex items-center gap-1"><i className="fas fa-map-marker-alt text-primary"></i> {j.location}</span>
                      <span className="flex items-center gap-1"><i className="fas fa-money-bill-wave text-primary"></i> {j.salaryText || 'Negotiable'}</span>
                    </div>

                    <p className="text-body text-sm line-clamp-2 mb-6">{j.description}</p>

                    <div className="flex gap-3">
                      <Link to={`/jobs/${j._id}`} className="px-4 py-2 bg-gray-50 text-dark text-sm font-bold rounded-lg hover:bg-gray-100 transition-colors">
                        View Details
                      </Link>
                      <Link to={`/jobs/${j._id}/applications`} className="px-4 py-2 bg-primary/10 text-primary text-sm font-bold rounded-lg hover:bg-primary/20 transition-colors">
                        View Applicants
                      </Link>
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

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import JobCard from '../components/JobCard';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({});
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    type: [],
    minSalary: 0,
    page: 1
  });

  // Parse query params on initial load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setFilters(prev => ({
      ...prev,
      search: params.get('search') || '',
      location: params.get('location') || ''
    }));
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.search) params.append('q', filters.search);
    if (filters.location) params.append('location', filters.location);
    if (filters.type.length > 0) params.append('type', filters.type.join(','));
    if (filters.minSalary > 0) params.append('minSalary', filters.minSalary);
    params.append('page', filters.page);

    try {
      const res = await fetch((process.env.REACT_APP_API || 'http://localhost:5000') + '/api/jobs?' + params.toString(), {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      const data = await res.json();
      setJobs(data.data || []);
      setMeta({ page: data.page, total: data.total, totalPages: data.totalPages });
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleTypeToggle = (type) => {
    setFilters(prev => {
      const newTypes = prev.type.includes(type)
        ? prev.type.filter(t => t !== type)
        : [...prev.type, type];
      return { ...prev, type: newTypes, page: 1 };
    });
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="min-h-screen bg-light py-10 pt-32 font-sans text-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-dark mb-4 tracking-tight">
            Find Your Next Career
          </h1>
          <p className="text-body max-w-2xl mx-auto text-lg">
            Browse thousands of job openings from top companies.
          </p>

          {/* Page Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-secondary mb-2">Find Your Dream Job</h1>
            <p className="text-body">Browse thousands of job openings and find the perfect fit.</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">

            {/* Sidebar Filters */}
            <div className="w-full lg:w-1/4 space-y-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-secondary text-lg mb-6">Search Filter</h3>

                {/* Search Input */}
                <div className="mb-6">
                  <label className="block text-sm font-bold text-secondary mb-2">Keywords</label>
                  <div className="relative">
                    <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    <input
                      type="text"
                      placeholder="Job title, skills..."
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                    />
                  </div>
                </div>

                {/* Location Input */}
                <div className="mb-6">
                  <label className="block text-sm font-bold text-secondary mb-2">Location</label>
                  <div className="relative">
                    <i className="fas fa-map-marker-alt absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    <input
                      type="text"
                      placeholder="City or Zip Code"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                      value={filters.location}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                    />
                  </div>
                </div>

                {/* Job Type Checkboxes */}
                <div className="mb-6">
                  <label className="block text-sm font-bold text-secondary mb-3">Job Type</label>
                  <div className="space-y-2">
                    {['Full Time', 'Part Time', 'Remote', 'Contract', 'Internship'].map(type => (
                      <label key={type} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${filters.type.includes(type) ? 'bg-primary border-primary' : 'border-gray-300 bg-white group-hover:border-primary'}`}>
                          {filters.type.includes(type) && <i className="fas fa-check text-white text-xs"></i>}
                        </div>
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={filters.type.includes(type)}
                          onChange={() => handleTypeToggle(type)}
                        />
                        <span className="text-body text-sm group-hover:text-primary transition-colors">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Salary Range */}
                <div>
                  <label className="block text-sm font-bold text-secondary mb-3">Minimum Salary</label>
                  <input
                    type="range"
                    min="0"
                    max="200000"
                    step="5000"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    value={filters.minSalary || 0}
                    onChange={(e) => handleFilterChange('minSalary', parseInt(e.target.value))}
                  />
                  <div className="flex justify-between text-xs text-body mt-2 font-medium">
                    <span>${(filters.minSalary || 0).toLocaleString()}</span>
                    <span>$200k+</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Job List */}
            <div className="w-full lg:w-3/4">
              {/* Sort/Count Header */}
              <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-body text-sm">Showing <span className="font-bold text-secondary">{jobs.length}</span> Jobs</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-body">Sort by:</span>
                  <select className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-primary">
                    <option>Newest</option>
                    <option>Oldest</option>
                    <option>Salary (High-Low)</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-pulse h-40"></div>
                  ))}
                </div>
              ) : jobs.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {jobs.map(job => (
                    <JobCard
                      key={job._id}
                      job={{
                        id: job._id,
                        title: job.title,
                        company: job.company,
                        location: job.location,
                        type: job.remote ? 'Remote' : 'Full Time',
                        salary: job.salaryText || (job.salaryMin ? `₹${job.salaryMin} - ₹${job.salaryMax}` : null),
                        logo: job.company ? job.company.charAt(0).toUpperCase() : 'C',
                        postedAt: 'Recently'
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400 text-2xl">
                    <i className="fas fa-search"></i>
                  </div>
                  <h3 className="text-lg font-bold text-secondary mb-2">No Jobs Found</h3>
                  <p className="text-body">Try adjusting your search filters.</p>
                </div>
              )}

              {/* Pagination */}
              {/* Pagination */}
              {meta.totalPages > 1 && (
                <div className="mt-10 flex justify-center gap-2">
                  <button
                    onClick={() => handlePageChange(Math.max(1, filters.page - 1))}
                    disabled={filters.page === 1}
                    className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-body hover:bg-primary hover:text-white hover:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>

                  {[...Array(meta.totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${filters.page === i + 1 ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'border border-gray-200 text-body hover:bg-primary hover:text-white hover:border-primary'}`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(Math.min(meta.totalPages, filters.page + 1))}
                    disabled={filters.page === meta.totalPages}
                    className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-body hover:bg-primary hover:text-white hover:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

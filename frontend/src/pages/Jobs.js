import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authFetch } from '../api';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [location, setLocation] = useState('');
  const [remote, setRemote] = useState(false);
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');
  const [meta, setMeta] = useState({});

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const fetchJobs = async () => {
    const params = new URLSearchParams();
    if (q) params.append('q', q);
    if (location) params.append('location', location);
    if (remote) params.append('remote', 'true');
    if (minSalary) params.append('minSalary', minSalary);
    if (maxSalary) params.append('maxSalary', maxSalary);
    params.append('page', page);

    try {
      const res = await fetch((process.env.REACT_APP_API || 'http://localhost:5000') + '/api/jobs?' + params.toString(), {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      const data = await res.json();
      setJobs(data.data || []);
      setMeta({ page: data.page, total: data.total, totalPages: data.totalPages });
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [q, page, location, remote, minSalary, maxSalary]);

  const apply = async (id) => {
    if (!token) return alert('Login as jobseeker to apply');

    const resumeFile = document.getElementById('resume-file')?.files?.[0];
    let resumeUrl = '';

    if (resumeFile) {
      try {
        const pres = await fetch((process.env.REACT_APP_API || 'http://localhost:5000') + '/api/upload/presign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token, 'ngrok-skip-browser-warning': 'true' },
          body: JSON.stringify({ filename: resumeFile.name, contentType: resumeFile.type })
        });
        const presData = await pres.json();
        if (!pres.ok) return alert('Could not get upload url');

        await fetch(presData.uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': resumeFile.type },
          body: resumeFile
        });
        resumeUrl = presData.publicUrl;
      } catch (error) {
        console.error("Upload error:", error);
        return alert('Error uploading resume');
      }
    }

    const cover = prompt('Write a short cover letter (optional)');
    if (cover === null) return; // User cancelled

    try {
      const res = await fetch((process.env.REACT_APP_API || 'http://localhost:5000') + `/api/jobs/${id}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token, 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify({ coverLetter: cover, resumeUrl })
      });
      const data = await res.json();
      if (res.ok) alert('Applied successfully');
      else alert(data.error || 'Error');
    } catch (error) {
      console.error("Apply error:", error);
      alert('Failed to apply');
    }
  };

  return (
    <div className="min-h-screen bg-light py-10 pt-24 font-sans text-body">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-dark mb-4 tracking-tight">
            Browse Opportunities
          </h1>
          <p className="text-body max-w-2xl mx-auto text-lg">
            Find your next career move in the decentralized world.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <input
              type="text"
              placeholder="Search by title or company..."
              value={q}
              onChange={e => setQ(e.target.value)}
              className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-dark placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all hover:bg-white"
            />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-dark placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all hover:bg-white"
            />
            <div className="flex items-center gap-3 px-5 bg-gray-50 border border-gray-200 rounded-xl hover:bg-white transition-colors">
              <input
                type="checkbox"
                id="remote"
                checked={remote}
                onChange={e => setRemote(e.target.checked)}
                className="w-5 h-5 text-primary bg-white border-gray-300 rounded focus:ring-primary"
              />
              <label htmlFor="remote" className="text-body font-medium cursor-pointer select-none">Remote Only</label>
            </div>
            <input
              type="number"
              placeholder="Min Salary (INR)"
              value={minSalary}
              onChange={e => setMinSalary(e.target.value)}
              className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-dark placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all hover:bg-white"
            />
            <input
              type="number"
              placeholder="Max Salary (INR)"
              value={maxSalary}
              onChange={e => setMaxSalary(e.target.value)}
              className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-dark placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all hover:bg-white"
            />
            <button
              onClick={() => { setPage(1); fetchJobs(); }}
              className="w-full px-5 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-primary/20 transition-all transform hover:-translate-y-0.5"
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* Resume Upload (Hidden/Utility) */}
        <div className="mb-6 hidden">
          <label className="block text-sm font-medium text-gray-400 mb-2">Upload Resume (Optional for application)</label>
          <input
            id="resume-file"
            type="file"
            className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
          />
        </div>

        {/* Job List */}
        <div className="space-y-6">
          {jobs.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <div className="text-6xl mb-4 opacity-50">🔍</div>
              <p className="text-body text-lg">No jobs found matching your criteria.</p>
            </div>
          ) : (
            jobs.map(j => (
              <div key={j._id} className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                  <div className="flex-1">
                    <Link to={`/jobs/${j._id}`} className="group-hover:text-primary transition-colors">
                      <h3 className="text-2xl font-bold text-dark mb-2">{j.title}</h3>
                    </Link>
                    <p className="text-body font-medium text-lg mb-4">{j.company}</p>

                    <div className="flex flex-wrap gap-3 text-sm text-body mb-6">
                      <span className="flex items-center gap-1.5 bg-light px-4 py-1.5 rounded-full border border-gray-100 font-medium">
                        📍 {j.location}
                      </span>
                      <span className="flex items-center gap-1.5 bg-light px-4 py-1.5 rounded-full border border-gray-100 font-medium">
                        💰 {j.salaryText || 'Salary not specified'}
                      </span>
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${j.remote ? 'bg-green-50 text-secondary border-green-100' : 'bg-blue-50 text-primary border-blue-100'}`}>
                        {j.remote ? 'Remote' : 'On-site'}
                      </span>
                    </div>

                    <p className="text-body line-clamp-2 leading-relaxed max-w-3xl">{j.description}</p>
                  </div>

                  <div className="flex flex-row md:flex-col gap-4 w-full md:w-auto mt-4 md:mt-0 min-w-[140px]">
                    <Link
                      to={`/jobs/${j._id}`}
                      className="flex-1 md:flex-none px-6 py-3 border border-gray-200 text-dark text-center font-bold rounded-xl hover:bg-light hover:border-gray-300 transition-all"
                    >
                      Details
                    </Link>
                    {user?.role === 'jobseeker' && (
                      <button
                        onClick={() => apply(j._id)}
                        className="flex-1 md:flex-none px-6 py-3 bg-primary text-white text-center font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-primary/20"
                      >
                        Apply
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="mt-16 flex justify-center items-center gap-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-6 py-3 border border-gray-200 rounded-xl text-body font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white hover:shadow-sm transition-all bg-white"
          >
            Previous
          </button>
          <span className="text-gray-400 font-medium">
            Page <span className="text-dark font-bold">{meta.page || 1}</span> of <span className="text-dark font-bold">{meta.totalPages || 1}</span>
          </span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page >= (meta.totalPages || 1)}
            className="px-6 py-3 border border-gray-200 rounded-xl text-body font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white hover:shadow-sm transition-all bg-white"
          >
            Next
          </button>
        </div>

      </div>
    </div>
  );
}

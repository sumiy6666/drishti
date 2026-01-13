import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showAlert, showConfirm } from '../utils/swal';

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
    <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
    </div>
  </div>
);

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({ users: 0, jobs: 0, applications: 0 });
  const [activeTab, setActiveTab] = useState('users');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const headers = { Authorization: 'Bearer ' + token, 'ngrok-skip-browser-warning': 'true' };
      const baseUrl = process.env.REACT_APP_API || 'http://localhost:5000';

      const [usersRes, jobsRes, statsRes] = await Promise.all([
        fetch(baseUrl + '/api/admin/users', { headers }),
        fetch(baseUrl + '/api/admin/jobs', { headers }),
        fetch(baseUrl + '/api/admin/analytics', { headers })
      ]);

      if (!usersRes.ok) {
        if (usersRes.status === 401) {
          navigate('/login');
          return;
        }
        if (usersRes.status === 403) {
          setError("Access Denied: You are not an admin.");
          return;
        }
        throw new Error("Failed to fetch users");
      }

      setUsers(await usersRes.json());
      if (jobsRes.ok) setJobs(await jobsRes.json());
      if (statsRes.ok) setStats(await statsRes.json());

    } catch (error) {
      console.error("Error fetching admin data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteUser = async (id) => {
    const result = await showConfirm('Delete User?', 'Are you sure you want to delete this user? This action cannot be undone.');
    if (!result.isConfirmed) return;
    try {
      const res = await fetch((process.env.REACT_APP_API || 'http://localhost:5000') + '/api/admin/users/' + id, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + token, 'ngrok-skip-browser-warning': 'true' }
      });
      if (res.ok) {
        setUsers(users.filter(u => u._id !== id));
        fetchData(); // Refresh stats
      } else {
        showAlert('Error', 'Failed to delete user', 'error');
      }
    } catch (error) {
      console.error("Delete user error:", error);
    }
  };

  const deleteJob = async (id) => {
    const result = await showConfirm('Delete Job?', 'Are you sure you want to delete this job?');
    if (!result.isConfirmed) return;
    try {
      const res = await fetch((process.env.REACT_APP_API || 'http://localhost:5000') + '/api/admin/jobs/' + id, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + token, 'ngrok-skip-browser-warning': 'true' }
      });
      if (res.ok) {
        setJobs(jobs.filter(j => j._id !== id));
        fetchData(); // Refresh stats
      } else {
        showAlert('Error', 'Failed to delete job', 'error');
      }
    } catch (error) {
      console.error("Delete job error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-2">Overview of system performance and management.</p>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard
            title="Total Users"
            value={stats.users}
            icon={<span className="text-xl">👥</span>}
            color="bg-blue-600"
          />
          <StatCard
            title="Active Jobs"
            value={stats.jobs}
            icon={<span className="text-xl">💼</span>}
            color="bg-emerald-600"
          />
          <StatCard
            title="Total Applications"
            value={stats.applications}
            icon={<span className="text-xl">📄</span>}
            color="bg-purple-600"
          />
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('users')}
                className={`py-4 px-6 text-sm font-medium ${activeTab === 'users'
                  ? 'border-b-2 border-gray-900 text-gray-900'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                User Management
              </button>
              <button
                onClick={() => setActiveTab('jobs')}
                className={`py-4 px-6 text-sm font-medium ${activeTab === 'jobs'
                  ? 'border-b-2 border-gray-900 text-gray-900'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                Job Management
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'users' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map(user => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                            user.role === 'employer' ? 'bg-blue-100 text-blue-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => deleteUser(user._id)}
                            className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded-md transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'jobs' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posted By</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {jobs.map(job => (
                      <tr key={job._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{job.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.company}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.location}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {job.employer ? job.employer.name : <span className="text-gray-400">Unknown</span>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => deleteJob(job._id)}
                            className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded-md transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

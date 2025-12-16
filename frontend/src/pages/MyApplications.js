import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function MyApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApps = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch((process.env.REACT_APP_API || 'http://localhost:5000') + '/api/jobs/my-applications', {
                    headers: { Authorization: 'Bearer ' + token, 'ngrok-skip-browser-warning': 'true' }
                });
                if (!res.ok) throw new Error('Failed to fetch applications');
                const data = await res.json();
                setApplications(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchApps();
    }, []);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>;

    return (
        <div className="min-h-screen bg-[#0a0a0a] py-12 px-4 sm:px-6 lg:px-8 pt-24 text-white relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-5xl mx-auto relative z-10">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white tracking-tight mb-2">My Applications</h1>
                    <p className="text-gray-400">Track the status of your job applications.</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-2xl mb-8">
                        {error}
                    </div>
                )}

                {applications.length === 0 && !error ? (
                    <div className="text-center py-20 bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10">
                        <div className="text-6xl mb-4">📂</div>
                        <h3 className="text-xl font-bold text-white mb-2">No applications yet</h3>
                        <p className="text-gray-400 mb-8 max-w-md mx-auto">Start exploring jobs and apply to your dream roles!</p>
                        <Link to="/jobs" className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all transform hover:-translate-y-0.5">
                            Browse Jobs
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {applications.map((app) => (
                            <div key={app._id} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group hover:border-blue-500/30">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors mb-1">
                                            {app.job ? app.job.title : 'Job Unavailable'}
                                        </h3>
                                        <p className="text-gray-400 font-medium">
                                            {app.job && app.job.employer ? app.job.employer.company : 'Unknown Company'}
                                        </p>
                                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                                            <span className="flex items-center gap-1 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                                                📅 Applied on {new Date(app.createdAt).toLocaleDateString()}
                                            </span>
                                            {app.job && (
                                                <span className="flex items-center gap-1 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                                                    📍 {app.job.location}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider ${app.status === 'accepted' ? 'bg-green-500/20 text-green-400 border border-green-500/20' :
                                                app.status === 'rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/20' :
                                                    'bg-blue-500/20 text-blue-400 border border-blue-500/20'
                                            }`}>
                                            {app.status || 'Pending'}
                                        </span>
                                        {app.job && (
                                            <Link
                                                to={`/jobs/${app.job._id}`}
                                                className="text-gray-400 hover:text-white transition-colors font-medium"
                                            >
                                                View Job →
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

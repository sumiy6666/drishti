import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { showAlert } from '../utils/swal';

export default function MyApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch((process.env.REACT_APP_API || 'http://localhost:5000') + '/api/jobs/my-applications', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'ngrok-skip-browser-warning': 'true'
                    }
                });

                if (!res.ok) throw new Error('Failed to fetch applications');
                const data = await res.json();
                setApplications(data);
            } catch (err) {
                console.error(err);
                showAlert('Error', 'Failed to load applications', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'accepted': return 'bg-green-100 text-green-700 border-green-200';
            case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
            case 'reviewing': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            default: return 'bg-blue-100 text-blue-700 border-blue-200';
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-light"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

    return (
        <div className="min-h-screen bg-light py-12 px-4 sm:px-6 lg:px-8 pt-32 text-body relative">
            {/* Background Shapes */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-5xl mx-auto relative z-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-dark">My Applications</h1>
                    <p className="text-secondary mt-1 font-medium">Track the status of your job applications.</p>
                </div>

                {applications.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                        <div className="text-6xl mb-4 opacity-50">📂</div>
                        <h3 className="text-xl font-bold text-dark mb-2">No Applications Yet</h3>
                        <p className="text-body mb-6">You haven't applied to any jobs yet. Start exploring opportunities!</p>
                        <Link to="/jobs" className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-button hover:-translate-y-0.5 inline-block">
                            Find Jobs
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {applications.map(app => (
                            <div key={app._id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-card-hover transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl">
                                        {app.job?.employer?.company?.charAt(0).toUpperCase() || 'C'}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-dark">{app.job?.title || 'Job Title Unavailable'}</h3>
                                        <p className="text-sm text-secondary font-medium">{app.job?.employer?.company || 'Company Unavailable'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 md:gap-8">
                                    <div className="text-right">
                                        <p className="text-xs text-secondary font-bold uppercase tracking-wider mb-1">Applied On</p>
                                        <p className="text-sm font-medium text-dark">{new Date(app.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-secondary font-bold uppercase tracking-wider mb-1">Status</p>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(app.status || 'applied')}`}>
                                            {(app.status || 'applied').charAt(0).toUpperCase() + (app.status || 'applied').slice(1)}
                                        </span>
                                    </div>
                                    <Link to={`/jobs/${app.job?._id}`} className="px-4 py-2 bg-gray-50 text-dark font-bold rounded-lg hover:bg-gray-100 transition-colors text-sm">
                                        View Job
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

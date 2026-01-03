import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function CompanyProfile() {
    const { id } = useParams();
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_API || 'http://localhost:5000'}/api/auth/profile/${id}`, {
                    headers: { 'ngrok-skip-browser-warning': 'true' }
                });
                if (!res.ok) throw new Error('Company not found');
                const data = await res.json();
                setCompany(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCompany();
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-light"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
    if (error || !company) return <div className="min-h-screen flex items-center justify-center bg-light text-red-500 font-medium">Error: {error || 'Company not found'}</div>;

    return (
        <div className="min-h-screen bg-light py-12 px-4 sm:px-6 lg:px-8 pt-32 font-sans text-body">
            <div className="max-w-5xl mx-auto">
                {/* Back Button */}
                <Link to="/jobs" className="inline-flex items-center text-body hover:text-primary mb-8 transition-colors group font-medium">
                    <i className="fas fa-arrow-left mr-2 group-hover:-translate-x-1 transition-transform"></i> Back to Jobs
                </Link>

                <div className="bg-white rounded-3xl shadow-card border border-gray-100 overflow-hidden">
                    {/* Header Banner */}
                    <div className="h-48 bg-gradient-to-r from-primary/10 to-blue-500/10 border-b border-gray-100 relative">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    </div>

                    <div className="px-8 pb-8">
                        {/* Avatar & Info */}
                        <div className="relative flex flex-col md:flex-row items-end -mt-16 mb-8 gap-6">
                            <div className="h-32 w-32 rounded-3xl bg-white p-2 shadow-card border border-gray-100">
                                <div className="h-full w-full rounded-2xl bg-primary flex items-center justify-center text-white text-4xl font-bold shadow-inner">
                                    {company.company ? company.company.charAt(0).toUpperCase() : company.name.charAt(0).toUpperCase()}
                                </div>
                            </div>
                            <div className="mb-2 flex-1">
                                <h1 className="text-3xl font-bold text-dark mb-1">{company.company || company.name}</h1>
                                {company.location && (
                                    <p className="text-secondary text-sm font-medium flex items-center gap-2">
                                        <i className="fas fa-map-marker-alt text-primary"></i> {company.location}
                                    </p>
                                )}
                            </div>
                            <div className="mb-2">
                                {company.linkedin && (
                                    <a href={company.linkedin} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-white text-blue-600 border border-gray-200 text-sm font-bold rounded-xl hover:bg-gray-50 transition-all shadow-sm hover:-translate-y-0.5 inline-flex items-center gap-2">
                                        <i className="fab fa-linkedin"></i> LinkedIn
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-2 space-y-8">
                                {/* About */}
                                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                                    <h3 className="text-xl font-bold text-dark mb-4">About</h3>
                                    <p className="text-body leading-relaxed whitespace-pre-line">
                                        {company.summary || "No description available."}
                                    </p>
                                </div>

                                {/* Jobs (Placeholder for now, could fetch jobs by employer) */}
                                {/* <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                                    <h3 className="text-xl font-bold text-dark mb-4">Open Positions</h3>
                                    <p className="text-gray-400 italic">Coming soon...</p>
                                </div> */}
                            </div>

                            <div className="md:col-span-1 space-y-8">
                                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                    <h3 className="text-xs font-bold text-secondary uppercase tracking-wider mb-4">Contact Info</h3>
                                    <div className="space-y-4 text-sm">
                                        <div className="flex items-center gap-3 text-body">
                                            <span className="w-6 text-center text-lg text-primary"><i className="fas fa-envelope"></i></span>
                                            <span className="truncate font-medium">{company.email}</span>
                                        </div>
                                        {company.phone && (
                                            <div className="flex items-center gap-3 text-body">
                                                <span className="w-6 text-center text-lg text-primary"><i className="fas fa-phone"></i></span>
                                                <span className="font-medium">{company.phone}</span>
                                            </div>
                                        )}
                                        {company.portfolio && (
                                            <div className="flex items-center gap-3 text-body">
                                                <span className="w-6 text-center text-lg text-primary"><i className="fas fa-globe"></i></span>
                                                <a href={company.portfolio} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline truncate">Website</a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

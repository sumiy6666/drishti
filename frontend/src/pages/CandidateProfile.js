import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function CandidateProfile() {
    const { id } = useParams();
    const [candidate, setCandidate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCandidate = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${process.env.REACT_APP_API || 'http://localhost:5000'}/api/candidates/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'ngrok-skip-browser-warning': 'true'
                    }
                });
                if (!res.ok) throw new Error('Candidate not found');
                const data = await res.json();
                setCandidate(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCandidate();
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-light"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
    if (error || !candidate) return <div className="min-h-screen flex items-center justify-center bg-light text-red-500 font-medium">Error: {error || 'Candidate not found'}</div>;

    return (
        <div className="min-h-screen bg-light py-12 px-4 sm:px-6 lg:px-8 pt-32 font-sans text-body">
            <div className="max-w-5xl mx-auto">
                {/* Back Button */}
                <Link to="/candidates" className="inline-flex items-center text-body hover:text-primary mb-8 transition-colors group font-medium">
                    <i className="fas fa-arrow-left mr-2 group-hover:-translate-x-1 transition-transform"></i> Back to Candidates
                </Link>

                <div className="bg-white rounded-3xl shadow-card border border-gray-100 overflow-hidden">
                    {/* Header Banner */}
                    <div className="h-48 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-b border-gray-100 relative">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    </div>

                    <div className="px-8 pb-8">
                        {/* Avatar & Info */}
                        <div className="relative flex flex-col md:flex-row items-end -mt-16 mb-8 gap-6">
                            <div className="h-32 w-32 rounded-3xl bg-white p-2 shadow-card border border-gray-100">
                                <div className="h-full w-full rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-inner">
                                    {candidate.name.charAt(0).toUpperCase()}
                                </div>
                            </div>
                            <div className="mb-2 flex-1">
                                <h1 className="text-3xl font-bold text-dark mb-1">{candidate.name}</h1>
                                <p className="text-lg text-primary font-medium mb-1">{candidate.title || 'Job Seeker'}</p>
                                {candidate.location && (
                                    <p className="text-secondary text-sm font-medium flex items-center gap-2">
                                        <i className="fas fa-map-marker-alt text-gray-400"></i> {candidate.location}
                                    </p>
                                )}
                            </div>
                            <div className="mb-2 flex gap-3">
                                {candidate.linkedin && (
                                    <a href={candidate.linkedin} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-white text-blue-600 border border-gray-200 text-sm font-bold rounded-xl hover:bg-gray-50 transition-all shadow-sm hover:-translate-y-0.5 inline-flex items-center gap-2">
                                        <i className="fab fa-linkedin"></i> LinkedIn
                                    </a>
                                )}
                                {candidate.resume && (
                                    <a href={candidate.resume} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-primary text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-primary/20 hover:-translate-y-0.5 inline-flex items-center gap-2">
                                        <i className="fas fa-file-alt"></i> Resume
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
                                        {candidate.summary || "No summary provided."}
                                    </p>
                                </div>

                                {/* Skills */}
                                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                                    <h3 className="text-xl font-bold text-dark mb-4">Skills</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {candidate.skills ? candidate.skills.split(',').map((skill, index) => (
                                            <span key={index} className="px-4 py-2 bg-light text-dark rounded-lg text-sm font-semibold border border-gray-200">
                                                {skill.trim()}
                                            </span>
                                        )) : <p className="text-gray-400 italic">No skills listed.</p>}
                                    </div>
                                </div>

                                {/* Experience */}
                                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                                    <h3 className="text-xl font-bold text-dark mb-4">Experience</h3>
                                    <p className="text-body leading-relaxed whitespace-pre-line">
                                        {candidate.experience || "No experience listed."}
                                    </p>
                                </div>

                                {/* Education */}
                                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                                    <h3 className="text-xl font-bold text-dark mb-4">Education</h3>
                                    <p className="text-body leading-relaxed whitespace-pre-line">
                                        {candidate.education || "No education listed."}
                                    </p>
                                </div>
                            </div>

                            <div className="md:col-span-1 space-y-8">
                                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                    <h3 className="text-xs font-bold text-secondary uppercase tracking-wider mb-4">Contact Info</h3>
                                    <div className="space-y-4 text-sm">
                                        <div className="flex items-center gap-3 text-body">
                                            <span className="w-6 text-center text-lg text-primary"><i className="fas fa-envelope"></i></span>
                                            <span className="truncate font-medium">{candidate.email}</span>
                                        </div>
                                        {candidate.phone && (
                                            <div className="flex items-center gap-3 text-body">
                                                <span className="w-6 text-center text-lg text-primary"><i className="fas fa-phone"></i></span>
                                                <span className="font-medium">{candidate.phone}</span>
                                            </div>
                                        )}
                                        {candidate.portfolio && (
                                            <div className="flex items-center gap-3 text-body">
                                                <span className="w-6 text-center text-lg text-primary"><i className="fas fa-globe"></i></span>
                                                <a href={candidate.portfolio} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline truncate">Portfolio</a>
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

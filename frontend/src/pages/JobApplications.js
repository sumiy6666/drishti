import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function JobApplications() {
    const { id } = useParams();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [jobTitle, setJobTitle] = useState('');

    // Modal State
    const [selectedApp, setSelectedApp] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const apiUrl = process.env.REACT_APP_API || 'http://localhost:5000';

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const token = localStorage.getItem('token');

                // Fetch Job Details for Title
                const jobRes = await fetch(`${apiUrl}/api/jobs/${id}`, {
                    headers: { 'ngrok-skip-browser-warning': 'true' }
                });
                if (jobRes.ok) {
                    const jobData = await jobRes.json();
                    setJobTitle(jobData.title);
                }

                // Fetch Applications (Light Payload)
                const res = await fetch(`${apiUrl}/api/jobs/${id}/applications`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'ngrok-skip-browser-warning': 'true'
                    }
                });

                if (!res.ok) throw new Error('Failed to fetch applications');
                const data = await res.json();
                setApplications(data);
            } catch (err) {
                console.error("Error fetching applications:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, [id, apiUrl]);

    const handleViewDetails = async (appId) => {
        setIsModalOpen(true);
        setDetailsLoading(true);
        setSelectedApp(null); // Clear previous

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${apiUrl}/api/jobs/application/${appId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'ngrok-skip-browser-warning': 'true'
                }
            });

            if (!res.ok) throw new Error('Failed to fetch details');
            const data = await res.json();
            setSelectedApp(data);
        } catch (err) {
            console.error(err);
            alert('Failed to load application details');
            setIsModalOpen(false);
        } finally {
            setDetailsLoading(false);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedApp(null);
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white">Loading...</div>;
    if (error) return <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-red-500">Error: {error}</div>;

    return (
        <div className="min-h-screen bg-[#0a0a0a] py-12 px-4 sm:px-6 lg:px-8 pt-24 text-white relative">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <Link to={`/jobs/${id}`} className="text-gray-400 hover:text-white mb-2 inline-block transition-colors">← Back to Job</Link>
                        <h1 className="text-3xl font-bold text-white">Applicants for {jobTitle}</h1>
                        <p className="text-gray-400 mt-1">{applications.length} applications received</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {applications.length === 0 ? (
                        <div className="col-span-full text-center py-12 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl">
                            <p className="text-gray-400">No applications yet.</p>
                        </div>
                    ) : (
                        applications.map(app => (
                            <div key={app._id}
                                onClick={() => handleViewDetails(app._id)}
                                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all cursor-pointer group">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                        {app.applicant?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{app.applicant?.name}</h3>
                                        <p className="text-sm text-gray-400">{app.applicant?.email}</p>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">{new Date(app.createdAt).toLocaleDateString()}</span>
                                    <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs border border-blue-500/20">
                                        View Details →
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={closeModal}>
                    <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative" onClick={e => e.stopPropagation()}>

                        {/* Close Button */}
                        <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-white p-2">
                            ✕
                        </button>

                        {detailsLoading ? (
                            <div className="p-12 text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                                <p className="text-gray-400">Loading applicant details...</p>
                            </div>
                        ) : selectedApp && (
                            <div className="p-8">
                                {/* Header */}
                                <div className="flex items-center gap-6 mb-8 border-b border-white/10 pb-8">
                                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                                        {selectedApp.applicant?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold text-white">{selectedApp.applicant?.name}</h2>
                                        <div className="flex flex-wrap gap-4 mt-2 text-gray-400">
                                            <span>� {selectedApp.applicant?.email}</span>
                                            {selectedApp.applicant?.phone && <span>📱 {selectedApp.applicant.phone}</span>}
                                            {selectedApp.applicant?.location && <span>📍 {selectedApp.applicant.location}</span>}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Left Column */}
                                    <div className="space-y-6">
                                        {/* Resume & Cover Letter */}
                                        <div className="bg-white/5 rounded-xl p-6 border border-white/5">
                                            <h3 className="text-lg font-bold text-white mb-4">Application Documents</h3>
                                            <div className="flex gap-3 mb-4">
                                                {selectedApp.resumeUrl && (
                                                    <a href={selectedApp.resumeUrl} target="_blank" rel="noopener noreferrer" className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-center text-sm font-bold transition-colors">
                                                        View Resume
                                                    </a>
                                                )}
                                                {selectedApp.applicant?.resume && selectedApp.applicant.resume !== selectedApp.resumeUrl && (
                                                    <a href={selectedApp.applicant.resume} target="_blank" rel="noopener noreferrer" className="flex-1 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-center text-sm font-bold transition-colors">
                                                        Profile Resume
                                                    </a>
                                                )}
                                            </div>
                                            {selectedApp.coverLetter && (
                                                <div>
                                                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Cover Letter</h4>
                                                    <p className="text-sm text-gray-300 whitespace-pre-line bg-black/20 p-3 rounded-lg">{selectedApp.coverLetter}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Skills */}
                                        {selectedApp.applicant?.skills && (
                                            <div className="bg-white/5 rounded-xl p-6 border border-white/5">
                                                <h3 className="text-lg font-bold text-white mb-4">Skills</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedApp.applicant.skills.split(',').map((s, i) => (
                                                        <span key={i} className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-sm">
                                                            {s.trim()}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Right Column */}
                                    <div className="space-y-6">
                                        {/* Experience */}
                                        {selectedApp.applicant?.experience && (
                                            <div className="bg-white/5 rounded-xl p-6 border border-white/5">
                                                <h3 className="text-lg font-bold text-white mb-4">Experience</h3>
                                                <p className="text-sm text-gray-300 whitespace-pre-line">{selectedApp.applicant.experience}</p>
                                            </div>
                                        )}

                                        {/* Education */}
                                        {selectedApp.applicant?.education && (
                                            <div className="bg-white/5 rounded-xl p-6 border border-white/5">
                                                <h3 className="text-lg font-bold text-white mb-4">Education</h3>
                                                <p className="text-sm text-gray-300 whitespace-pre-line">{selectedApp.applicant.education}</p>
                                            </div>
                                        )}

                                        {/* Social Links */}
                                        <div className="flex gap-4">
                                            {selectedApp.applicant?.linkedin && (
                                                <a href={selectedApp.applicant.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm">LinkedIn Profile ↗</a>
                                            )}
                                            {selectedApp.applicant?.portfolio && (
                                                <a href={selectedApp.applicant.portfolio} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 text-sm">Portfolio ↗</a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

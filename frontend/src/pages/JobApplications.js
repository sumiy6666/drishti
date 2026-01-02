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

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-light text-body">Loading...</div>;
    if (error) return <div className="min-h-screen flex items-center justify-center bg-light text-red-500">Error: {error}</div>;

    return (
        <div className="min-h-screen bg-light py-12 px-4 sm:px-6 lg:px-8 pt-32 text-body relative">
            {/* Background Shapes */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <Link to={`/jobs/${id}`} className="text-secondary hover:text-primary mb-2 inline-block transition-colors font-bold text-sm">← Back to Job</Link>
                        <h1 className="text-3xl font-bold text-dark">Applicants for {jobTitle}</h1>
                        <p className="text-secondary mt-1 font-medium">{applications.length} applications received</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {applications.length === 0 ? (
                        <div className="col-span-full text-center py-16 bg-white border border-gray-100 rounded-3xl shadow-sm">
                            <div className="text-6xl mb-4 opacity-50">👥</div>
                            <h3 className="text-lg font-bold text-dark mb-2">No Applications Yet</h3>
                            <p className="text-body">Waiting for candidates to apply.</p>
                        </div>
                    ) : (
                        applications.map(app => (
                            <div key={app._id}
                                onClick={() => handleViewDetails(app._id)}
                                className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-card-hover transition-all cursor-pointer group relative">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                                        {app.applicant?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-dark group-hover:text-primary transition-colors">{app.applicant?.name}</h3>
                                        <p className="text-sm text-secondary font-medium">{app.applicant?.email}</p>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-secondary font-medium">{new Date(app.createdAt).toLocaleDateString()}</span>
                                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold group-hover:bg-primary group-hover:text-white transition-all">
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={closeModal}>
                    <div className="bg-white border border-gray-100 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-scale-in" onClick={e => e.stopPropagation()}>

                        {/* Close Button */}
                        <button onClick={closeModal} className="absolute top-6 right-6 text-gray-400 hover:text-dark p-2 transition-colors">
                            <i className="fas fa-times text-xl"></i>
                        </button>

                        {detailsLoading ? (
                            <div className="p-12 text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                                <p className="text-secondary font-medium">Loading applicant details...</p>
                            </div>
                        ) : selectedApp && (
                            <div className="p-8 md:p-10">
                                {/* Header */}
                                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8 border-b border-gray-100 pb-8">
                                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-3xl">
                                        {selectedApp.applicant?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold text-dark">{selectedApp.applicant?.name}</h2>
                                        <div className="flex flex-wrap gap-4 mt-2 text-secondary font-medium text-sm">
                                            <span className="flex items-center gap-1"><i className="fas fa-envelope text-primary"></i> {selectedApp.applicant?.email}</span>
                                            {selectedApp.applicant?.phone && <span className="flex items-center gap-1"><i className="fas fa-phone text-primary"></i> {selectedApp.applicant.phone}</span>}
                                            {selectedApp.applicant?.location && <span className="flex items-center gap-1"><i className="fas fa-map-marker-alt text-primary"></i> {selectedApp.applicant.location}</span>}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Left Column */}
                                    <div className="space-y-6">
                                        {/* Resume & Cover Letter */}
                                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                            <h3 className="text-lg font-bold text-dark mb-4">Application Documents</h3>
                                            <div className="flex flex-col gap-3 mb-4">
                                                {selectedApp.resumeUrl && (
                                                    <a href={selectedApp.resumeUrl} target="_blank" rel="noopener noreferrer" className="w-full py-3 bg-primary text-white rounded-xl text-center text-sm font-bold hover:bg-blue-700 transition-all shadow-button hover:-translate-y-0.5 flex items-center justify-center gap-2">
                                                        <i className="fas fa-file-download"></i> Download Resume
                                                    </a>
                                                )}
                                                {selectedApp.applicant?.resume && selectedApp.applicant.resume !== selectedApp.resumeUrl && (
                                                    <a href={selectedApp.applicant.resume} target="_blank" rel="noopener noreferrer" className="w-full py-3 bg-white border border-gray-200 text-dark rounded-xl text-center text-sm font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                                                        <i className="fas fa-user-circle"></i> View Profile Resume
                                                    </a>
                                                )}
                                            </div>
                                            {selectedApp.coverLetter && (
                                                <div>
                                                    <h4 className="text-sm font-bold text-secondary mb-2">Cover Letter</h4>
                                                    <p className="text-sm text-body whitespace-pre-line bg-white p-4 rounded-xl border border-gray-100">{selectedApp.coverLetter}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Skills */}
                                        {selectedApp.applicant?.skills && (
                                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                                <h3 className="text-lg font-bold text-dark mb-4">Skills</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedApp.applicant.skills.split(',').map((s, i) => (
                                                        <span key={i} className="px-3 py-1 bg-white text-primary border border-gray-200 rounded-full text-sm font-bold shadow-sm">
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
                                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                                <h3 className="text-lg font-bold text-dark mb-4">Experience</h3>
                                                <p className="text-sm text-body whitespace-pre-line">{selectedApp.applicant.experience}</p>
                                            </div>
                                        )}

                                        {/* Education */}
                                        {selectedApp.applicant?.education && (
                                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                                <h3 className="text-lg font-bold text-dark mb-4">Education</h3>
                                                <p className="text-sm text-body whitespace-pre-line">{selectedApp.applicant.education}</p>
                                            </div>
                                        )}

                                        {/* Social Links */}
                                        <div className="flex gap-4">
                                            {selectedApp.applicant?.linkedin && (
                                                <a href={selectedApp.applicant.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 text-sm font-bold flex items-center gap-1">
                                                    <i className="fab fa-linkedin"></i> LinkedIn
                                                </a>
                                            )}
                                            {selectedApp.applicant?.portfolio && (
                                                <a href={selectedApp.applicant.portfolio} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700 text-sm font-bold flex items-center gap-1">
                                                    <i className="fas fa-globe"></i> Portfolio
                                                </a>
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

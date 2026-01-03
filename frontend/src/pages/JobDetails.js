import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

export default function JobDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [applying, setApplying] = useState(false);
    const [coverLetter, setCoverLetter] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [applicationStatus, setApplicationStatus] = useState(null); // 'success', 'error', null

    // Resume Selection State
    const [resumeOption, setResumeOption] = useState('profile'); // 'profile' | 'upload' | 'url'
    const [uploading, setUploading] = useState(false);

    // Save Job State
    const [isSaved, setIsSaved] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);

    const [user, setUser] = useState(null);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const parsedUser = JSON.parse(userStr);
            setUser(parsedUser);
            if (parsedUser.resume) {
                setResumeUrl(parsedUser.resume);
            }
            if (parsedUser.savedJobs && parsedUser.savedJobs.includes(id)) {
                setIsSaved(true);
            }
        }
    }, [id]);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await fetch((process.env.REACT_APP_API || 'http://localhost:5000') + '/api/jobs/' + id, {
                    headers: { 'ngrok-skip-browser-warning': 'true' }
                });
                if (!res.ok) throw new Error('Job not found');
                const data = await res.json();
                setJob(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    const handleSaveJob = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        setSaveLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.REACT_APP_API || 'http://localhost:5000'}/api/jobs/${id}/save`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!res.ok) throw new Error('Failed to save job');

            const updatedSavedJobs = await res.json();

            // Update local state
            setIsSaved(!isSaved);

            // Update local storage user
            const updatedUser = { ...user, savedJobs: updatedSavedJobs };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));

        } catch (err) {
            console.error(err);
            alert('Failed to save job');
        } finally {
            setSaveLoading(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const uploadData = new FormData();
            uploadData.append('file', file);
            const token = localStorage.getItem('token');

            const uploadRes = await fetch(`${process.env.REACT_APP_API || 'http://localhost:5000'}/api/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: uploadData
            });

            if (!uploadRes.ok) throw new Error('Upload failed');
            const { url } = await uploadRes.json();
            setResumeUrl(url);
        } catch (error) {
            console.error(error);
            alert('Failed to upload resume');
        } finally {
            setUploading(false);
        }
    };

    const handleApply = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }

        if (!resumeUrl) {
            alert('Please provide a resume');
            return;
        }

        setApplying(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch((process.env.REACT_APP_API || 'http://localhost:5000') + `/api/jobs/${id}/apply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ coverLetter, resumeUrl })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to apply');

            setApplicationStatus('success');
            setCoverLetter('');
            // Keep resumeUrl in case they want to apply to others
        } catch (err) {
            setApplicationStatus('error');
            alert(err.message);
        } finally {
            setApplying(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-light"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
    if (error || !job) return <div className="min-h-screen flex items-center justify-center bg-light text-red-500 font-medium">Error: {error || 'Job not found'}</div>;

    return (
        <div className="min-h-screen bg-light py-12 px-4 sm:px-6 lg:px-8 pt-32 font-sans text-body">
            <div className="max-w-5xl mx-auto">

                {/* Back Button */}
                <Link to="/jobs" className="inline-flex items-center text-body hover:text-primary mb-8 transition-colors group font-medium">
                    <i className="fas fa-arrow-left mr-2 group-hover:-translate-x-1 transition-transform"></i> Back to Jobs
                </Link>

                {/* Header Card */}
                <div className="bg-white rounded-2xl p-8 md:p-10 mb-8 shadow-sm border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none" />

                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 relative z-10">
                        <div className="flex-1">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-16 h-16 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-3xl font-bold text-primary shadow-sm">
                                    {job.company ? job.company.charAt(0).toUpperCase() : 'C'}
                                </div>
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-bold text-dark tracking-tight mb-1">{job.title}</h1>
                                    <div className="flex items-center gap-2 text-body">
                                        <span className="font-semibold text-primary">{job.company}</span>
                                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                        <span>{job.postedAt || 'Recently Posted'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3 mt-6">
                                <span className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-dark border border-gray-200 rounded-full text-sm font-medium">
                                    <i className="fas fa-map-marker-alt text-primary"></i> {job.location}
                                </span>
                                <span className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-dark border border-gray-200 rounded-full text-sm font-medium">
                                    <i className="fas fa-money-bill-wave text-green-600"></i> {job.salaryText || (job.salaryMin ? `${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}` : 'Competitive')}
                                </span>
                                <span className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-dark border border-gray-200 rounded-full text-sm font-medium">
                                    <i className="fas fa-briefcase text-blue-600"></i> {job.remote ? 'Remote' : 'On-site'}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 min-w-[200px]">
                            {user?.role === 'jobseeker' && !applicationStatus && (
                                <a href="#apply-section" className="px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-primary/20 transform hover:-translate-y-1 text-center">
                                    Apply Now
                                </a>
                            )}
                            {user?.role === 'employer' && user._id === job.employer?._id && (
                                <Link to={`/jobs/${id}/applications`} className="px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-primary/20 transition-all transform hover:-translate-y-1 text-center">
                                    View Applicants
                                </Link>
                            )}
                            {user?.role === 'jobseeker' && (
                                <button
                                    onClick={handleSaveJob}
                                    disabled={saveLoading}
                                    className={`px-8 py-4 border font-bold rounded-xl transition-all text-center flex items-center justify-center gap-2 ${isSaved
                                        ? 'bg-primary/10 border-primary text-primary hover:bg-primary/20'
                                        : 'bg-white border-gray-200 text-dark hover:bg-gray-50'
                                        }`}
                                >
                                    <i className={`${isSaved ? 'fas' : 'far'} fa-bookmark`}></i>
                                    {isSaved ? 'Saved' : 'Save Job'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-8">

                        {/* Description */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-dark mb-6 flex items-center gap-2">
                                <i className="fas fa-file-alt text-primary opacity-20"></i> Job Description
                            </h2>
                            <div className="prose prose-lg max-w-none text-body leading-relaxed whitespace-pre-line">
                                {job.description}
                            </div>
                        </div>

                        {/* Skills */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-dark mb-6 flex items-center gap-2">
                                <i className="fas fa-star text-primary opacity-20"></i> Required Skills
                            </h2>
                            <div className="flex flex-wrap gap-3">
                                {job.skills && job.skills.map((skill, index) => (
                                    <span key={index} className="px-4 py-2 bg-light text-dark rounded-lg text-sm font-semibold border border-gray-200 hover:border-primary/30 transition-colors">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Custom Fields */}
                        {job.customFields && job.customFields.length > 0 && (
                            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                                <h2 className="text-xl font-bold text-dark mb-6">Additional Details</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {job.customFields.map((field, index) => (
                                        <div key={index} className="bg-light p-5 rounded-xl border border-gray-200">
                                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{field.label}</h3>
                                            <p className="text-dark font-semibold text-lg">{field.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">

                        {/* Company Info */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-dark mb-6">About the Company</h3>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-primary/20">
                                    {job.company ? job.company.charAt(0).toUpperCase() : 'C'}
                                </div>
                                <div>
                                    <h4 className="font-bold text-dark text-lg">{job.company}</h4>
                                    {job.employer && (
                                        <Link to={`/company/${job.employer._id}`} className="text-sm text-primary hover:underline">View Profile</Link>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-4 text-sm text-body">
                                <div className="flex justify-between">
                                    <span>Industry</span>
                                    <span className="font-medium text-dark">Technology</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Company Size</span>
                                    <span className="font-medium text-dark">50-100</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Founded</span>
                                    <span className="font-medium text-dark">2015</span>
                                </div>
                            </div>
                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <button className="w-full py-3 bg-light text-dark font-bold rounded-xl hover:bg-gray-200 transition-colors">
                                    Visit Website
                                </button>
                            </div>
                        </div>

                        {/* Application Form */}
                        {user?.role === 'jobseeker' && (
                            <div id="apply-section" className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                                <h3 className="text-lg font-bold text-dark mb-6">Apply for this Job</h3>

                                {applicationStatus === 'success' ? (
                                    <div className="bg-green-50 border border-green-100 text-secondary p-8 rounded-xl text-center">
                                        <div className="text-5xl mb-4">🎉</div>
                                        <p className="font-bold text-xl mb-2">Application Sent!</p>
                                        <p className="text-sm opacity-80">Good luck! You can track this in "My Applications".</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleApply} className="space-y-5">

                                        {/* Resume Selection */}
                                        <div>
                                            <label className="block text-sm font-bold text-dark mb-3">Resume</label>
                                            <div className="flex flex-col gap-3">
                                                {user.resume && (
                                                    <label className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all ${resumeOption === 'profile' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:bg-gray-50'}`}>
                                                        <input
                                                            type="radio"
                                                            name="resumeOption"
                                                            value="profile"
                                                            checked={resumeOption === 'profile'}
                                                            onChange={() => {
                                                                setResumeOption('profile');
                                                                setResumeUrl(user.resume);
                                                            }}
                                                            className="text-primary focus:ring-primary"
                                                        />
                                                        <span className="ml-3 font-medium text-dark">Use Profile Resume</span>
                                                        <a href={user.resume} target="_blank" rel="noopener noreferrer" className="ml-auto text-xs text-primary hover:underline" onClick={e => e.stopPropagation()}>View</a>
                                                    </label>
                                                )}

                                                <label className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all ${resumeOption === 'upload' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:bg-gray-50'}`}>
                                                    <input
                                                        type="radio"
                                                        name="resumeOption"
                                                        value="upload"
                                                        checked={resumeOption === 'upload'}
                                                        onChange={() => {
                                                            setResumeOption('upload');
                                                            setResumeUrl('');
                                                        }}
                                                        className="text-primary focus:ring-primary"
                                                    />
                                                    <span className="ml-3 font-medium text-dark">Upload New Resume</span>
                                                </label>

                                                {resumeOption === 'upload' && (
                                                    <div className="mt-2 animate-fade-in">
                                                        <input
                                                            type="file"
                                                            accept=".pdf,.doc,.docx"
                                                            onChange={handleFileUpload}
                                                            className="block w-full text-sm text-body file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                                        />
                                                        {uploading && <p className="text-xs text-primary mt-1">Uploading...</p>}
                                                        {resumeUrl && !uploading && <p className="text-xs text-green-600 mt-1">Resume uploaded!</p>}
                                                    </div>
                                                )}

                                                <label className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all ${resumeOption === 'url' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:bg-gray-50'}`}>
                                                    <input
                                                        type="radio"
                                                        name="resumeOption"
                                                        value="url"
                                                        checked={resumeOption === 'url'}
                                                        onChange={() => {
                                                            setResumeOption('url');
                                                            setResumeUrl('');
                                                        }}
                                                        className="text-primary focus:ring-primary"
                                                    />
                                                    <span className="ml-3 font-medium text-dark">Enter URL</span>
                                                </label>

                                                {resumeOption === 'url' && (
                                                    <input
                                                        type="url"
                                                        placeholder="https://..."
                                                        className="w-full px-4 py-3 bg-light border border-gray-200 rounded-xl text-dark placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all hover:bg-white mt-2 animate-fade-in"
                                                        value={resumeUrl}
                                                        onChange={e => setResumeUrl(e.target.value)}
                                                    />
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-dark mb-2">Cover Letter</label>
                                            <textarea
                                                rows="4"
                                                placeholder="Why are you a good fit?"
                                                className="w-full px-4 py-3 bg-light border border-gray-200 rounded-xl text-dark placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all hover:bg-white"
                                                value={coverLetter}
                                                onChange={e => setCoverLetter(e.target.value)}
                                            ></textarea>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={applying || (resumeOption === 'upload' && !resumeUrl)}
                                            className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 hover:-translate-y-0.5"
                                        >
                                            {applying ? 'Sending...' : 'Submit Application'}
                                        </button>
                                    </form>
                                )}
                            </div>
                        )}

                        {!user && (
                            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8 text-center">
                                <p className="text-primary font-bold mb-6 text-lg">Login to apply for this position</p>
                                <Link to="/login" className="inline-block px-8 py-3.5 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-bold shadow-lg shadow-primary/20 hover:-translate-y-0.5">
                                    Login Now
                                </Link>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}

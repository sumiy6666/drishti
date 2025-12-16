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

    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    useEffect(() => {
        if (user && user.resume) {
            setResumeUrl(user.resume);
        }
    }, []);

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

    const handleApply = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }

        setApplying(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch((process.env.REACT_APP_API || 'http://localhost:5000') + `/api/jobs/${id}/apply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify({ coverLetter, resumeUrl })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to apply');

            setApplicationStatus('success');
            setCoverLetter('');
            setResumeUrl('');
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
        <div className="min-h-screen bg-light py-12 px-4 sm:px-6 lg:px-8 pt-24 font-sans text-body">
            <div className="max-w-4xl mx-auto">

                {/* Back Button */}
                <Link to="/jobs" className="inline-flex items-center text-body hover:text-primary mb-8 transition-colors group font-medium">
                    <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span> Back to Jobs
                </Link>

                {/* Header Card */}
                <div className="bg-white rounded-2xl p-10 mb-8 shadow-sm border border-gray-100">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
                        <div>
                            <h1 className="text-4xl font-bold text-dark mb-4 tracking-tight">{job.title}</h1>
                            <div className="flex items-center gap-3 text-xl text-body font-medium mb-8">
                                <span className="text-primary font-semibold">{job.company}</span>
                                <span className="text-gray-300">•</span>
                                <span>{job.location}</span>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <span className="px-5 py-2 bg-blue-50 text-primary border border-blue-100 rounded-full text-sm font-bold">
                                    {job.remote ? 'Remote' : 'On-site'}
                                </span>
                                <span className="px-5 py-2 bg-green-50 text-secondary border border-green-100 rounded-full text-sm font-bold">
                                    {job.salaryText || `${job.salaryMin?.toLocaleString()} - ${job.salaryMax?.toLocaleString()}`}
                                </span>
                                <span className="px-5 py-2 bg-purple-50 text-purple-600 border border-purple-100 rounded-full text-sm font-bold">
                                    Full-time
                                </span>
                            </div>
                        </div>

                        {user?.role === 'jobseeker' && !applicationStatus && (
                            <a href="#apply-section" className="px-10 py-5 bg-primary text-white font-bold rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-primary/20 transform hover:-translate-y-1 text-center min-w-[200px]">
                                Apply Now
                            </a>
                        )}
                        {user?.role === 'employer' && user._id === job.employer?._id && (
                            <Link to={`/jobs/${id}/applications`} className="px-10 py-5 bg-primary text-white font-bold rounded-lg hover:bg-blue-700 hover:shadow-lg hover:shadow-primary/20 transition-all transform hover:-translate-y-1 text-center min-w-[200px]">
                                View Applicants
                            </Link>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-8">

                        {/* Description */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-bold text-dark mb-6">Job Description</h2>
                            <div className="prose prose-lg max-w-none text-body leading-relaxed whitespace-pre-line">
                                {job.description}
                            </div>
                        </div>

                        {/* Skills */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-bold text-dark mb-6">Required Skills</h2>
                            <div className="flex flex-wrap gap-3">
                                {job.skills && job.skills.map((skill, index) => (
                                    <span key={index} className="px-5 py-2.5 bg-light text-dark rounded-lg text-sm font-semibold border border-gray-200 hover:border-primary/30 transition-colors">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Custom Fields */}
                        {job.customFields && job.customFields.length > 0 && (
                            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                                <h2 className="text-2xl font-bold text-dark mb-6">Additional Details</h2>
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
                            <h3 className="text-xl font-bold text-dark mb-6">About the Company</h3>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-primary/20">
                                    {job.company.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-dark text-lg">{job.company}</h4>
                                    <p className="text-sm text-body font-medium">Technology</p>
                                </div>
                            </div>
                            <p className="text-sm text-body leading-relaxed">
                                We are a forward-thinking company dedicated to innovation and excellence. Join our team to make a real impact.
                            </p>
                        </div>

                        {/* Application Form */}
                        {user?.role === 'jobseeker' && (
                            <div id="apply-section" className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                                <h3 className="text-xl font-bold text-dark mb-6">Apply for this Job</h3>

                                {applicationStatus === 'success' ? (
                                    <div className="bg-green-50 border border-green-100 text-secondary p-8 rounded-xl text-center">
                                        <div className="text-5xl mb-4">🎉</div>
                                        <p className="font-bold text-xl mb-2">Application Sent!</p>
                                        <p className="text-sm opacity-80">Good luck! You can track this in "My Applications".</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleApply} className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-bold text-dark mb-2">Resume URL</label>
                                            <input
                                                type="url"
                                                required
                                                placeholder="Link to your resume (Drive, LinkedIn...)"
                                                className="w-full px-5 py-3.5 bg-light border border-gray-200 rounded-xl text-dark placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all hover:bg-white"
                                                value={resumeUrl}
                                                onChange={e => setResumeUrl(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-dark mb-2">Cover Letter</label>
                                            <textarea
                                                rows="4"
                                                placeholder="Why are you a good fit?"
                                                className="w-full px-5 py-3.5 bg-light border border-gray-200 rounded-xl text-dark placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all hover:bg-white"
                                                value={coverLetter}
                                                onChange={e => setCoverLetter(e.target.value)}
                                            ></textarea>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={applying}
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

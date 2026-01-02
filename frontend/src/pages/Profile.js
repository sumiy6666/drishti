import React, { useState, useEffect } from 'react';
import { parseResume } from '../utils/resumeParser';

export default function Profile() {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        location: '',
        company: '',
        skills: '',
        experience: '',
        education: '',
        summary: '',
        linkedin: '',
        portfolio: '',
        resume: ''
    });
    const [isParsing, setIsParsing] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setUser(parsed);
            setFormData({
                name: parsed.name || '',
                email: parsed.email || '',
                phone: parsed.phone || '',
                location: parsed.location || '',
                company: parsed.company || '',
                skills: parsed.skills || '',
                experience: parsed.experience || '',
                education: parsed.education || '',
                summary: parsed.summary || '',
                linkedin: parsed.linkedin || '',
                portfolio: parsed.portfolio || '',
                resume: parsed.resume || ''
            });
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsParsing(true);
        try {
            // 1. Upload file to backend
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

            if (!uploadRes.ok) {
                const errorText = await uploadRes.text();
                console.error('Upload failed:', uploadRes.status, errorText);
                try {
                    const errorJson = JSON.parse(errorText);
                    throw new Error(`Server Error: ${errorJson.error || errorText}`);
                } catch (e) {
                    if (e.message.startsWith('Server Error:')) throw e;
                    throw new Error(`Server Error: ${errorText}`);
                }
            }
            const { url } = await uploadRes.json();

            // 2. Parse PDF client-side
            const parsedData = await parseResume(file);

            setFormData(prev => ({
                ...prev,
                resume: url, // Save resume URL
                email: parsedData.email || prev.email,
                phone: parsedData.phone || prev.phone,
                skills: parsedData.skills || prev.skills,
                experience: parsedData.experience || prev.experience,
                education: parsedData.education || prev.education,
                summary: parsedData.summary || prev.summary,
                linkedin: parsedData.links.find(l => l.includes('linkedin')) || prev.linkedin,
                portfolio: parsedData.links.find(l => !l.includes('linkedin')) || prev.portfolio
            }));
            alert('Resume uploaded and parsed successfully!');
        } catch (error) {
            console.error('Resume upload/parse error:', error);
            let errorMessage = 'Failed to upload/parse resume. Please try again.';

            if (error.message.startsWith('Server Error:')) {
                errorMessage = error.message;
            } else if (error.message === 'File upload failed') {
                errorMessage = 'Failed to upload resume file. Please check your network or try a smaller file.';
            } else if (error.name === 'MissingPDFException') {
                errorMessage = 'Failed to parse PDF. The file might be corrupted or password protected.';
            }
            alert(errorMessage);
        } finally {
            setIsParsing(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.REACT_APP_API || 'http://localhost:5000'}/api/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error('Failed to update profile');

            const data = await res.json();
            setUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));
            setIsEditing(false);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to update profile. Please try again.');
        }
    };

    if (!user) return <div className="min-h-screen flex items-center justify-center bg-light text-dark">Loading...</div>;

    return (
        <div className="min-h-screen bg-light py-12 px-4 sm:px-6 lg:px-8 pt-32 text-body relative overflow-hidden">
            {/* Background Shapes */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-5xl mx-auto relative z-10">
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
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                            </div>
                            <div className="mb-2 flex-1">
                                <h1 className="text-3xl font-bold text-dark mb-1">{user.name}</h1>
                                <p className="text-primary text-sm capitalize font-bold bg-primary/10 px-4 py-1.5 rounded-full inline-block">{user.role}</p>
                            </div>
                            <div className="mb-2">
                                {!isEditing && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-6 py-3 bg-white text-dark border border-gray-200 text-sm font-bold rounded-xl hover:bg-gray-50 transition-all shadow-sm hover:-translate-y-0.5"
                                    >
                                        Edit Profile
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Content */}
                        {isEditing ? (
                            <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in-up">
                                {/* Resume Upload Section */}
                                {user.role === 'jobseeker' && (
                                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
                                        <h3 className="text-primary font-bold mb-2 flex items-center gap-2"><i className="fas fa-rocket"></i> AI Resume Parser</h3>
                                        <p className="text-sm text-body mb-4">Upload your resume (PDF) to autofill your profile details instantly.</p>
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept=".pdf"
                                                onChange={handleFileUpload}
                                                className="block w-full text-sm text-body file:mr-4 file:py-2.5 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-primary file:text-white hover:file:bg-blue-700 cursor-pointer"
                                                disabled={isParsing}
                                            />
                                            {isParsing && (
                                                <div className="absolute top-0 right-0 flex items-center gap-2 text-primary text-sm font-medium">
                                                    <span className="animate-spin"><i className="fas fa-spinner"></i></span> Parsing...
                                                </div>
                                            )}
                                        </div>
                                        {formData.resume && (
                                            <div className="mt-4">
                                                <a href={formData.resume} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-2 font-bold">
                                                    <i className="fas fa-file-pdf"></i> View Uploaded Resume
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <h3 className="text-lg font-bold text-dark mb-4 border-b border-gray-100 pb-2">Personal Information</h3>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-dark mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-dark placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all hover:bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-dark mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            disabled
                                            className="w-full px-5 py-3.5 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-dark mb-2">Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="+1 (555) 000-0000"
                                            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-dark placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all hover:bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-dark mb-2">Location</label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            placeholder="City, Country"
                                            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-dark placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all hover:bg-white"
                                        />
                                    </div>

                                    {user.role === 'employer' && (
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-bold text-dark mb-2">Company Name</label>
                                            <input
                                                type="text"
                                                name="company"
                                                value={formData.company}
                                                onChange={handleChange}
                                                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-dark placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all hover:bg-white"
                                            />
                                        </div>
                                    )}

                                    {user.role === 'jobseeker' && (
                                        <>
                                            <div className="md:col-span-2 mt-6">
                                                <h3 className="text-lg font-bold text-dark mb-4 border-b border-gray-100 pb-2">Professional Details</h3>
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-bold text-dark mb-2">Professional Summary</label>
                                                <textarea
                                                    name="summary"
                                                    value={formData.summary}
                                                    onChange={handleChange}
                                                    rows="3"
                                                    placeholder="Brief summary of your career..."
                                                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-dark placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all hover:bg-white"
                                                />
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-bold text-dark mb-2">Skills</label>
                                                <input
                                                    type="text"
                                                    name="skills"
                                                    value={formData.skills}
                                                    onChange={handleChange}
                                                    placeholder="e.g. React, Node.js, Design"
                                                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-dark placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all hover:bg-white"
                                                />
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-bold text-dark mb-2">Work Experience</label>
                                                <textarea
                                                    name="experience"
                                                    value={formData.experience}
                                                    onChange={handleChange}
                                                    rows="5"
                                                    placeholder="Describe your work experience..."
                                                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-dark placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all hover:bg-white"
                                                />
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-bold text-dark mb-2">Education</label>
                                                <textarea
                                                    name="education"
                                                    value={formData.education}
                                                    onChange={handleChange}
                                                    rows="3"
                                                    placeholder="Degrees, Universities, Years..."
                                                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-dark placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all hover:bg-white"
                                                />
                                            </div>

                                            <div className="md:col-span-2 mt-6">
                                                <h3 className="text-lg font-bold text-dark mb-4 border-b border-gray-100 pb-2">Social Links</h3>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-dark mb-2">LinkedIn URL</label>
                                                <input
                                                    type="url"
                                                    name="linkedin"
                                                    value={formData.linkedin}
                                                    onChange={handleChange}
                                                    placeholder="https://linkedin.com/in/..."
                                                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-dark placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all hover:bg-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-dark mb-2">Portfolio / Website</label>
                                                <input
                                                    type="url"
                                                    name="portfolio"
                                                    value={formData.portfolio}
                                                    onChange={handleChange}
                                                    placeholder="https://..."
                                                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-dark placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all hover:bg-white"
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="px-6 py-3 text-body font-bold hover:text-dark transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-button hover:-translate-y-0.5"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="md:col-span-1 space-y-8">
                                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                        <h3 className="text-xs font-bold text-secondary uppercase tracking-wider mb-4">Contact Info</h3>
                                        <div className="space-y-4 text-sm">
                                            <div className="flex items-center gap-3 text-body">
                                                <span className="w-6 text-center text-lg text-primary"><i className="fas fa-envelope"></i></span>
                                                <span className="truncate font-medium">{user.email}</span>
                                            </div>
                                            {formData.phone && (
                                                <div className="flex items-center gap-3 text-body">
                                                    <span className="w-6 text-center text-lg text-primary"><i className="fas fa-phone"></i></span>
                                                    <span className="font-medium">{formData.phone}</span>
                                                </div>
                                            )}
                                            {formData.location && (
                                                <div className="flex items-center gap-3 text-body">
                                                    <span className="w-6 text-center text-lg text-primary"><i className="fas fa-map-marker-alt"></i></span>
                                                    <span className="font-medium">{formData.location}</span>
                                                </div>
                                            )}
                                            {user.company && (
                                                <div className="flex items-center gap-3 text-body">
                                                    <span className="w-6 text-center text-lg text-primary"><i className="fas fa-building"></i></span>
                                                    <span className="font-medium">{user.company}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {user.role === 'jobseeker' && (formData.linkedin || formData.portfolio) && (
                                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                            <h3 className="text-xs font-bold text-secondary uppercase tracking-wider mb-4">Links</h3>
                                            <div className="space-y-3 text-sm">
                                                {formData.linkedin && (
                                                    <a href={formData.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline truncate font-bold">
                                                        <i className="fab fa-linkedin"></i> LinkedIn Profile
                                                    </a>
                                                )}
                                                {formData.portfolio && (
                                                    <a href={formData.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline truncate font-bold">
                                                        <i className="fas fa-globe"></i> Portfolio / Website
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="md:col-span-2 space-y-8">
                                    {user.role === 'jobseeker' && (
                                        <>
                                            {formData.summary && (
                                                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                                                    <h3 className="text-xl font-bold text-dark mb-4">About</h3>
                                                    <p className="text-body leading-relaxed">{formData.summary}</p>
                                                </div>
                                            )}

                                            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                                                <h3 className="text-xl font-bold text-dark mb-6">Skills</h3>
                                                <div className="flex flex-wrap gap-3">
                                                    {formData.skills ? (
                                                        formData.skills.split(',').map((skill, i) => (
                                                            <span key={i} className="px-4 py-2 bg-light text-secondary rounded-xl text-sm font-bold border border-gray-200 hover:border-primary hover:text-primary transition-colors cursor-default">
                                                                {skill.trim()}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-gray-400 text-sm italic">No skills added yet</span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                                                <h3 className="text-xl font-bold text-dark mb-6">Experience</h3>
                                                <div className="text-body whitespace-pre-line leading-relaxed">
                                                    {formData.experience || <span className="text-gray-400 italic">No experience added yet</span>}
                                                </div>
                                            </div>

                                            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                                                <h3 className="text-xl font-bold text-dark mb-6">Education</h3>
                                                <div className="text-body whitespace-pre-line leading-relaxed">
                                                    {formData.education || <span className="text-gray-400 italic">No education added yet</span>}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

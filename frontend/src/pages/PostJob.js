import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateJobDescription } from '../utils/jobTemplates';

export default function PostJob() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [company, setCompany] = useState('');
    const [location, setLocation] = useState('');
    const [salaryMin, setSalaryMin] = useState('');
    const [salaryMax, setSalaryMax] = useState('');
    const [skills, setSkills] = useState('');
    const [customFields, setCustomFields] = useState([]);

    const token = localStorage.getItem('token');

    const addField = () => {
        setCustomFields([...customFields, { label: '', value: '' }]);
    };

    const removeField = (index) => {
        const newFields = [...customFields];
        newFields.splice(index, 1);
        setCustomFields(newFields);
    };

    const handleFieldChange = (index, key, value) => {
        const newFields = [...customFields];
        newFields[index][key] = value;
        setCustomFields(newFields);
    };

    const handleSmartSuggest = () => {
        if (!title) return alert('Please enter a Job Title first.');
        const suggestion = generateJobDescription(title, skills, company);
        setDesc(suggestion);
    };

    const post = async e => {
        e.preventDefault();
        if (!token) return alert('Please login as an employer first');

        try {
            const res = await fetch((process.env.REACT_APP_API || 'http://localhost:5000') + '/api/jobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token, 'ngrok-skip-browser-warning': 'true' },
                body: JSON.stringify({
                    title,
                    description: desc,
                    company,
                    location,
                    salaryMin: parseInt(salaryMin || 0),
                    salaryMax: parseInt(salaryMax || 0),
                    salaryText: (salaryMin && salaryMax) ? `${salaryMin}-${salaryMax}` : 'Negotiable',
                    skills: skills.split(',').map(s => s.trim()).filter(s => s),
                    customFields,
                    remote: false
                })
            });

            if (res.ok) {
                alert('Job Posted Successfully!');
                navigate('/employer');
            } else {
                const d = await res.json();
                alert(d.error || 'Error posting job');
            }
        } catch (error) {
            console.error("Post error:", error);
            alert('Failed to post job');
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] py-12 px-4 sm:px-6 lg:px-8 pt-24 text-white relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-3xl mx-auto relative z-10">
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
                    <div className="bg-black/20 px-8 py-6 border-b border-white/10">
                        <h1 className="text-2xl font-bold text-white">Post a New Job</h1>
                        <p className="text-gray-400 mt-1">Create a new opportunity for talent.</p>
                    </div>

                    <form onSubmit={post} className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-400 mb-2">Job Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    placeholder="e.g. Senior React Developer"
                                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Company Name</label>
                                <input
                                    type="text"
                                    value={company}
                                    onChange={e => setCompany(e.target.value)}
                                    placeholder="e.g. Tech Corp"
                                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Location</label>
                                <input
                                    type="text"
                                    value={location}
                                    onChange={e => setLocation(e.target.value)}
                                    placeholder="e.g. New York, NY"
                                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Min Salary</label>
                                <input
                                    type="number"
                                    value={salaryMin}
                                    onChange={e => setSalaryMin(e.target.value)}
                                    placeholder="Min"
                                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Max Salary</label>
                                <input
                                    type="number"
                                    value={salaryMax}
                                    onChange={e => setSalaryMax(e.target.value)}
                                    placeholder="Max"
                                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-400 mb-2">Required Skills (comma separated)</label>
                                <input
                                    type="text"
                                    value={skills}
                                    onChange={e => setSkills(e.target.value)}
                                    placeholder="React, Node.js, MongoDB"
                                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-medium text-gray-400">Description</label>
                                    <button
                                        type="button"
                                        onClick={handleSmartSuggest}
                                        className="text-xs flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white font-bold hover:shadow-lg hover:shadow-blue-500/25 transition-all"
                                    >
                                        ✨ Smart Suggest
                                    </button>
                                </div>
                                <textarea
                                    rows={6}
                                    value={desc}
                                    onChange={e => setDesc(e.target.value)}
                                    placeholder="Job details, requirements, benefits..."
                                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Custom Fields Section */}
                        <div className="pt-6 border-t border-white/10">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-white">Additional Details</h3>
                                <button
                                    type="button"
                                    onClick={addField}
                                    className="px-4 py-2 bg-white/5 text-blue-400 text-sm font-bold rounded-xl hover:bg-white/10 transition-colors border border-white/5"
                                >
                                    + Add Field
                                </button>
                            </div>

                            <div className="space-y-3">
                                {customFields.map((field, index) => (
                                    <div key={index} className="flex gap-3 items-start animate-fade-in">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={field.label}
                                                onChange={e => handleFieldChange(index, 'label', e.target.value)}
                                                placeholder="Label (e.g. Department)"
                                                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={field.value}
                                                onChange={e => handleFieldChange(index, 'value', e.target.value)}
                                                placeholder="Value (e.g. Engineering)"
                                                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeField(index)}
                                            className="p-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors border border-transparent hover:border-red-500/20"
                                            title="Remove field"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                                {customFields.length === 0 && (
                                    <p className="text-sm text-gray-500 italic">No additional details added.</p>
                                )}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-white/10 flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => navigate('/employer')}
                                className="px-6 py-3 text-gray-400 font-medium hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all transform hover:-translate-y-0.5"
                            >
                                Post Job
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

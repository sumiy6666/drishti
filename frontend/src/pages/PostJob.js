import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateJobDescription } from '../utils/jobTemplates';
import { showAlert } from '../utils/swal';

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
        if (!title) return showAlert('Missing Title', 'Please enter a Job Title first.', 'warning');
        const suggestion = generateJobDescription(title, skills, company);
        setDesc(suggestion);
    };

    const post = async e => {
        e.preventDefault();
        if (!token) return showAlert('Authentication Required', 'Please login as an employer first', 'warning');

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
                showAlert('Success', 'Job Posted Successfully!', 'success');
                navigate('/employer');
            } else {
                const d = await res.json();
                showAlert('Error', d.error || 'Error posting job', 'error');
            }
        } catch (error) {
            console.error("Post error:", error);
            showAlert('Error', 'Failed to post job', 'error');
        }
    };

    return (
        <div className="min-h-screen bg-light py-12 px-4 sm:px-6 lg:px-8 pt-32 text-body relative overflow-hidden">
            {/* Background Shapes */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="bg-white rounded-3xl shadow-card border border-gray-100 overflow-hidden">
                    <div className="bg-gray-50 px-8 py-6 border-b border-gray-100">
                        <h1 className="text-2xl font-bold text-dark">Post a New Job</h1>
                        <p className="text-secondary mt-1 font-medium">Create a new opportunity for talent.</p>
                    </div>

                    <form onSubmit={post} className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-dark mb-2">Job Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    placeholder="e.g. Senior React Developer"
                                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-dark placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all hover:bg-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-dark mb-2">Company Name</label>
                                <input
                                    type="text"
                                    value={company}
                                    onChange={e => setCompany(e.target.value)}
                                    placeholder="e.g. Tech Corp"
                                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-dark placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all hover:bg-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-dark mb-2">Location</label>
                                <input
                                    type="text"
                                    value={location}
                                    onChange={e => setLocation(e.target.value)}
                                    placeholder="e.g. New York, NY"
                                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-dark placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all hover:bg-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-dark mb-2">Min Salary</label>
                                <input
                                    type="number"
                                    value={salaryMin}
                                    onChange={e => setSalaryMin(e.target.value)}
                                    placeholder="Min"
                                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-dark placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all hover:bg-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-dark mb-2">Max Salary</label>
                                <input
                                    type="number"
                                    value={salaryMax}
                                    onChange={e => setSalaryMax(e.target.value)}
                                    placeholder="Max"
                                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-dark placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all hover:bg-white"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-dark mb-2">Required Skills (comma separated)</label>
                                <input
                                    type="text"
                                    value={skills}
                                    onChange={e => setSkills(e.target.value)}
                                    placeholder="React, Node.js, MongoDB"
                                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-dark placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all hover:bg-white"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-bold text-dark">Description</label>
                                    <button
                                        type="button"
                                        onClick={handleSmartSuggest}
                                        className="text-xs flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-full font-bold hover:bg-primary/20 transition-all"
                                    >
                                        <i className="fas fa-magic"></i> Smart Suggest
                                    </button>
                                </div>
                                <textarea
                                    rows={6}
                                    value={desc}
                                    onChange={e => setDesc(e.target.value)}
                                    placeholder="Job details, requirements, benefits..."
                                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-dark placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all hover:bg-white"
                                    required
                                />
                            </div>
                        </div>

                        {/* Custom Fields Section */}
                        <div className="pt-6 border-t border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-dark">Additional Details</h3>
                                <button
                                    type="button"
                                    onClick={addField}
                                    className="px-4 py-2 bg-gray-50 text-primary text-sm font-bold rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
                                >
                                    + Add Field
                                </button>
                            </div>

                            <div className="space-y-3">
                                {customFields.map((field, index) => (
                                    <div key={index} className="flex gap-3 items-start animate-fade-in-up">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={field.label}
                                                onChange={e => handleFieldChange(index, 'label', e.target.value)}
                                                placeholder="Label (e.g. Department)"
                                                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-dark placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all hover:bg-white text-sm"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={field.value}
                                                onChange={e => handleFieldChange(index, 'value', e.target.value)}
                                                placeholder="Value (e.g. Engineering)"
                                                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-dark placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all hover:bg-white text-sm"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeField(index)}
                                            className="p-3.5 text-red-400 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-100"
                                            title="Remove field"
                                        >
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </div>
                                ))}
                                {customFields.length === 0 && (
                                    <p className="text-sm text-gray-400 italic">No additional details added.</p>
                                )}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-100 flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => navigate('/employer')}
                                className="px-6 py-3 text-body font-bold hover:text-dark transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-button hover:-translate-y-0.5"
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

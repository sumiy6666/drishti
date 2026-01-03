import React, { useState, useEffect } from 'react';
import CandidateCard from '../components/CandidateCard';

export default function FindCandidates() {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [q, setQ] = useState('');
    const [location, setLocation] = useState('');
    const [skills, setSkills] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchCandidates = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const query = new URLSearchParams({ q, location, skills, page }).toString();
            const res = await fetch(`${process.env.REACT_APP_API || 'http://localhost:5000'}/api/candidates?${query}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'ngrok-skip-browser-warning': 'true'
                }
            });
            const data = await res.json();
            if (data.data) {
                setCandidates(data.data);
                setTotalPages(data.totalPages);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCandidates();
    }, [page]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchCandidates();
    };

    return (
        <div className="min-h-screen bg-light py-12 px-4 sm:px-6 lg:px-8 pt-32 font-sans text-body">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-dark mb-4 tracking-tight">Find Top Talent</h1>
                    <p className="text-xl text-secondary max-w-2xl mx-auto">Discover skilled professionals for your open positions.</p>
                </div>

                {/* Search Bar */}
                <div className="bg-white p-4 rounded-2xl shadow-card border border-gray-100 mb-12 max-w-4xl mx-auto">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                            <input
                                type="text"
                                placeholder="Search by name or keywords..."
                                className="w-full pl-12 pr-4 py-3 bg-light border-none rounded-xl focus:ring-2 focus:ring-primary text-dark placeholder-gray-400 font-medium"
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                            />
                        </div>
                        <div className="flex-1 relative">
                            <i className="fas fa-map-marker-alt absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                            <input
                                type="text"
                                placeholder="Location"
                                className="w-full pl-12 pr-4 py-3 bg-light border-none rounded-xl focus:ring-2 focus:ring-primary text-dark placeholder-gray-400 font-medium"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>
                        <div className="flex-1 relative">
                            <i className="fas fa-code absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                            <input
                                type="text"
                                placeholder="Skills (e.g. React, Node)"
                                className="w-full pl-12 pr-4 py-3 bg-light border-none rounded-xl focus:ring-2 focus:ring-primary text-dark placeholder-gray-400 font-medium"
                                value={skills}
                                onChange={(e) => setSkills(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-primary/20">
                            Search
                        </button>
                    </form>
                </div>

                {/* Results */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                            {candidates.length > 0 ? (
                                candidates.map(candidate => (
                                    <CandidateCard key={candidate._id} candidate={candidate} />
                                ))
                            ) : (
                                <div className="col-span-full text-center py-12 text-gray-400">
                                    <i className="fas fa-users text-4xl mb-4 opacity-50"></i>
                                    <p className="text-lg font-medium">No candidates found matching your criteria.</p>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center gap-2">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="px-4 py-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-50 font-medium text-dark"
                                >
                                    Previous
                                </button>
                                <span className="px-4 py-2 font-bold text-primary">Page {page} of {totalPages}</span>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="px-4 py-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-50 font-medium text-dark"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

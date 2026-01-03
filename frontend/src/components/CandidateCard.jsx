import React from 'react';
import { Link } from 'react-router-dom';

const CandidateCard = ({ candidate }) => {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-card hover:shadow-lg transition-all border border-gray-100 flex flex-col h-full group">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-md">
                        {candidate.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-dark group-hover:text-primary transition-colors">{candidate.name}</h3>
                        <p className="text-sm text-secondary font-medium">{candidate.experience || 'Open to work'}</p>
                    </div>
                </div>
            </div>

            <div className="mb-4 flex-grow">
                {/* Summary removed to keep card compact */}
                <div className="flex flex-wrap gap-2">
                    {candidate.skills && candidate.skills.split(',').slice(0, 3).map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-light text-secondary text-xs font-semibold rounded-full border border-gray-200">
                            {skill.trim()}
                        </span>
                    ))}
                    {candidate.skills && candidate.skills.split(',').length > 3 && (
                        <span className="px-3 py-1 bg-light text-secondary text-xs font-semibold rounded-full border border-gray-200">
                            +{candidate.skills.split(',').length - 3}
                        </span>
                    )}
                </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                <div className="text-xs text-gray-400 font-medium flex items-center gap-1">
                    <i className="fas fa-map-marker-alt"></i> {candidate.location || 'Remote'}
                </div>
                <Link to={`/candidate/${candidate._id}`} className="text-sm font-bold text-primary hover:underline">
                    View Profile
                </Link>
            </div>
        </div>
    );
};

export default CandidateCard;

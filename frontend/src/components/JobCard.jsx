import React from 'react';
import { Link } from 'react-router-dom';

export default function JobCard({ job }) {
    return (
        <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-card-hover transition-all duration-300 group hover:-translate-y-1">
            <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-lg bg-gray-50 flex items-center justify-center text-2xl border border-gray-100 group-hover:border-primary/20 transition-colors">
                    {job.logo || '🏢'}
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-dark text-lg mb-1 group-hover:text-primary transition-colors">
                        <Link to={`/jobs/${job.id}`}>{job.title}</Link>
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-body mb-3">
                        <span className="font-medium">{job.company}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span>{job.location}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-3 py-1 rounded-full bg-blue-50 text-primary text-xs font-semibold">
                            {job.type}
                        </span>
                        {job.salary && (
                            <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-semibold">
                                {job.salary}
                            </span>
                        )}
                    </div>
                </div>

                <Link to={`/jobs/${job.id}`} className="w-10 h-10 rounded-full bg-light flex items-center justify-center text-body hover:bg-primary hover:text-white transition-all group-hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </Link>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center text-xs text-gray-400">
                <span>{job.postedAt || 'Recently'}</span>
                <button className="text-body hover:text-primary transition-colors">Save Job</button>
            </div>
        </div>
    );
}

import React from 'react';

export default function Careers() {
    return (
        <div className="bg-light min-h-screen pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-dark mb-6">Careers at Konnectt</h1>
                    <p className="text-xl text-body max-w-3xl mx-auto">
                        Join a team of visionaries dedicated to connecting the world's best talent with game-changing opportunities.
                    </p>
                </div>

                <div className="bg-white p-12 rounded-[40px] shadow-sm border border-gray-100 mb-16">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                        <div>
                            <h4 className="text-3xl font-bold text-primary mb-2">500+</h4>
                            <p className="text-body font-medium">Internal Team Members</p>
                        </div>
                        <div>
                            <h4 className="text-3xl font-bold text-primary mb-2">15+</h4>
                            <p className="text-body font-medium">Countries</p>
                        </div>
                        <div>
                            <h4 className="text-3xl font-bold text-primary mb-2">Unlimited</h4>
                            <p className="text-body font-medium">Growth Potential</p>
                        </div>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto space-y-12">
                    <section>
                        <h2 className="text-2xl font-bold text-dark mb-4">Why Work With Us?</h2>
                        <p className="text-body leading-relaxed">
                            At Konnectt, we don't just fill roles; we build futures. We offer a dynamic, inclusive environment where your ideas are valued and your professional growth is our priority. From flexible work arrangements to comprehensive health benefits, we ensure our team is well-supported.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-dark mb-4">Open Positions</h2>
                        <div className="p-8 text-center bg-gray-50 border border-dashed border-gray-300 rounded-3xl">
                            <p className="text-body font-medium">We are currently updating our internal careers portal. Please check back soon or send your resume to <a href="mailto:careers@konnectt.in" className="text-primary hover:underline">careers@konnectt.in</a></p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

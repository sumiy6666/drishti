import React from 'react';

export default function About() {
    return (
        <div className="bg-white min-h-screen pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="max-w-3xl">
                    <h1 className="text-4xl md:text-5xl font-bold text-dark mb-8">About Konnectt</h1>
                    <p className="text-xl text-body mb-12 leading-relaxed">
                        Konnectt is a premier global human capital partner, dedicated to redefining the intersection of talent and opportunity. We provide end-to-end recruitment, workforce management, and strategic HR consulting services designed for the modern era.
                    </p>

                    <div className="space-y-12">
                        <section>
                            <h2 className="text-2xl font-bold text-dark mb-4">Our Mission</h2>
                            <p className="text-body leading-relaxed">
                                To empower organizations by providing them with the world's best talent and to enable professionals to find careers that truly resonate with their ambitions and skills. We believe in the power of meaningful connections to drive innovation and growth.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-dark mb-4">Our Vision</h2>
                            <p className="text-body leading-relaxed">
                                To be the most trusted global platform for talent acquisition, recognized for our commitment to excellence, integrity, and the localized expertise that makes a global impact.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-dark mb-4">Our Story</h2>
                            <p className="text-body leading-relaxed">
                                Founded with the goal of bridging the gap in specialized recruitment, Konnectt has grown into a comprehensive workforce solutions provider. Today, we serve clients across multiple continents, leveraging proprietary technology and a deep understanding of industry-specific needs.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}

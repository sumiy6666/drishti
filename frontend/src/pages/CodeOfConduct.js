import React from 'react';

export default function CodeOfConduct() {
    return (
        <div className="bg-light min-h-screen pt-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <h1 className="text-4xl font-bold text-dark mb-10 text-center">Code of Conduct</h1>

                <div className="bg-white p-12 rounded-[2rem] shadow-sm border border-gray-100 text-body space-y-12">
                    <section>
                        <h2 className="text-2xl font-bold text-dark mb-4">Professionalism</h2>
                        <p className="leading-relaxed">Konnectt maintains a high standard of professionalism. We expect all users—employers and jobseekers alike—to interact with respect, honesty, and transparency.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-dark mb-4">Inclusivity & Diversity</h2>
                        <p className="leading-relaxed">We are committed to a diverse and inclusive environment. Discrimination based on race, gender, religion, age, disability, or orientation is strictly prohibited on our platform.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-dark mb-4">Integrity in Hiring</h2>
                        <p className="leading-relaxed">Employers agree to provide accurate job descriptions and to never misrepresent the terms of employment. Jobseekers agree to provide truthful information regarding their experience and skills.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-dark mb-4">Fair Play</h2>
                        <p className="leading-relaxed">Konnectt is built on trust. Any attempt to manipulate the system or engage in unethical behavior will be met with immediate suspension of access.</p>
                    </section>
                </div>
            </div>
        </div>
    );
}

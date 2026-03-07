import React from 'react';

export default function Solutions() {
    const solutions = [
        {
            title: "Talent Acquisition",
            desc: "Comprehensive recruitment services ranging from executive search to high-volume staffing across Technology, Engineering, and Finance sectors."
        },
        {
            title: "HR Technology",
            desc: "State-of-the-art tools for applicant tracking, skills assessment, and workforce analytics to streamline your hiring process."
        },
        {
            title: "Workforce Management",
            desc: "Tailored solutions for contract management, payroll, and compliance, allowing you to focus on your core business objectives."
        },
        {
            title: "Managed Service Provider (MSP)",
            desc: "End-to-end management of your contingent workforce, ensuring visibility, cost control, and performance optimization."
        }
    ];

    return (
        <div className="bg-light min-h-screen pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-dark mb-6">Our Solutions</h1>
                    <p className="text-xl text-body max-w-3xl mx-auto">
                        Konnectt delivers end-to-end talent and workforce solutions that empower organizations to scale with confidence.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {solutions.map((s, i) => (
                        <div key={i} className="bg-white p-10 rounded-3xl shadow-card border border-gray-100 hover:border-primary transition-all">
                            <h3 className="text-2xl font-bold text-dark mb-4">{s.title}</h3>
                            <p className="text-body leading-relaxed">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

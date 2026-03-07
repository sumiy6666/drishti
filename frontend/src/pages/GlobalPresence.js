import React from 'react';

export default function GlobalPresence() {
    const regions = [
        { name: "Asia Pacific", location: "Global Headquarters", hubs: ["Singapore", "Mumbai", "Sydney"] },
        { name: "North America", location: "Regional Office", hubs: ["New York", "San Francisco", "Toronto"] },
        { name: "Europe", location: "Regional Hub", hubs: ["London", "Berlin", "Paris"] },
        { name: "Middle East", location: "Specialized Hub", hubs: ["Dubai", "Riyadh"] }
    ];

    return (
        <div className="bg-white min-h-screen pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-dark mb-6">Global Presence</h1>
                    <p className="text-xl text-body max-w-3xl mx-auto">
                        With a network spanning 15+ countries, Konnectt provides the localized expertise needed for a truly global workforce.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {regions.map((r, i) => (
                        <div key={i} className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                            <h3 className="text-xl font-bold text-dark mb-2">{r.name}</h3>
                            <p className="text-primary font-medium mb-6 text-sm">{r.location}</p>
                            <ul className="space-y-2">
                                {r.hubs.map((h, j) => (
                                    <li key={j} className="text-body flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                                        {h}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

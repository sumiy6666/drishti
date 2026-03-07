import React from 'react';

export default function Terms() {
    return (
        <div className="bg-light min-h-screen pt-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <h1 className="text-4xl font-bold text-dark mb-10">Terms of Service</h1>

                <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 text-body space-y-8">


                    <section>
                        <h2 className="text-xl font-bold text-dark mb-4">1. Acceptance of Terms</h2>
                        <p>By accessing and using the Konnectt job portal, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-dark mb-4">2. User Responsibilities</h2>
                        <p>You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate information and to use the portal only for its intended purpose: seeking or offering employment.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-dark mb-4">3. Prohibited Activities</h2>
                        <p>Users are prohibited from uploading malware, spamming other users, or attempting to breach the security of the portal. Any such activity will result in immediate account termination.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-dark mb-4">4. Intellectual Property</h2>
                        <p>All content on the portal, including logos, designs, and text, is the property of Konnectt and is protected by copyright laws.</p>
                    </section>
                </div>
            </div>
        </div>
    );
}

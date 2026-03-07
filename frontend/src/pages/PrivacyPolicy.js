import React from 'react';

export default function PrivacyPolicy() {
    return (
        <div className="bg-white min-h-screen pt-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <h1 className="text-4xl font-bold text-dark mb-10">Privacy Policy</h1>

                <div className="prose prose-blue max-w-none text-body space-y-8">
                    <p>Last updated: March 7, 2026</p>

                    <section>
                        <h2 className="text-2xl font-bold text-dark mb-4 underline decoration-primary/30">1. Information We Collect</h2>
                        <p>At Konnectt, we collect personal information that you provide directly to us when you create an account, upload a resume, or communicate with us. This may include your name, email address, phone number, employment history, and education details.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-dark mb-4 underline decoration-primary/30">2. How We Use Your Information</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>To provide and maintain our job portal services.</li>
                            <li>To match candidates with potential job opportunities.</li>
                            <li>To communicate with you regarding your account and application status.</li>
                            <li>To improve our platform's functionality and user experience.</li>
                            <li>To comply with legal obligations and prevent fraudulent activity.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-dark mb-4 underline decoration-primary/30">3. Data Sharing</h2>
                        <p>We do not sell your personal information. We may share your profile and resume with prospective employers who have listed jobs on our portal. We may also share data with third-party service providers (such as AWS For hosting and SES for emails) who help us operate our business.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-dark mb-4 underline decoration-primary/30">4. Your Rights</h2>
                        <p>You have the right to access, update, or delete your personal information at any time through your profile settings. If you wish to close your account, please contact our support team at info@konnectt.in.</p>
                    </section>
                </div>
            </div>
        </div>
    );
}

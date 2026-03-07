import React from 'react';

export default function CookiePolicy() {
    return (
        <div className="bg-white min-h-screen pt-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 font-sans">
                <h1 className="text-4xl font-bold text-dark mb-8">Cookie Policy</h1>

                <div className="text-body space-y-8">
                    <p>Konnectt uses cookies to enhance your browsing experience and provide tailored content. This policy explains what cookies are and how we use them.</p>

                    <section>
                        <h2 className="text-2xl font-bold text-dark mb-4">What Are Cookies?</h2>
                        <p>Cookies are small text files stored on your device when you visit a website. They help the website remember your preferences and actions over time.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-dark mb-4">How We Use Cookies</h2>
                        <ul className="list-disc pl-6 space-y-4">
                            <li><strong>Essential Cookies:</strong> Necessary for the portal to function (e.g., keeping you logged in).</li>
                            <li><strong>Analytical Cookies:</strong> Help us understand how users interact with our site so we can improve it.</li>
                            <li><strong>Preference Cookies:</strong> Remember your language and region settings.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-dark mb-4">Managing Cookies</h2>
                        <p>You can control and/or delete cookies through your browser settings. However, disabling essential cookies may affect your ability to use certain features of the portal.</p>
                    </section>
                </div>
            </div>
        </div>
    );
}

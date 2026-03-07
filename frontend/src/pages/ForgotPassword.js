import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../components/Logo';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [err, setErr] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const navigate = useNavigate();

    const handleForgotSubmit = async (e) => {
        e.preventDefault();
        setErr('');
        setLoading(true);
        try {
            const res = await fetch((process.env.REACT_APP_API || 'http://localhost:5000') + '/api/auth/forgot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
                body: JSON.stringify({ email })
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Request failed');
            }
            setSent(true);
            // Automatically navigate to reset password page after a brief delay or show instructions
            setTimeout(() => {
                navigate('/reset-password', { state: { email } });
            }, 2000);
        } catch (err) {
            setErr(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-light flex items-center justify-center relative overflow-hidden px-4 py-20 pt-32">
            {/* Background Shapes */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-md w-full relative z-10">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center justify-center mb-8 group mx-auto">
                        <Logo variant="dark" size="large" />
                    </Link>
                    <h2 className="text-3xl font-bold text-dark mb-2">Forgot Password</h2>
                    <p className="text-body">Enter your email to receive a password reset OTP.</p>
                </div>

                <div className="bg-white rounded-3xl p-8 md:p-10 shadow-card border border-gray-100 relative overflow-hidden">
                    {sent ? (
                        <div className="text-center space-y-4 animate-fade-in-up">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                                <i className="fas fa-check"></i>
                            </div>
                            <h3 className="text-xl font-bold text-dark">Check Your Email</h3>
                            <p className="text-body">We've sent a 6-digit OTP to <strong>{email}</strong></p>
                            <p className="text-sm text-gray-400">Redirecting to reset page...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleForgotSubmit} className="space-y-6 relative z-10">
                            <div>
                                <label className="block text-sm font-bold text-dark mb-2">Email Address</label>
                                <input
                                    required
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl text-dark placeholder-gray-400 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all hover:bg-white"
                                />
                            </div>

                            {err && <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-500 text-sm text-center font-bold">{err}</div>}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-button hover:-translate-y-1 disabled:opacity-50"
                            >
                                {loading ? 'Sending OTP...' : 'Send Reset Code'}
                            </button>
                        </form>
                    )}

                    <div className="mt-8 text-center relative z-10">
                        <Link to="/login" className="text-primary font-bold hover:underline transition-colors flex items-center justify-center gap-2">
                            <i className="fas fa-arrow-left text-xs"></i> Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

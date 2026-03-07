import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Logo from '../components/Logo';

export default function ResetPassword() {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    if (password !== confirmPassword) {
      return setErr("Passwords don't match");
    }
    setLoading(true);
    try {
      const res = await fetch((process.env.REACT_APP_API || 'http://localhost:5000') + '/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify({ email, otp, password })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Reset failed');
      }
      alert('Password reset successful! Please login.');
      navigate('/login');
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
          <h2 className="text-3xl font-bold text-dark mb-2">Reset Password</h2>
          <p className="text-body">Enter the 6-digit OTP and your new password.</p>
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-card border border-gray-100 relative overflow-hidden">
          <form onSubmit={handleResetSubmit} className="space-y-5 relative z-10">
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

            <div>
              <label className="block text-sm font-bold text-dark mb-2">6-Digit OTP</label>
              <input
                required
                maxLength="6"
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl text-center text-2xl font-bold tracking-[5px] text-dark placeholder-gray-300 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all hover:bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-dark mb-2">New Password</label>
              <input
                required
                minLength="6"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl text-dark placeholder-gray-400 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all hover:bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-dark mb-2">Confirm New Password</label>
              <input
                required
                minLength="6"
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl text-dark placeholder-gray-400 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all hover:bg-white"
              />
            </div>

            {err && <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-500 text-sm text-center font-bold">{err}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-button hover:-translate-y-1 disabled:opacity-50"
            >
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>

          <div className="mt-8 text-center relative z-10">
            <Link to="/forgot-password" title="Request new OTP" className="text-primary font-bold hover:underline transition-colors text-sm">
              Didn't get code? Try again
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

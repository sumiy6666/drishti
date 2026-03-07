import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../components/Logo';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('jobseeker');
  const [company, setCompany] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async e => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const res = await fetch((process.env.REACT_APP_API || 'http://localhost:5000') + '/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify({ name, email, password, role, company })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Register failed');

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setShowOtp(true);
    } catch (err) {
      setErr(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const res = await fetch((process.env.REACT_APP_API || 'http://localhost:5000') + '/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify({ email, otp, type: 'register' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Verification failed');

      // Update local storage user verified status
      const user = JSON.parse(localStorage.getItem('user'));
      user.verified = true;
      localStorage.setItem('user', JSON.stringify(user));

      navigate('/');
      window.location.reload();
    } catch (err) {
      setErr(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setErr('');
    try {
      const res = await fetch((process.env.REACT_APP_API || 'http://localhost:5000') + '/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify({ email })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Resend failed');
      }
      alert('OTP resent successfully!');
    } catch (err) {
      setErr(err.message);
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
          <h2 className="text-3xl font-bold text-dark mb-2">
            {showOtp ? 'Verify Your Account' : 'Create Account'}
          </h2>
          <p className="text-body">
            {showOtp ? `We've sent a 6-digit code to ${email}` : 'Join the future of work today.'}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-card border border-gray-100 relative overflow-hidden">
          {!showOtp ? (
            <form onSubmit={submit} className="space-y-5 relative z-10">
              <div>
                <label className="block text-sm font-bold text-dark mb-2">Full Name</label>
                <input
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl text-dark placeholder-gray-400 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all hover:bg-white"
                />
              </div>

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
                <label className="block text-sm font-bold text-dark mb-2">Password</label>
                <input
                  required
                  minLength="6"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  type="password"
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl text-dark placeholder-gray-400 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all hover:bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-dark mb-2">I am a...</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setRole('jobseeker')}
                    className={`py-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${role === 'jobseeker' ? 'bg-primary text-white shadow-button transform -translate-y-0.5' : 'bg-gray-50 text-body border border-gray-200 hover:bg-gray-100 hover:border-gray-300'}`}
                  >
                    <i className="fas fa-user"></i> Job Seeker
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('employer')}
                    className={`py-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${role === 'employer' ? 'bg-secondary text-white shadow-lg shadow-secondary/30 transform -translate-y-0.5' : 'bg-gray-50 text-body border border-gray-200 hover:bg-gray-100 hover:border-gray-300'}`}
                  >
                    <i className="fas fa-briefcase"></i> Employer
                  </button>
                </div>
              </div>

              {role === 'employer' && (
                <div className="animate-fade-in-up">
                  <label className="block text-sm font-bold text-dark mb-2">Company Name</label>
                  <input
                    required
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    placeholder="Tech Corp Inc."
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl text-dark placeholder-gray-400 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all hover:bg-white"
                  />
                </div>
              )}

              {err && <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-500 text-sm text-center font-bold">{err}</div>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-button hover:-translate-y-1 disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-6 relative z-10 animate-fade-in-up">
              <div>
                <label className="block text-sm font-bold text-dark mb-2">Enter 6-Digit OTP</label>
                <input
                  required
                  maxLength="6"
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl text-center text-3xl font-bold tracking-[10px] text-dark placeholder-gray-300 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all hover:bg-white"
                />
              </div>

              {err && <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-500 text-sm text-center font-bold">{err}</div>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-button hover:-translate-y-1 disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify & Complete'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={resendOtp}
                  className="text-primary font-bold hover:underline transition-colors"
                >
                  Didn't receive code? Resend
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 text-center relative z-10">
            <p className="text-body text-sm font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-bold hover:underline transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

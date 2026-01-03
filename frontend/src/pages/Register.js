import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('jobseeker');
  const [company, setCompany] = useState('');
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const submit = async e => {
    e.preventDefault(); setErr('');
    try {
      const res = await fetch((process.env.REACT_APP_API || 'http://localhost:5000') + '/api/auth/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' }, body: JSON.stringify({ name, email, password, role, company })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Register failed');
      localStorage.setItem('token', data.token); localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
      window.location.reload();
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
          <Link to="/" className="inline-flex items-center gap-2 mb-8 group">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
              <span className="transform -rotate-12">K</span>
            </div>
            <span className="text-3xl font-bold text-dark tracking-tight">Konnectt</span>
          </Link>
          <h2 className="text-3xl font-bold text-dark mb-2">Create Account</h2>
          <p className="text-body">Join the future of work today.</p>
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-card border border-gray-100 relative overflow-hidden">
          <form onSubmit={submit} className="space-y-5 relative z-10">
            <div>
              <label className="block text-sm font-bold text-dark mb-2">Full Name</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl text-dark placeholder-gray-400 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all hover:bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-dark mb-2">Email Address</label>
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl text-dark placeholder-gray-400 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all hover:bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-dark mb-2">Password</label>
              <input
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
              className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-button hover:-translate-y-1"
            >
              Create Account
            </button>
          </form>

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

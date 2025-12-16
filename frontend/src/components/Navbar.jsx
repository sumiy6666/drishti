import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20">
              K
            </div>
            <Link to="/" className="text-2xl font-bold text-dark tracking-tight hover:text-primary transition-colors">
              Konnectt
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-body font-medium hover:text-primary transition-colors">Home</Link>
            <Link to="/jobs" className="text-body font-medium hover:text-primary transition-colors">Find Jobs</Link>
            <Link to="/employer" className="text-body font-medium hover:text-primary transition-colors">Employers</Link>
            <Link to="/about" className="text-body font-medium hover:text-primary transition-colors">About</Link>
          </div>

          <div className="flex items-center space-x-4">
            {!token ? (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="text-dark font-semibold hover:text-primary transition-colors px-4"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="px-6 py-2.5 rounded-lg bg-primary text-white font-bold hover:bg-blue-700 transition-all shadow-lg shadow-primary/20 hover:-translate-y-0.5"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate('/profile')}
                  className="text-body font-medium hover:text-primary transition-colors"
                >
                  Profile
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    navigate('/');
                    window.location.reload();
                  }}
                  className="px-5 py-2 rounded-lg border border-gray-200 bg-white text-body font-medium hover:bg-gray-50 transition-all hover:text-primary"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

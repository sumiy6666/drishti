import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/30">
              <span className="transform -rotate-12">K</span>
            </div>
            <span className="text-2xl font-bold text-secondary tracking-tight">Konnectt</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {(user?.role === 'employer' ? [
              { name: 'Home', path: '/' },
              { name: 'Dashboard', path: '/employer' },
              { name: 'Find Candidates', path: '/candidates' },
              { name: 'Post Job', path: '/post-job' },
            ] : [
              { name: 'Home', path: '/' },
              { name: 'Find Jobs', path: '/jobs' },
              { name: 'My Applications', path: '/my-applications' },
            ]).map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-bold transition-colors relative group ${isActive(link.path) ? 'text-primary' : 'text-secondary hover:text-primary'
                  }`}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full ${isActive(link.path) ? 'w-full' : ''}`}></span>
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <NotificationBell />
                <Link to="/profile" className="text-sm font-bold text-secondary hover:text-primary transition-colors">
                  Hi, {user.name.split(' ')[0]}
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-secondary hover:bg-red-50 hover:text-red-500 transition-colors"
                >
                  <i className="fas fa-sign-out-alt"></i>
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm font-bold text-secondary hover:text-primary transition-colors">
                  Login
                </Link>
                <button
                  onClick={() => navigate('/register')}
                  className="px-8 py-3 rounded-full bg-primary text-white text-sm font-bold hover:bg-blue-600 transition-all shadow-button hover:-translate-y-0.5"
                >
                  Get Started <i className="fas fa-arrow-right ml-1"></i>
                </button>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-secondary text-2xl"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-lg p-4 flex flex-col gap-4 animate-fade-in">
          <Link to="/" className="text-secondary font-bold py-2" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          {user?.role === 'employer' ? (
            <>
              <Link to="/employer" className="text-secondary font-bold py-2" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
              <Link to="/candidates" className="text-secondary font-bold py-2" onClick={() => setMobileMenuOpen(false)}>Find Candidates</Link>
              <Link to="/post-job" className="text-secondary font-bold py-2" onClick={() => setMobileMenuOpen(false)}>Post Job</Link>
            </>
          ) : (
            <Link to="/jobs" className="text-secondary font-bold py-2" onClick={() => setMobileMenuOpen(false)}>Find Jobs</Link>
          )}
          <div className="h-px bg-gray-100 my-2"></div>
          {user ? (
            <>
              <Link to="/profile" className="text-secondary font-bold py-2" onClick={() => setMobileMenuOpen(false)}>My Profile</Link>
              <button onClick={handleLogout} className="text-left text-red-500 font-bold py-2">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-secondary font-bold py-2" onClick={() => setMobileMenuOpen(false)}>Login</Link>
              <Link to="/register" className="text-primary font-bold py-2" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div >
      )}
    </header >
  );
}

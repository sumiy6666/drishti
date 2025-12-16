import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const role = user ? user.role : null;

  return (
    <footer className="bg-white border-t border-gray-100 mt-auto relative z-10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-sm text-body">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-primary/20">
                K
              </div>
              <h4 className="font-bold text-dark text-xl tracking-tight">Konnectt</h4>
            </div>
            <p className="text-body leading-relaxed mb-6">
              Empowering the next generation of workforce with AI-driven connections and decentralized opportunities.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-light flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-light flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-light flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
                <i className="fab fa-github"></i>
              </a>
            </div>
          </div>

          {/* Job Seeker Links */}
          {(!role || role === 'jobseeker') && (
            <div>
              <h4 className="font-bold text-dark text-lg mb-6">For Job Seekers</h4>
              <ul className="space-y-4">
                <li><Link to="/jobs" className="hover:text-primary transition-colors">Browse Jobs</Link></li>
                <li><Link to="/jobs?remote=true" className="hover:text-primary transition-colors">Remote Jobs</Link></li>
                {role === 'jobseeker' && (
                  <>
                    <li><Link to="/my-applications" className="hover:text-primary transition-colors">My Applications</Link></li>
                    <li><Link to="/profile" className="hover:text-primary transition-colors">My Profile</Link></li>
                  </>
                )}
              </ul>
            </div>
          )}

          {/* Employer Links */}
          {(!role || role === 'employer') && (
            <div>
              <h4 className="font-bold text-dark text-lg mb-6">For Employers</h4>
              <ul className="space-y-4">
                {role === 'employer' ? (
                  <>
                    <li><Link to="/post-job" className="hover:text-primary transition-colors">Post a Job</Link></li>
                    <li><Link to="/employer" className="hover:text-primary transition-colors">My Dashboard</Link></li>
                    <li><Link to="/profile" className="hover:text-primary transition-colors">Company Profile</Link></li>
                  </>
                ) : (
                  <li><Link to="/login" className="hover:text-primary transition-colors">Post a Job</Link></li>
                )}
                <li><Link to="/pricing" className="hover:text-primary transition-colors">Pricing Plans</Link></li>
              </ul>
            </div>
          )}

          <div>
            <h4 className="font-bold text-dark text-lg mb-6">Company</h4>
            <ul className="space-y-4">
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-body">
          <p>© {new Date().getFullYear()} Konnectt. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

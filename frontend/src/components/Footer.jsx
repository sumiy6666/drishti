import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-secondary pt-20 pb-10 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/30">
                <span className="transform -rotate-12">K</span>
              </div>
              <h4 className="font-bold text-white text-2xl tracking-tight">Konnectt</h4>
            </div>
            <p className="text-gray-300 leading-relaxed">
              A leading global provider of recruitment and consultancy solutions.
            </p>
            <div className="flex gap-4">
              {['facebook-f', 'twitter', 'instagram', 'linkedin-in'].map(icon => (
                <a key={icon} href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-all hover:-translate-y-1">
                  <i className={`fab fa-${icon} text-white`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h4 className="font-bold text-white text-lg mb-8">Company</h4>
            <ul className="space-y-4">
              {['About Us', 'Our Services', 'Meet The Team', 'Careers'].map(item => (
                <li key={item}>
                  <Link to="#" className="text-gray-300 hover:text-primary transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className="font-bold text-white text-lg mb-8">Useful Links</h4>
            <ul className="space-y-4">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Contact Us'].map(item => (
                <li key={item}>
                  <Link to="#" className="text-gray-300 hover:text-primary transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h4 className="font-bold text-white text-lg mb-8">Newsletter</h4>
            <p className="text-gray-300 mb-6">Subscribe to get the latest job updates and news.</p>
            <form className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-6 py-4 rounded-full bg-white/10 border border-white/10 focus:ring-2 focus:ring-primary outline-none text-white placeholder-gray-400"
              />
              <button className="absolute right-1.5 top-1.5 w-11 h-11 rounded-full bg-primary text-white flex items-center justify-center hover:bg-blue-600 transition-colors shadow-lg shadow-primary/30">
                <i className="fas fa-paper-plane"></i>
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Konnectt. All rights reserved.</p>
          <div className="flex gap-8">
            <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-white transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

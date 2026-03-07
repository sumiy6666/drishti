import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-secondary pt-20 pb-10 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <Logo variant="light" size="small" />
            </div>
            <p className="text-gray-300 leading-relaxed">
              A global human capital partner, delivering end-to-end talent acquisition and workforce solutions that empower organizations to scale and professionals to thrive across industries and geographies.
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
              {[
                { name: 'About Konnectt', path: '/about' },
                { name: 'Our Solutions', path: '/solutions' },
                { name: 'Careers at Konnectt', path: '/careers' }
              ].map(item => (
                <li key={item.name}>
                  <Link to={item.path} className="text-gray-300 hover:text-primary transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className="font-bold text-white text-lg mb-8">Compliance & Support</h4>
            <ul className="space-y-4">
              {[
                { name: 'Privacy Policy', path: '/privacy' },
                { name: 'Terms of Service', path: '/terms' },
                { name: 'Cookie Policy', path: '/cookies' }
              ].map(item => (
                <li key={item.name}>
                  <Link to={item.path} className="text-gray-300 hover:text-primary transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h4 className="font-bold text-white text-lg mb-8">Customer Support</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-primary">
                  <i className="fas fa-envelope"></i>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Email us at</p>
                  <a href="mailto:info@konnectt.in" className="font-bold text-white hover:text-primary transition-colors">info@konnectt.in</a>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-primary">
                  <i className="fas fa-headset"></i>
                </div>
                <div>
                  <p className="text-xs text-gray-400">24/7 Support</p>
                  <p className="font-bold text-white">Dedicated Assistance</p>
                </div>
              </div>
            </div>
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

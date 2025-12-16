import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-light font-sans text-body">

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[100px] opacity-50" />
          <div className="absolute bottom-[10%] left-[-5%] w-[30%] h-[30%] bg-green-50 rounded-full blur-[80px] opacity-50" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-primary text-sm font-bold mb-6 tracking-wide uppercase">
            #1 Job Board for Tech
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-dark mb-6 tracking-tight leading-tight">
            Find Your <span className="text-primary">Dream Job</span> <br className="hidden md:block" />
            in the Decentralized World
          </h1>
          <p className="text-lg md:text-xl text-body mb-10 max-w-2xl mx-auto leading-relaxed">
            Connect with top employers and discover opportunities that match your skills and ambitions.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
            <Link to="/jobs" className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-bold rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-primary/30 hover:-translate-y-1">
              Browse Jobs
            </Link>
            <Link to="/post-job" className="w-full sm:w-auto px-8 py-4 bg-white text-dark border border-gray-200 font-bold rounded-lg hover:bg-gray-50 transition-all hover:-translate-y-1">
              Post a Job
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto border-t border-gray-200 pt-12">
            <StatItem number="10k+" label="Active Jobs" />
            <StatItem number="500+" label="Companies" />
            <StatItem number="12k+" label="Candidates" />
            <StatItem number="98%" label="Success Rate" />
          </div>
        </div>
      </section>

      {/* Features / Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">Why Choose Konnectt?</h2>
            <p className="text-body max-w-2xl mx-auto">
              We provide the best tools and features to help you succeed in your career journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon="🚀"
              title="Fast Connections"
              desc="Apply to jobs with a single click and get connected with employers instantly."
            />
            <FeatureCard
              icon="💎"
              title="Premium Jobs"
              desc="Access high-quality job listings from top-tier tech companies and startups."
            />
            <FeatureCard
              icon="🛡️"
              title="Verified Employers"
              desc="All employers are verified to ensure a safe and reliable job hunting experience."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-dark rounded-3xl p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-dark/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-[100px] opacity-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary rounded-full blur-[100px] opacity-20 pointer-events-none" />

            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 relative z-10">Ready to Start Your Journey?</h2>
            <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto relative z-10">
              Join thousands of professionals who have found their dream jobs through Konnectt.
            </p>
            <Link to="/register" className="inline-block px-10 py-4 bg-primary text-white font-bold rounded-lg hover:bg-blue-600 transition-all shadow-lg hover:shadow-primary/50 transform hover:-translate-y-1 relative z-10">
              Get Started Now
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

function StatItem({ number, label }) {
  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{number}</div>
      <div className="text-sm text-body font-medium uppercase tracking-wide">{label}</div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-light p-8 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 group border border-transparent hover:border-gray-100">
      <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-3xl mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300 text-primary">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-dark mb-3 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-body leading-relaxed">
        {desc}
      </p>
    </div>
  );
}

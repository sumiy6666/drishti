import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import JobCard from '../components/JobCard';

export default function Home() {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const navigate = useNavigate();

  // Mock data for initial render
  useEffect(() => {
    setFeaturedJobs([
      { id: 1, title: 'Senior UI/UX Designer', company: 'Google', location: 'Mountain View, CA', type: 'Full Time', salary: '$120k - $150k', logo: 'G', postedAt: '2 days ago' },
      { id: 2, title: 'Frontend Developer', company: 'Spotify', location: 'Remote', type: 'Remote', salary: '$100k - $130k', logo: 'S', postedAt: '5 hours ago' },
      { id: 3, title: 'Product Manager', company: 'Airbnb', location: 'San Francisco, CA', type: 'Full Time', salary: '$140k - $180k', logo: 'A', postedAt: '1 day ago' },
      { id: 4, title: 'Backend Engineer', company: 'Netflix', location: 'Los Gatos, CA', type: 'Contract', salary: '$80/hr', logo: 'N', postedAt: '3 days ago' },
    ]);
  }, []);

  const categories = [
    { name: 'Design', icon: 'fa-pen-nib', count: 234 },
    { name: 'Development', icon: 'fa-code', count: 156 },
    { name: 'Marketing', icon: 'fa-bullhorn', count: 98 },
    { name: 'Finance', icon: 'fa-chart-line', count: 45 },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-body">

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Shapes */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-light-blue rounded-bl-[100px] -z-10 opacity-50"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-accent/20 rounded-full blur-3xl -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-block px-4 py-2 bg-blue-50 text-primary font-bold rounded-full text-sm tracking-wide uppercase">
                #1 Job Board for Hiring
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-secondary leading-tight">
                Give a head <br />
                start to your <br />
                <span className="text-primary relative">
                  Career
                  <svg className="absolute w-full h-3 -bottom-1 left-0 text-accent opacity-50" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                  </svg>
                </span>
              </h1>
              <p className="text-lg text-body leading-relaxed max-w-lg">
                Find the perfect job that fits your life. We have thousands of opportunities waiting for you.
              </p>

              <div className="bg-white p-3 rounded-full shadow-xl shadow-gray-200/50 border border-gray-100 flex items-center max-w-xl">
                <div className="flex-1 flex items-center px-4 border-r border-gray-100">
                  <i className="fas fa-search text-gray-400 mr-3"></i>
                  <input
                    type="text"
                    placeholder="Job title or keyword"
                    className="w-full bg-transparent outline-none text-secondary placeholder-gray-400"
                  />
                </div>
                <div className="flex-1 flex items-center px-4 hidden md:flex">
                  <i className="fas fa-map-marker-alt text-gray-400 mr-3"></i>
                  <input
                    type="text"
                    placeholder="Location"
                    className="w-full bg-transparent outline-none text-secondary placeholder-gray-400"
                  />
                </div>
                <button
                  onClick={() => navigate('/jobs')}
                  className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center hover:bg-blue-600 transition-all shadow-button hover:scale-105"
                >
                  <i className="fas fa-search"></i>
                </button>
              </div>

              <div className="pt-4 flex items-center gap-4 text-sm text-body">
                <span className="font-bold text-secondary">Popular:</span>
                <div className="flex flex-wrap gap-2">
                  {['Designer', 'Developer', 'Manager'].map(tag => (
                    <span key={tag} className="underline decoration-gray-300 hover:text-primary cursor-pointer transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Image/Illustration */}
            <div className="relative hidden lg:block">
              <div className="relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Professional Woman"
                  className="rounded-3xl shadow-2xl w-full max-w-md mx-auto object-cover h-[600px]"
                />

                {/* Floating Cards */}
                <div className="absolute top-10 -left-10 bg-white p-4 rounded-2xl shadow-card animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <i className="fas fa-check"></i>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Success Rate</p>
                      <p className="font-bold text-secondary">98% Hired</p>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-20 -right-5 bg-white p-4 rounded-2xl shadow-card animate-float" style={{ animationDelay: '1s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-primary">
                      <i className="fas fa-user-tie"></i>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Expert</p>
                      <p className="font-bold text-secondary">Management</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Circle */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-dashed border-primary/20 rounded-full -z-10 animate-spin-slow"></div>
            </div>

          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">Popular Categories</h2>
            <p className="text-body max-w-2xl mx-auto">Browse jobs by category to find the perfect fit for your skills.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <div key={cat.name} className="bg-white p-8 rounded-2xl border border-gray-100 hover:shadow-card-hover hover:border-primary/20 transition-all duration-300 group cursor-pointer text-center hover:-translate-y-1">
                <div className="w-16 h-16 mx-auto bg-blue-50 rounded-full flex items-center justify-center text-primary text-2xl mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                  <i className={`fas ${cat.icon}`}></i>
                </div>
                <h3 className="font-bold text-secondary text-lg mb-2 group-hover:text-primary transition-colors">{cat.name}</h3>
                <p className="text-sm text-gray-400">{cat.count} Jobs</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-24 bg-light-blue/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">Featured Jobs</h2>
              <p className="text-body max-w-2xl">Hand-picked jobs just for you.</p>
            </div>
            <Link to="/jobs" className="px-6 py-3 border border-gray-200 rounded-full text-secondary font-bold hover:bg-white hover:shadow-sm transition-all">
              View All Jobs <i className="fas fa-arrow-right ml-2"></i>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-light-blue relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 skew-x-12 pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-dark mb-6">Ready to Start Your Journey?</h2>
          <p className="text-body text-lg mb-10 max-w-2xl mx-auto">
            Join thousands of professionals who have found their dream jobs through Ogeko.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="px-10 py-4 bg-primary text-white font-bold rounded-full hover:bg-green-600 transition-all shadow-lg shadow-primary/30 hover:-translate-y-1">
              Get Started Now
            </Link>
            <Link to="/contact" className="px-10 py-4 bg-white text-dark border border-gray-200 font-bold rounded-full hover:bg-gray-50 transition-all hover:-translate-y-1">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

    </div >
  );
}

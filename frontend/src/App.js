import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// pages
import Home from './pages/Home';
import Jobs from './pages/Jobs'; // existing
import EmployerDashboard from './pages/EmployerDashboard';
import CompanyProfile from './pages/CompanyProfile';
import FindCandidates from './pages/FindCandidates';
import CandidateProfile from './pages/CandidateProfile';
import AdminPanel from './pages/AdminPanel';
import MyApplications from './pages/MyApplications';
import Profile from './pages/Profile';
import JobDetails from './pages/JobDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import PostJob from './pages/PostJob';
import JobApplications from './pages/JobApplications';

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/employer" element={<EmployerDashboard />} />
          <Route path="/candidates" element={<FindCandidates />} />
          <Route path="/candidate/:id" element={<CandidateProfile />} />
          <Route path="/company/:id" element={<CompanyProfile />} />
          <Route path="/post-job" element={<PostJob />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/my-applications" element={<MyApplications />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs/:id/applications" element={<JobApplications />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

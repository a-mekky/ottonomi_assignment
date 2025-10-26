import './App.css'
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { JobList } from './pages/JobList';
import { Layout } from './components/layout/Layout';
import { JobDetail } from './pages/JobDetail';
import { JobApply } from './pages/JobApply';
import { PostJob } from './pages/PostJob';
import { Dashboard } from './pages/Dashboard';
import { JobCandidates } from './pages/JobCandidates';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<JobList />} />
          <Route path="/job/:id" element={<JobDetail />} />
          <Route path="/job/:id/apply" element={<JobApply />} />

          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/jobs/:jobId/candidates" element={<JobCandidates />} />

          {/* Job Management */}
          <Route path="/post-job" element={<PostJob />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

import './App.css'
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { JobList } from './pages/JobList';
import { Layout } from './components/layout/Layout';
import { JobDetail } from './pages/JobDetail';
import { JobApply } from './pages/JobApply';
import { JobForm } from './components/job/JobForm';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<JobList />} />
          <Route path="/job/:id" element={<JobDetail />} />
          <Route path="/job/:id/apply" element={<JobApply />} />
          <Route path="/post-job" element={<JobForm />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

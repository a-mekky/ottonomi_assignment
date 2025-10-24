import './App.css'
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { JobList } from './pages/JobList';
import { Layout } from './components/layout/Layout';

function App() {
  return (
    <Router>
      <Layout> 
        <Routes>

          <Route path="/" element={<JobList />} />

        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

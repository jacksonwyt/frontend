//frontend/src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-darkGray text-white">
        <Header />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/app" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
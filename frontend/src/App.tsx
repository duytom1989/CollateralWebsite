import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Vehicles from './pages/Vehicles';
import RealEstate from './pages/RealEstate';
import AssetDetail from './pages/AssetDetail';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/asset/:type/:id" element={<AssetDetail />} />
          <Route path="/real-estate" element={<RealEstate />} />
          <Route path="/contact" element={<div className="p-8 text-center">Contact Page - Coming Soon</div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
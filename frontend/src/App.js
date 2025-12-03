import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import Login from './pages/Login';
import SuperAdmin from './pages/SuperAdmin';
import BuildingAdmin from './pages/BuildingAdmin';
import FrontDesk from './pages/FrontDesk';
import CompanyReceptionist from './pages/CompanyReceptionist';
import VisitorCheckIn from './pages/VisitorCheckIn';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Login Route */}
          <Route path="/login" element={<Login />} />
          
          {/* Role-based Dashboards */}
          <Route path="/super-admin" element={<SuperAdmin />} />
          <Route path="/building-admin" element={<BuildingAdmin />} />
          <Route path="/front-desk" element={<FrontDesk />} />
          <Route path="/company-receptionist" element={<CompanyReceptionist />} />
          
          {/* Visitor check-in flow (no login required) */}
          <Route path="/visitor/:buildingId" element={<VisitorCheckIn />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;

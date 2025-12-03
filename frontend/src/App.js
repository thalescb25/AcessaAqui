import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Public Routes with Navbar and Footer */}
          <Route
            path="/*"
            element={
              <>
                <Navbar />
                <div className="pt-20">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/solucao" element={<Home />} />
                    <Route path="/segmentos" element={<Home />} />
                    <Route path="/depoimentos" element={<Home />} />
                    <Route path="/contato" element={<Home />} />
                  </Routes>
                </div>
                <Footer />
              </>
            }
          />
          
          {/* Login Route without Navbar/Footer */}
          <Route path="/login" element={<Login />} />
          
          {/* Dashboard Route without Navbar/Footer */}
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;

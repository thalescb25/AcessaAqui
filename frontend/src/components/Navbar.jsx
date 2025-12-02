import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, KeyRound, Users, Phone, FileText } from 'lucide-react';
import { Button } from './ui/button';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: 'SOLUÇÃO', path: '/solucao' },
    { label: 'SEGMENTOS', path: '/segmentos' },
    { label: 'DEPOIMENTOS', path: '/depoimentos' },
    { label: 'CONTATO', path: '/contato' }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-slate-900/95 backdrop-blur-sm shadow-lg' : 'bg-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <KeyRound className="w-10 h-10 text-green-500 transition-transform group-hover:rotate-12" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white tracking-tight">AccessControl</span>
              <span className="text-xs text-green-500 font-medium">Sistema Digital de Acesso</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-gray-300 hover:text-green-500 font-medium text-sm transition-colors relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 transition-all group-hover:w-full"></span>
              </Link>
            ))}
            <Button
              onClick={() => navigate('/login')}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium transition-all shadow-lg hover:shadow-green-500/50"
            >
              PORTAL
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-800 border-t border-slate-700">
          <div className="px-4 py-4 space-y-3">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-gray-300 hover:text-green-500 font-medium py-2 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Button
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigate('/login');
              }}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-medium transition-all"
            >
              PORTAL
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

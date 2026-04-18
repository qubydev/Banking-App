import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import React, { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="bg-slate-900 text-white shadow-lg relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center gap-2 group" onClick={closeMenu}>
              <span className="text-2xl">🏦</span>
              <span className="font-bold text-xl tracking-tight group-hover:text-blue-400 transition-colors">
                SecureBank
              </span>
            </Link>
          </div>

          {/* Desktop Links Section */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <div>
                  <span className="text-slate-400 text-sm">Welcome back,</span>
                  <span className="ml-1 font-medium text-blue-300">{user.username}</span>
                </div>
                
                <div className="flex items-center gap-4 border-l border-slate-700 pl-6">
                  <Link to="/dashboard" className="hover:text-blue-400 transition-colors font-medium">
                    Dashboard
                  </Link>
                  <Link to="/transfer" className="hover:text-blue-400 transition-colors font-medium">
                    Transfer
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm font-semibold transition-all active:scale-95 shadow-md shadow-red-900/20"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-slate-300 hover:text-white transition-colors">
                  Login
                </Link>
                <Link to="/register" className="text-slate-300 hover:text-white transition-colors">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-300 hover:text-white focus:outline-none p-2"
            >
              {isOpen ? (
                // Close Icon
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                // Hamburger Icon
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-slate-800 border-t border-slate-700">
          <div className="px-4 pt-2 pb-4 space-y-3">
            {user ? (
              <>
                <div className="pb-3 border-b border-slate-700">
                  <span className="text-slate-400 text-sm block">Welcome back,</span>
                  <span className="font-medium text-blue-300 text-lg block">{user.username}</span>
                </div>
                
                <div className="flex flex-col gap-3">
                  <Link 
                    to="/dashboard" 
                    onClick={closeMenu}
                    className="block text-white hover:text-blue-400 transition-colors font-medium"
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/transfer" 
                    onClick={closeMenu}
                    className="block text-white hover:text-blue-400 transition-colors font-medium"
                  >
                    Transfer
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 px-4 py-2 mt-2 rounded-lg text-sm font-semibold transition-all active:scale-95 shadow-md shadow-red-900/20 w-full text-left"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-3 pt-2">
                <Link 
                  to="/login" 
                  onClick={closeMenu}
                  className="block text-slate-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  onClick={closeMenu}
                  className="block text-slate-300 hover:text-white transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
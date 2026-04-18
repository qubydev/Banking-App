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
    <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">

          {/* Logo */}
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-lg sm:text-xl font-bold"
            onClick={closeMenu}
          >
            <span>🏦</span>
            <span className="hidden xs:inline">SecureBank</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            {user ? (
              <>
                <span className="text-sm text-slate-400 hidden lg:block">
                  Hi, <span className="text-blue-300">{user.username}</span>
                </span>

                <Link to="/dashboard" className="hover:text-blue-400 transition">
                  Dashboard
                </Link>

                <Link to="/transfer" className="hover:text-blue-400 transition">
                  Transfer
                </Link>

                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-md text-sm transition active:scale-95"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-400">
                  Login
                </Link>
                <Link to="/register" className="hover:text-blue-400">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-xl"
          >
            {isOpen ? "✖" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-slate-800 border-t border-slate-700 px-4 py-4 space-y-4">
          {user ? (
            <>
              <div className="text-sm text-slate-400">
                Welcome, <span className="text-blue-300">{user.username}</span>
              </div>

              <Link
                to="/dashboard"
                onClick={closeMenu}
                className="block hover:text-blue-400"
              >
                Dashboard
              </Link>

              <Link
                to="/transfer"
                onClick={closeMenu}
                className="block hover:text-blue-400"
              >
                Transfer
              </Link>

              <button
                onClick={handleLogout}
                className="w-full bg-red-500 hover:bg-red-600 py-2 rounded-md"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu} className="block">
                Login
              </Link>
              <Link to="/register" onClick={closeMenu} className="block">
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
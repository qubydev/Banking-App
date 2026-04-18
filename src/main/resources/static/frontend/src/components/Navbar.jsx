import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX, FiLogOut, FiLogIn, FiUserPlus, FiHome, FiSend } from 'react-icons/fi';
import { BsBank } from 'react-icons/bs';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="w-full bg-slate-900 border-b border-slate-700 sticky top-0 z-50 shadow-xl relative">
      <div className="px-6 py-4 flex items-center justify-between">
        <Link
          to="/dashboard"
          onClick={closeMenu}
          className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-white hover:text-blue-400 transition-colors"
        >
          <BsBank className="text-3xl text-blue-400" />
          <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            SecureBank
          </span>
        </Link>

        <button
          onClick={toggleMenu}
          className="md:hidden text-slate-200 hover:text-white focus:outline-none transition-colors"
        >
          {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </button>

        <div className="hidden md:flex items-center gap-8">
          {user ? (
            <>
              <div>
                <span className="text-slate-400 text-sm italic">Welcome back,</span>
                <span className="ml-1 font-semibold text-blue-300 capitalize">{user.username}</span>
              </div>

              <div className="flex items-center gap-6">
                <Link to="/dashboard" className="flex items-center gap-2 text-slate-200 hover:text-white font-medium transition-all hover:-translate-y-0.5">
                  <FiHome /> Dashboard
                </Link>
                <Link to="/transfer" className="flex items-center gap-2 text-slate-200 hover:text-white font-medium transition-all hover:-translate-y-0.5">
                  <FiSend /> Transfer
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-bold shadow-lg shadow-red-900/20 transition-all active:scale-95"
                >
                  <FiLogOut /> Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="flex items-center gap-2 text-slate-200 hover:text-white font-medium px-4 py-2 transition-colors">
                <FiLogIn /> Login
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg font-bold transition-all shadow-lg shadow-blue-900/30"
              >
                <FiUserPlus /> Register
              </Link>
            </div>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 w-full md:hidden bg-slate-800 border-t border-slate-700 px-4 py-4 flex flex-col gap-2 shadow-xl animate-in slide-in-from-top-2 text-center">
          {user ? (
            <>
              <div className="mb-2 pb-3 px-2 border-b border-slate-700">
                <span className="text-slate-400 text-sm italic">Welcome back,</span>
                <span className="ml-1 font-semibold text-blue-300 capitalize">{user.username}</span>
              </div>
              <Link to="/dashboard" onClick={closeMenu} className="flex items-center justify-center gap-3 text-slate-200 hover:text-white font-medium py-3 px-4 rounded-lg hover:bg-slate-700 transition-colors">
                <FiHome size={20} /> Dashboard
              </Link>
              <Link to="/transfer" onClick={closeMenu} className="flex items-center justify-center gap-3 text-slate-200 hover:text-white font-medium py-3 px-4 rounded-lg hover:bg-slate-700 transition-colors">
                <FiSend size={20} /> Transfer
              </Link>
              <button
                onClick={() => { closeMenu(); handleLogout(); }}
                className="flex items-center justify-center gap-3 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg font-bold mt-2 transition-colors w-full"
              >
                <FiLogOut size={20} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu} className="flex items-center justify-center gap-3 text-slate-200 hover:text-white font-medium py-3 px-4 rounded-lg hover:bg-slate-700 transition-colors">
                <FiLogIn size={20} /> Login
              </Link>
              <Link
                to="/register"
                onClick={closeMenu}
                className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-lg font-bold mt-2 transition-colors w-full"
              >
                <FiUserPlus size={20} /> Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
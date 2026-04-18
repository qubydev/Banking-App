import React from 'react'
import { useState } from 'react';
import api from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom';
const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/api/auth/login', form);
      login({ username: res.data.username }, res.data.token);
      navigate('/dashboard');
    } catch (error) {
      setError(err.response?.data?.error || 'Login failed');
    }
  }
  return (
    /* h-screen + overflow-hidden prevents the vertical scroll bar */
    <div className="flex items-center justify-center  h-[calc(100vh-4.57rem)] w-full bg-slate-50 px-4 overflow-hidden">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100">

        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Welcome back
          </h2>
          <p className="text-sm text-slate-500">
            Please enter your details to sign in
          </p>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg text-center animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="">
            <label className="text-sm font-medium text-slate-700 ml-1">Username</label>
            <input
              name="username"
              type="text"
              placeholder="Enter your username"
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none transition-all focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 placeholder:text-slate-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 ml-1">Password</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none transition-all focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 placeholder:text-slate-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 transform active:scale-[0.98] shadow-lg shadow-indigo-200"
            disabled={loading}
          >
            {loading ? 'Logging in' : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-semibold text-indigo-600 hover:underline decoration-2 underline-offset-4"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login

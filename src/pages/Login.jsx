import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield, Eye, EyeOff, Terminal,
  Lock, User, AlertCircle, WifiOff
} from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { BASE_URL } from '../lib/axios';

function parseLoginError(err) {
  if (!err.response) {
    return {
      message: 'Cannot reach the server. Make sure the backend is running on port 8000.',
      type: 'network',
    };
  }
  const status = err.response.status;
  const data   = err.response.data;

  if (status === 429) return { message: 'Too many login attempts. Wait 15 minutes and try again.', type: 'rate' };
  if (status === 401 || status === 400) {
    return {
      message: data?.detail || data?.non_field_errors?.[0] || 'Invalid username or password.',
      type: 'auth',
    };
  }
  if (status >= 500) return { message: `Server error (${status}). Check backend logs.`, type: 'server' };
  return { message: 'Login failed. Please try again.', type: 'unknown' };
}

export default function Login() {
  const navigate = useNavigate();
  const { setTokens } = useAuthStore();

  const [form, setForm]               = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);  // { message, type }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await axios.post(
        `${BASE_URL}/api/token/`,
        form
      );
      setTokens(res.data.access, res.data.refresh, form.username);
      navigate('/dashboard');
    } catch (err) {
      setError(parseLoginError(err));
    } finally {
      setLoading(false);
    }
  };

  const isNetworkError = error?.type === 'network';

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">
      <div className="fixed inset-0 grid-bg opacity-40 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="relative bg-[#0d0d0f] border border-blue-500/20 rounded-xl overflow-hidden">
          <span className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-500/60" />
          <span className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-500/60" />
          <span className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-500/60" />
          <span className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-500/60" />

          {/* Header */}
          <div className="px-8 pt-8 pb-6 border-b border-[#1a1d26] text-center">
            <div className="relative inline-block mb-4">
              <Shield className="w-12 h-12 text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-widest">
              VULN<span className="text-blue-400">SPLOIT</span>
            </h1>
            <p className="text-gray-500 text-xs mt-1 tracking-widest">SECURE ACCESS TERMINAL</p>
          </div>

          {/* Network error banner */}
          {isNetworkError && (
            <div className="mx-8 mt-5 flex items-start gap-3 px-4 py-3 rounded-lg border border-yellow-500/30 bg-yellow-500/5 text-yellow-400 text-xs font-mono">
              <WifiOff className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">Backend not reachable</p>
                <p className="text-yellow-400/70">{error.message}</p>
                <p className="text-yellow-400/50 mt-1">
                  Run: <span className="text-yellow-300">docker compose up --build</span>
                </p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">

            {/* Username */}
            <div>
              <label className="block text-xs text-gray-500 tracking-widest mb-2 font-mono">
                USERNAME
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  required
                  autoComplete="username"
                  placeholder="admin"
                  className="w-full bg-[#050507] border border-[#1a1d26] rounded px-10 py-3 text-sm font-mono text-white placeholder-gray-700 focus:outline-none focus:border-blue-500/50 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs text-gray-500 tracking-widest mb-2 font-mono">
                PASSWORD
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full bg-[#050507] border border-[#1a1d26] rounded px-10 py-3 text-sm font-mono text-white placeholder-gray-700 focus:outline-none focus:border-blue-500/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-blue-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Auth / server error */}
            {error && !isNetworkError && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 px-3 py-2.5 rounded border border-red-500/30 bg-red-500/5 text-red-400 text-xs font-mono"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error.message}</span>
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white font-bold text-sm tracking-widest rounded hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading
                ? <><Terminal className="w-4 h-4 animate-spin" />AUTHENTICATING...</>
                : <><Lock className="w-4 h-4" />ACCESS SYSTEM</>
              }
            </button>

            <div className="text-center">
              <Link to="/" className="text-xs text-gray-600 hover:text-blue-400 transition-colors font-mono">
                ← Back to landing
              </Link>
              <span className="text-gray-700 mx-2 font-mono text-xs">·</span>
              <Link to="/register" className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-mono">
                Create account →
              </Link>
            </div>
          </form>

          <div className="px-8 py-3 bg-[#050507] border-t border-[#1a1d26]">
            <p className="text-xs text-gray-700 text-center font-mono">
              <span className="text-blue-400/50">$</span> New here?{' '}
              <Link to="/register" className="text-blue-400/70 hover:text-blue-400 transition-colors">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

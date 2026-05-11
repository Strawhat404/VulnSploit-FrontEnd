import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Eye, EyeOff, Terminal, Lock, User, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const navigate = useNavigate();
  const { setTokens } = useAuthStore();

  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/token/`,
        form
      );
      setTokens(res.data.access, res.data.refresh);
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.non_field_errors?.[0] ||
        'Authentication failed. Check credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">
      {/* Grid bg */}
      <div className="fixed inset-0 grid-bg opacity-40 pointer-events-none" />

      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div className="relative bg-[#0d0d0f] border border-blue-500/20 rounded-xl overflow-hidden">
          {/* Corner decorations */}
          <span className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-500/60" />
          <span className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-500/60" />
          <span className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-500/60" />
          <span className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-500/60" />

          {/* Header */}
          <div className="px-8 pt-8 pb-6 border-b border-[#1a1d26] text-center">
            <div className="relative inline-block mb-4">
              <Shield className="w-12 h-12 text-blue-400" />
              <div className="absolute inset-0 blur-md bg-blue-600/30 rounded-full" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-widest">
              VULN<span className="text-blue-400">SPLOIT</span>
            </h1>
            <p className="text-gray-500 text-xs mt-1 tracking-widest">SECURE ACCESS TERMINAL</p>
          </div>

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

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 px-3 py-2.5 rounded border border-red-500/30 bg-red-500/5 text-red-400 text-xs font-mono"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white font-bold text-sm tracking-widest rounded hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <>
                  <Terminal className="w-4 h-4 animate-spin" />
                  AUTHENTICATING...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  ACCESS SYSTEM
                </>
              )}
            </button>

            {/* Footer note */}
            <div className="text-center">
              <Link to="/" className="text-xs text-gray-600 hover:text-blue-400 transition-colors font-mono">
                ← Back to landing
              </Link>
            </div>
          </form>

          {/* Bottom bar */}
          <div className="px-8 py-3 bg-[#050507] border-t border-[#1a1d26]">
            <p className="text-xs text-gray-700 text-center font-mono">
              <span className="text-blue-400/50">$</span> Use Django admin credentials to authenticate
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

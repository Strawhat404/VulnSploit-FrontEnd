import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield, Eye, EyeOff, Terminal,
  Lock, User, AlertCircle, CheckCircle,
  UserPlus, WifiOff
} from 'lucide-react';
import api from '../lib/axios';

// Extract the most useful error message from any DRF error response
function parseError(err) {
  // Network error — backend not reachable
  if (!err.response) {
    return {
      message: 'Cannot reach the server. Make sure the backend is running on port 8000.',
      type: 'network',
    };
  }

  const status = err.response.status;
  const data   = err.response.data;

  // Rate limited
  if (status === 429) {
    return { message: 'Too many attempts. Please wait a few minutes and try again.', type: 'rate' };
  }

  // Server error
  if (status >= 500) {
    return { message: `Server error (${status}). Check backend logs.`, type: 'server' };
  }

  // Validation errors from DRF — pick the first field error
  if (data && typeof data === 'object') {
    // Field-level errors: { username: ['...'], password: ['...'] }
    for (const field of ['username', 'password', 'password2', 'non_field_errors', 'detail']) {
      if (data[field]) {
        const val = data[field];
        return { message: Array.isArray(val) ? val[0] : String(val), type: 'validation' };
      }
    }
    // Any other field
    const firstKey = Object.keys(data)[0];
    if (firstKey) {
      const val = data[firstKey];
      return {
        message: `${firstKey}: ${Array.isArray(val) ? val[0] : String(val)}`,
        type: 'validation',
      };
    }
  }

  return { message: 'Registration failed. Please try again.', type: 'unknown' };
}

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm]                   = useState({ username: '', password: '', password2: '' });
  const [showPassword, setShowPassword]   = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState(null);   // { message, type }
  const [success, setSuccess]             = useState('');

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  // Client-side validation before hitting the API
  const validate = () => {
    if (!form.username.trim()) return 'Username is required.';
    if (form.username.length < 3) return 'Username must be at least 3 characters.';
    if (!/^[a-zA-Z0-9_]+$/.test(form.username))
      return 'Username may only contain letters, numbers, and underscores.';
    if (form.password.length < 8) return 'Password must be at least 8 characters.';
    if (form.password !== form.password2) return 'Passwords do not match.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess('');

    const validationError = validate();
    if (validationError) {
      setError({ message: validationError, type: 'validation' });
      return;
    }

    setLoading(true);
    try {
      await api.post('/api/register/', {
        username:  form.username.trim(),
        password:  form.password,
        password2: form.password2,
      });
      setSuccess(`Account "${form.username}" created. Redirecting to login...`);
      setTimeout(() => navigate('/login'), 1800);
    } catch (err) {
      setError(parseError(err));
    } finally {
      setLoading(false);
    }
  };

  const isNetworkError = error?.type === 'network';

  return (
    <div className="min-h-screen bg-theme-base flex items-center justify-center px-4 relative overflow-hidden">
      <div className="fixed inset-0 grid-bg opacity-40 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="relative bg-theme-card border border-blue-500/20 rounded-xl overflow-hidden">
          {/* Corner decorations */}
          <span className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-500/60" />
          <span className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-500/60" />
          <span className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-500/60" />
          <span className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-500/60" />

          {/* Header */}
          <div className="px-8 pt-8 pb-6 border-b border-theme text-center">
            <div className="relative inline-block mb-4">
              <Shield className="w-12 h-12 text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-widest">
              VULN<span className="text-blue-400">SPLOIT</span>
            </h1>
            <p className="text-gray-500 text-xs mt-1 tracking-widest">CREATE YOUR ACCOUNT</p>
          </div>

          {/* Network error banner — shown above form */}
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
          <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">

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
                  onChange={handleChange('username')}
                  required
                  autoComplete="username"
                  placeholder="your_username"
                  className="w-full bg-theme-input border border-theme rounded px-10 py-3 text-sm font-mono text-white placeholder-gray-700 focus:outline-none focus:border-blue-500/50 transition-all"
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
                  onChange={handleChange('password')}
                  required
                  autoComplete="new-password"
                  placeholder="Min. 8 characters"
                  className="w-full bg-theme-input border border-theme rounded px-10 py-3 text-sm font-mono text-white placeholder-gray-700 focus:outline-none focus:border-blue-500/50 transition-all"
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

            {/* Confirm Password */}
            <div>
              <label className="block text-xs text-gray-500 tracking-widest mb-2 font-mono">
                CONFIRM PASSWORD
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input
                  type={showPassword2 ? 'text' : 'password'}
                  value={form.password2}
                  onChange={handleChange('password2')}
                  required
                  autoComplete="new-password"
                  placeholder="Repeat password"
                  className="w-full bg-theme-input border border-theme rounded px-10 py-3 text-sm font-mono text-white placeholder-gray-700 focus:outline-none focus:border-blue-500/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword2(!showPassword2)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-blue-400 transition-colors"
                >
                  {showPassword2 ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Validation / server error */}
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

            {/* Success */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 px-3 py-2.5 rounded border border-blue-500/30 bg-blue-500/5 text-blue-400 text-xs font-mono"
              >
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                {success}
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !!success}
              className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white font-bold text-sm tracking-widest rounded hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading
                ? <><Terminal className="w-4 h-4 animate-spin" />CREATING ACCOUNT...</>
                : <><UserPlus className="w-4 h-4" />CREATE ACCOUNT</>
              }
            </button>

            <div className="text-center pt-1">
              <span className="text-xs text-gray-600 font-mono">Already have an account? </span>
              <Link to="/login" className="text-xs text-blue-400 hover:text-blue-300 font-mono transition-colors">
                Sign in →
              </Link>
            </div>
          </form>

          <div className="px-8 py-3 bg-theme-input border-t border-theme">
            <p className="text-xs text-gray-700 text-center font-mono">
              <span className="text-blue-400/50">$</span> For authorized penetration testing only
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

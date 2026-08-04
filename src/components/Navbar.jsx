import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Sun, Moon, User, ChevronDown, LogOut, Settings } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';

// Navbar is only shown on authenticated pages as a slim top bar
// (logo hidden on desktop since sidebar has it; shown on mobile)
// On public pages (Landing/Login/Register) the page renders its own nav.
export default function Navbar() {
  const navigate  = useNavigate();
  const { logout, isAuthenticated, username } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    if (!userMenuOpen) return;
    const handler = () => setUserMenuOpen(false);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [userMenuOpen]);

  const handleLogout = () => { logout(); navigate('/login'); };

  if (!isAuthenticated) return null;

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 right-0 z-30 h-16 border-b border-theme bg-theme-nav backdrop-blur-md flex items-center px-4 gap-3"
      style={{ left: 0 }}
    >
      {/* Left spacer — on desktop, sidebar takes 256px so we push content right */}
      {/* On mobile the hamburger in Sidebar handles the menu */}
      <div className="md:hidden w-10 flex-shrink-0" /> {/* space for mobile hamburger */}

      {/* Logo — mobile only (desktop sidebar has it) */}
      <Link to="/dashboard" className="md:hidden flex items-center gap-2 flex-shrink-0">
        <Shield className="w-5 h-5 text-blue-400" />
        <span className="font-black text-sm tracking-widest">
          <span style={{ color: 'var(--text-base)' }}>VULN</span>
          <span className="text-blue-400">SPLOIT</span>
        </span>
      </Link>

      {/* Spacer */}
      <div className="flex-1" />

      {/* ── Right side controls ── */}
      <div className="flex items-center gap-2">

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded border hover:border-blue-500/30 text-gray-400 hover:text-blue-400 transition-all"
          style={{ borderColor: 'var(--border)' }}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark'
            ? <Sun className="w-4 h-4" />
            : <Moon className="w-4 h-4" />
          }
        </button>

        {/* Version badge */}
        <span className="hidden lg:flex items-center gap-1.5 text-xs text-gray-600 font-mono border border-theme rounded px-2 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          v1.0.0
        </span>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={(e) => { e.stopPropagation(); setUserMenuOpen(!userMenuOpen); }}
            className="flex items-center gap-2 px-3 py-2 rounded border border-theme hover:border-blue-500/30 text-gray-400 hover:text-blue-300 transition-all text-sm"
          >
            <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
              <User className="w-3 h-3 text-blue-400" />
            </div>
            <span className="hidden sm:inline text-xs font-mono text-blue-400/70">{username || 'user'}</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {userMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-44 bg-theme-card border border-theme rounded-lg overflow-hidden shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-3 py-2.5 border-b border-theme">
                  <p className="text-xs text-gray-500 font-mono">SIGNED IN AS</p>
                  <p className="text-xs text-blue-400 font-mono font-semibold mt-0.5">{username || 'user'}</p>
                </div>
                <Link
                  to="/settings"
                  className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-400 hover:text-blue-300 hover:bg-blue-500/5 transition-all font-mono"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-all font-mono"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
}

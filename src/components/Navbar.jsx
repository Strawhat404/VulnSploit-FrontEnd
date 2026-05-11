import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, History, LayoutDashboard, LogOut,
  Zap, Menu, X, User, ChevronDown
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/scan',      label: 'New Scan',  icon: Zap },
  { to: '/history',   label: 'History',   icon: History },
];

function isActive(pathname, to) {
  if (to === '/history') return pathname === '/history' || pathname.startsWith('/scans/');
  return pathname === to;
}

export default function Navbar() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { logout, isAuthenticated } = useAuthStore();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); setUserMenuOpen(false); }, [location.pathname]);

  // Close user menu on outside click
  useEffect(() => {
    if (!userMenuOpen) return;
    const handler = () => setUserMenuOpen(false);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [userMenuOpen]);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <>
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-[#1a1d26] bg-[#050507]/95 backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* ── Logo ── */}
            <Link
              to={isAuthenticated ? '/dashboard' : '/'}
              className="flex items-center gap-2.5 group flex-shrink-0"
            >
              <div className="relative">
                <Shield className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
                <div className="absolute inset-0 blur-sm bg-blue-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="font-black text-base tracking-widest">
                <span className="text-white">VULN</span>
                <span className="text-blue-400">SPLOIT</span>
              </span>
            </Link>

            {/* ── Desktop nav links (authenticated) ── */}
            {isAuthenticated && (
              <div className="hidden md:flex items-center gap-1">
                {navLinks.map(({ to, label, icon: Icon }) => {
                  const active = isActive(location.pathname, to);
                  return (
                    <Link
                      key={to}
                      to={to}
                      className={`relative flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-all duration-200 ${
                        active
                          ? 'text-blue-400 bg-blue-500/10'
                          : 'text-gray-400 hover:text-blue-300 hover:bg-blue-500/5'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                      {active && (
                        <motion.span
                          layoutId="nav-indicator"
                          className="absolute bottom-0 left-2 right-2 h-px bg-blue-400 rounded-full"
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            )}

            {/* ── Right side ── */}
            <div className="flex items-center gap-2">

              {/* Version badge — desktop only */}
              <span className="hidden lg:flex items-center gap-1.5 text-xs text-gray-700 font-mono border border-[#1a1d26] rounded px-2 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                v1.0.0
              </span>

              {/* Unauthenticated: Login button */}
              {!isAuthenticated && (
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-bold tracking-widest rounded hover:bg-blue-500 transition-all"
                >
                  <Shield className="w-4 h-4" />
                  <span className="hidden sm:inline">LOGIN</span>
                </Link>
              )}

              {/* Authenticated: User menu */}
              {isAuthenticated && (
                <div className="relative hidden md:block">
                  <button
                    onClick={(e) => { e.stopPropagation(); setUserMenuOpen(!userMenuOpen); }}
                    className="flex items-center gap-2 px-3 py-2 rounded border border-[#1a1d26] hover:border-blue-500/30 text-gray-400 hover:text-blue-300 transition-all text-sm"
                  >
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                      <User className="w-3 h-3 text-blue-400" />
                    </div>
                    <ChevronDown className={`w-3 h-3 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-44 bg-[#0d0d0f] border border-[#1a1d26] rounded-lg overflow-hidden shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="px-3 py-2.5 border-b border-[#1a1d26]">
                          <p className="text-xs text-gray-500 font-mono">SIGNED IN AS</p>
                          <p className="text-xs text-blue-400 font-mono font-semibold mt-0.5">admin</p>
                        </div>
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
              )}

              {/* Mobile hamburger */}
              {isAuthenticated && (
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="md:hidden p-2 rounded border border-[#1a1d26] text-gray-400 hover:text-blue-400 hover:border-blue-500/30 transition-all"
                >
                  {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ── Mobile menu drawer ── */}
      <AnimatePresence>
        {mobileOpen && isAuthenticated && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-[#0a0a0c] border-l border-[#1a1d26] flex flex-col md:hidden"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#1a1d26]">
                <span className="font-black text-sm tracking-widest">
                  <span className="text-white">VULN</span>
                  <span className="text-blue-400">SPLOIT</span>
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded text-gray-500 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer links */}
              <nav className="flex-1 px-3 py-4 space-y-1">
                {navLinks.map(({ to, label, icon: Icon }, i) => {
                  const active = isActive(location.pathname, to);
                  return (
                    <motion.div
                      key={to}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                    >
                      <Link
                        to={to}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                          active
                            ? 'text-blue-400 bg-blue-500/10 border border-blue-500/20'
                            : 'text-gray-400 hover:text-blue-300 hover:bg-blue-500/5'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {label}
                        {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Drawer footer */}
              <div className="px-3 py-4 border-t border-[#1a1d26] space-y-2">
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-blue-500/5 border border-blue-500/10">
                  <div className="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-mono">SIGNED IN AS</p>
                    <p className="text-xs text-blue-400 font-mono font-semibold">admin</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-all font-mono"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

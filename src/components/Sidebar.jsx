import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, LayoutDashboard, Zap, Radar, History,
  FileText, Clock, Target, Settings, LogOut, User,
  ChevronLeft, ChevronRight, Menu, X
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard',   icon: LayoutDashboard, group: 'main' },
  { to: '/targets',   label: 'Targets',     icon: Target,          group: 'main' },
  { to: '/scan',      label: 'New Scan',    icon: Zap,             group: 'scan' },
  { to: '/recon/new', label: 'Full Recon',  icon: Radar,           group: 'scan' },
  { to: '/schedule',  label: 'Schedule',    icon: Clock,           group: 'scan' },
  { to: '/history',   label: 'History',     icon: History,         group: 'results' },
  { to: '/reports',   label: 'Reports',     icon: FileText,        group: 'results' },
];

const groups = [
  { key: 'main',    label: 'OVERVIEW' },
  { key: 'scan',    label: 'SCANNING' },
  { key: 'results', label: 'RESULTS' },
];

function isActive(pathname, to) {
  if (to === '/history')   return pathname === '/history' || pathname.startsWith('/scans/');
  if (to === '/reports')   return pathname === '/reports' || pathname.startsWith('/reports/') || pathname.startsWith('/recon/');
  if (to === '/recon/new') return pathname === '/recon/new';
  return pathname === to;
}

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, username } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const handleLogout = () => { logout(); navigate('/login'); };

  const SidebarContent = ({ isMobile = false }) => (
    <div className={`flex flex-col h-full ${isMobile ? 'w-72' : collapsed ? 'w-16' : 'w-64'} transition-all duration-300`}>

      {/* ── Logo ── */}
      <div className={`flex items-center h-16 px-4 border-b border-theme flex-shrink-0 ${collapsed && !isMobile ? 'justify-center' : 'justify-between'}`}>
        <Link to="/dashboard" className="flex items-center gap-2.5 group min-w-0">
          <div className="relative flex-shrink-0">
            <Shield className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
          </div>
          {(!collapsed || isMobile) && (
            <span className="font-black text-base tracking-widest truncate">
              <span style={{ color: 'var(--text-base)' }}>VULN</span>
              <span className="text-blue-400">SPLOIT</span>
            </span>
          )}
        </Link>
        {!isMobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded hover:bg-blue-500/10 text-gray-500 hover:text-blue-400 transition-all flex-shrink-0"
          >
            {collapsed
              ? <ChevronRight className="w-4 h-4" />
              : <ChevronLeft className="w-4 h-4" />
            }
          </button>
        )}
        {isMobile && (
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded text-gray-500 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* ── Nav links grouped ── */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {groups.map((group) => {
          const links = navLinks.filter((l) => l.group === group.key);
          return (
            <div key={group.key} className="mb-4">
              {(!collapsed || isMobile) && (
                <p className="text-xs text-gray-600 font-mono tracking-widest px-4 mb-1">
                  {group.label}
                </p>
              )}
              {links.map(({ to, label, icon: Icon }) => {
                const active = isActive(location.pathname, to);
                return (
                  <Link
                    key={to}
                    to={to}
                    title={collapsed && !isMobile ? label : undefined}
                    className={`relative flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                      active
                        ? 'text-blue-400 bg-blue-500/10'
                        : 'text-gray-400 hover:text-blue-300 hover:bg-blue-500/5'
                    } ${collapsed && !isMobile ? 'justify-center' : ''}`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {(!collapsed || isMobile) && (
                      <span className="truncate">{label}</span>
                    )}
                    {active && (!collapsed || isMobile) && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                    )}
                    {active && collapsed && !isMobile && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-400 rounded-r" />
                    )}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* ── Footer: user + settings + logout ── */}
      <div className={`border-t border-theme p-3 flex-shrink-0 space-y-1`}>
        {/* Settings link */}
        <Link
          to="/settings"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-blue-300 hover:bg-blue-500/5 transition-all ${collapsed && !isMobile ? 'justify-center' : ''}`}
          title={collapsed && !isMobile ? 'Settings' : undefined}
        >
          <Settings className="w-4 h-4 flex-shrink-0" />
          {(!collapsed || isMobile) && <span className="font-medium">Settings</span>}
        </Link>

        {/* User info */}
        {(!collapsed || isMobile) && (
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-500/5 border border-blue-500/10">
            <div className="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
              <User className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500 font-mono">SIGNED IN AS</p>
              <p className="text-xs text-blue-400 font-mono font-semibold truncate">{username || 'user'}</p>
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-all ${collapsed && !isMobile ? 'justify-center' : ''}`}
          title={collapsed && !isMobile ? 'Logout' : undefined}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {(!collapsed || isMobile) && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 64 : 256 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="hidden md:flex flex-col fixed top-0 left-0 h-screen bg-theme-card border-r border-theme z-40 overflow-hidden"
      >
        <SidebarContent />
      </motion.aside>

      {/* ── Mobile: hamburger button ── */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded border border-theme bg-theme-card text-gray-400 hover:text-blue-400 transition-all"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* ── Mobile: drawer overlay ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed top-0 left-0 bottom-0 z-50 bg-theme-card border-r border-theme md:hidden overflow-hidden"
            >
              <SidebarContent isMobile />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

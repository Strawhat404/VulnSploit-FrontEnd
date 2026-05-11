import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Terminal, ArrowLeft, Home } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function NotFound() {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">
      {/* Grid bg */}
      <div className="fixed inset-0 grid-bg opacity-30 pointer-events-none" />

      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center max-w-lg">
        {/* Glitchy 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <span className="text-[120px] md:text-[160px] font-black text-blue-500/10 leading-none select-none">
              404
            </span>
            <motion.span
              animate={{ opacity: [1, 0.4, 1, 0.7, 1] }}
              transition={{ repeat: Infinity, duration: 3, times: [0, 0.2, 0.4, 0.6, 1] }}
              className="absolute inset-0 flex items-center justify-center text-[120px] md:text-[160px] font-black text-blue-400/20 leading-none select-none"
              style={{ textShadow: '2px 0 #3b82f6, -2px 0 #06b6d4' }}
            >
              404
            </motion.span>
          </div>
        </motion.div>

        {/* Terminal block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 rounded-lg overflow-hidden border border-[#1a1d26] bg-[#0d0d0f]"
        >
          <div className="flex items-center gap-2 px-4 py-2.5 bg-[#252830] border-b border-[#1a1d26]">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500/60" />
            </div>
            <Terminal className="w-3 h-3 text-blue-400 ml-1" />
            <span className="text-xs text-gray-600 font-mono">bash</span>
          </div>
          <div className="p-5 font-mono text-sm space-y-1.5 text-left">
            <p className="text-blue-400">$ navigate --to current-path</p>
            <p className="text-red-400">Error: Route not found (404)</p>
            <p className="text-gray-500">The requested path does not exist.</p>
            <p className="text-gray-600">
              <span className="text-blue-400/60">$</span>{' '}
              <span className="text-gray-500">Suggestion: check the URL or go back home</span>
            </p>
            <p className="text-gray-700">
              <span className="inline-block w-2 h-4 bg-blue-400 animate-blink align-middle" />
            </p>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-5 py-2.5 border border-[#1a1d26] text-gray-400 hover:text-blue-300 hover:border-blue-500/30 text-sm font-mono rounded transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          <Link
            to={isAuthenticated ? '/dashboard' : '/'}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white hover:bg-blue-500 text-sm font-bold tracking-widest rounded transition-all"
          >
            <Home className="w-4 h-4" />
            {isAuthenticated ? 'DASHBOARD' : 'HOME'}
          </Link>
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-xs text-gray-700 font-mono"
        >
          <Shield className="w-3 h-3 inline mr-1 text-blue-500/30" />
          VULNSPLOIT — AUTHORIZED USE ONLY
        </motion.p>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Globe, Terminal, Zap, AlertTriangle, Shield,
  Network, Search, Bug, Activity, Code2, WifiOff
} from 'lucide-react';
import { useFullRecon } from '../hooks/useRecon';

const TOOLS = [
  { icon: Search,   label: 'Subfinder',  desc: 'Passive subdomain enumeration',         color: 'text-cyan-400' },
  { icon: Code2,    label: 'WhatWeb',    desc: 'Technology fingerprinting',              color: 'text-blue-400' },
  { icon: Network,  label: 'Nmap',       desc: 'Port scanning & service detection',      color: 'text-blue-400' },
  { icon: Shield,   label: 'Nikto',      desc: 'Web server vulnerability scan',          color: 'text-cyan-400' },
  { icon: Search,   label: 'Gobuster',   desc: 'Directory & file brute-forcing',         color: 'text-amber-400' },
  { icon: Activity, label: 'Nuclei',     desc: 'Template-based vulnerability detection', color: 'text-blue-400' },
  { icon: Bug,      label: 'SQLMap',     desc: 'SQL injection detection',                color: 'text-red-400' },
];

function parseError(err) {
  if (!err.response) return { message: 'Cannot reach the server. Make sure the backend is running.', type: 'network' };
  const data = err.response?.data;
  if (data?.detail) return { message: data.detail, type: 'api' };
  return { message: 'Failed to launch recon. Try again.', type: 'unknown' };
}

export default function FullRecon() {
  const navigate = useNavigate();
  const { mutateAsync: launchRecon, isLoading } = useFullRecon();

  const [target, setTarget] = useState('');
  const [error, setError]   = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!target.trim()) return;
    setError(null);

    try {
      const session = await launchRecon({ target: target.trim() });
      navigate(`/recon/${session.id}`);
    } catch (err) {
      setError(parseError(err));
    }
  };

  return (
    <div className="min-h-screen bg-black pt-20 pb-12 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 text-xs text-gray-600 font-mono mb-1">
            <Terminal className="w-3 h-3 text-blue-400" />
            <span>root@vulnsploit:~$ full-recon</span>
          </div>
          <h1 className="text-2xl font-bold text-white">
            FULL <span className="text-blue-400">RECON</span>
          </h1>
          <p className="text-gray-500 text-sm font-mono mt-1">
            Runs all 7 tools automatically and generates a PDF report
          </p>
        </motion.div>

        {/* Tools that will run */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-5 rounded-lg bg-[#0d0d0f] border border-[#1a1d26] mb-6"
        >
          <div className="text-xs text-gray-500 tracking-widest font-mono mb-4">
            TOOLS THAT WILL RUN IN SEQUENCE
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {TOOLS.map((tool, i) => (
              <motion.div
                key={tool.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="flex items-center gap-2 px-3 py-2.5 rounded border border-[#1a1d26] bg-black"
              >
                <div className="flex items-center justify-center w-6 h-6 rounded bg-[#0d0d0f] border border-[#1a1d26] flex-shrink-0">
                  <span className="text-xs text-gray-500 font-mono">{i + 1}</span>
                </div>
                <div>
                  <p className={`text-xs font-mono font-semibold ${tool.color}`}>{tool.label}</p>
                  <p className="text-xs text-gray-600 leading-tight">{tool.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-gray-600 font-mono">
            <Activity className="w-3 h-3 text-amber-400" />
            <span>Estimated time: 15-40 minutes depending on target</span>
          </div>
        </motion.div>

        {/* Target input */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div className="p-5 rounded-lg bg-[#0d0d0f] border border-[#1a1d26]">
            <label className="block text-xs text-gray-500 tracking-widest font-mono mb-3">
              TARGET
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input
                type="text"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="example.com  |  192.168.1.1"
                required
                className="w-full bg-[#050507] border border-[#1a1d26] rounded px-10 py-3 text-sm font-mono text-white placeholder-gray-700 focus:outline-none focus:border-blue-500/50 transition-all"
              />
            </div>
            <p className="text-xs text-gray-700 mt-2 font-mono">
              Domain or IP address. A PDF report will be auto-generated when all scans complete.
            </p>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-3 px-4 py-3 rounded border border-yellow-500/20 bg-yellow-500/5 text-xs font-mono text-yellow-500/70">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>Only scan systems you own or have explicit written permission to test. Unauthorized scanning is illegal.</span>
          </div>

          {/* Network error */}
          {error?.type === 'network' && (
            <div className="flex items-start gap-3 px-4 py-3 rounded border border-yellow-500/30 bg-yellow-500/5 text-yellow-400 text-xs font-mono">
              <WifiOff className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">Backend not reachable</p>
                <p className="text-yellow-400/70">{error.message}</p>
              </div>
            </div>
          )}

          {/* Other errors */}
          {error && error.type !== 'network' && (
            <div className="flex items-center gap-2 px-4 py-3 rounded border border-red-500/30 bg-red-500/5 text-red-400 text-xs font-mono">
              <Shield className="w-4 h-4" />
              {error.message}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading || !target.trim()}
            className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 text-white font-bold text-sm tracking-widest rounded hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <><Terminal className="w-4 h-4 animate-spin" />LAUNCHING RECON...</>
            ) : (
              <><Zap className="w-4 h-4" />LAUNCH FULL RECON</>
            )}
          </button>
        </motion.form>
      </div>
    </div>
  );
}

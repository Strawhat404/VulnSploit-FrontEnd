import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Zap, Terminal, Globe, Bug, Search, Network,
  Activity, Shield, AlertTriangle, ChevronRight, Layers
} from 'lucide-react';
import { useCreateScan } from '../hooks/useScans';
import { useCreateSession } from '../hooks/useReports';

const BORDER  = 'border-[#1a1d26]';
const CARD_BG = 'bg-[#0d0d0f]';

const scanTypes = [
  {
    category: 'FULL RECON',
    color: 'text-blue-400',
    border: 'border-blue-500/30',
    bg: 'bg-blue-500/8',
    icon: Layers,
    isFull: true,
    types: [
      {
        value: 'full_recon',
        label: 'Full Recon',
        desc: 'Runs ALL tools automatically: Subfinder → WhatWeb → Nmap → Nikto → Gobuster → Nuclei → SQLMap. Generates a PDF report.',
        badge: 'RECOMMENDED',
      },
    ],
  },
  {
    category: 'NMAP',
    color: 'text-blue-400',
    border: 'border-blue-500/20',
    bg: 'bg-blue-500/5',
    icon: Network,
    types: [
      { value: 'quick',          label: 'Quick Scan',    desc: 'Fast scan of common ports (-T4 -F)' },
      { value: 'full',           label: 'Full Scan',     desc: 'All ports with service version (-sV -p-)' },
      { value: 'stealth',        label: 'Stealth SYN',   desc: 'SYN scan, less detectable (-sS)' },
      { value: 'aggressive',     label: 'Aggressive',    desc: 'OS, version, scripts, traceroute (-A)' },
      { value: 'vuln',           label: 'Vuln Scripts',  desc: 'Run NSE vulnerability scripts' },
      { value: 'os_detection',   label: 'OS Detection',  desc: 'Detect operating system (-O)' },
      { value: 'udp',            label: 'UDP Scan',      desc: 'Scan UDP ports (-sU)' },
      { value: 'ping_sweep',     label: 'Ping Sweep',    desc: 'Host discovery only (-sn)' },
    ],
  },
  {
    category: 'WEB',
    color: 'text-cyan-400',
    border: 'border-cyan-500/20',
    bg: 'bg-cyan-500/5',
    icon: Globe,
    types: [
      { value: 'nikto',    label: 'Nikto',         desc: 'Web server vulnerability scanner' },
      { value: 'gobuster', label: 'Gobuster',       desc: 'Directory & file brute-forcing' },
      { value: 'whatweb',  label: 'WhatWeb',        desc: 'Web technology fingerprinting' },
      { value: 'wpscan',   label: 'WPScan',         desc: 'WordPress vulnerability scanner' },
      { value: 'headers',  label: 'Headers Check',  desc: 'HTTP security headers misconfiguration check' },
      { value: 'testssl',  label: 'TestSSL',        desc: 'SSL/TLS misconfiguration & vulnerability scan' },
    ],
  },
  {
    category: 'EXPLOIT',
    color: 'text-red-400',
    border: 'border-red-500/20',
    bg: 'bg-red-500/5',
    icon: Bug,
    types: [
      { value: 'sqlmap', label: 'SQLMap', desc: 'SQL injection detection & exploitation' },
    ],
  },
  {
    category: 'RECON',
    color: 'text-amber-400',
    border: 'border-amber-500/20',
    bg: 'bg-amber-500/5',
    icon: Search,
    types: [
      { value: 'subfinder', label: 'Subfinder', desc: 'Passive subdomain enumeration' },
      { value: 'nuclei',    label: 'Nuclei',    desc: 'Template-based vulnerability scanning' },
    ],
  },
];

export default function NewScan() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { mutateAsync: createScan,    isLoading: scanLoading }    = useCreateScan();
  const { mutateAsync: createSession, isLoading: sessionLoading } = useCreateSession();

  const [target, setTarget]           = useState('');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || '');
  const [error, setError]             = useState('');

  const isLoading = scanLoading || sessionLoading;
  const isFullRecon = selectedType === 'full_recon';

  useEffect(() => {
    const t = searchParams.get('type');
    if (t) setSelectedType(t);
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!target.trim()) return setError('Target is required.');
    if (!selectedType)  return setError('Select a scan type.');
    setError('');

    try {
      if (isFullRecon) {
        // Full recon — creates a ReconSession
        const session = await createSession({ target: target.trim() });
        navigate(`/recon/${session.id}`);
      } else {
        // Individual scan
        const scan = await createScan({ target: target.trim(), scan_type: selectedType });
        navigate(`/scans/${scan.id}`);
      }
    } catch (err) {
      const data = err.response?.data;
      setError(data?.detail || data?.target?.[0] || data?.scan_type?.[0] || 'Failed to launch scan.');
    }
  };

  const selectedInfo = scanTypes
    .flatMap((c) => c.types)
    .find((t) => t.value === selectedType);

  return (
    <div className="min-h-screen bg-black pt-20 pb-12 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 text-xs text-gray-600 font-mono mb-1">
            <Terminal className="w-3 h-3 text-blue-400" />
            <span>root@vulnsploit:~$ new-scan</span>
          </div>
          <h1 className="text-2xl font-bold text-white">
            LAUNCH <span className="text-blue-400">SCAN</span>
          </h1>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Target input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`p-5 rounded-lg ${CARD_BG} border ${BORDER}`}
          >
            <label className="block text-xs text-gray-500 tracking-widest font-mono mb-3">
              TARGET
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input
                type="text"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="example.com  |  192.168.1.1  |  https://target.com"
                className={`w-full bg-[#050507] border ${BORDER} rounded px-10 py-3 text-sm font-mono text-white placeholder-gray-700 focus:outline-none focus:border-blue-500/50 transition-all`}
              />
            </div>
            <p className="text-xs text-gray-700 mt-2 font-mono">
              Domain, IP address, or full URL depending on scan type
            </p>
          </motion.div>

          {/* Scan type selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="text-xs text-gray-500 tracking-widest font-mono mb-3">SCAN TYPE</div>
            <div className="space-y-4">
              {scanTypes.map((category) => (
                <div key={category.category}>
                  <div className={`flex items-center gap-2 text-xs font-mono tracking-widest mb-2 ${category.color}`}>
                    <category.icon className="w-3 h-3" />
                    {category.category}
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {category.types.map((type) => {
                      const active = selectedType === type.value;
                      return (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setSelectedType(type.value)}
                          className={`text-left px-4 py-3 rounded border transition-all duration-200 ${
                            active
                              ? `${category.border} ${category.bg} ${category.color}`
                              : `${BORDER} ${CARD_BG} text-gray-400 hover:border-blue-500/20 hover:bg-blue-500/5`
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-semibold font-mono">{type.label}</span>
                            <div className="flex items-center gap-1">
                              {type.badge && (
                                <span className="text-xs px-1.5 py-0.5 rounded bg-blue-600 text-white font-bold">
                                  {type.badge}
                                </span>
                              )}
                              {active && <ChevronRight className="w-3 h-3" />}
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed">{type.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Selected summary */}
          {selectedType && selectedInfo && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center gap-3 px-4 py-3 rounded border border-blue-500/20 bg-blue-500/5 text-xs font-mono`}
            >
              <Activity className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <span className="text-gray-400">Selected:</span>
              <span className="text-blue-400 font-semibold">{selectedInfo.label}</span>
              {isFullRecon && (
                <span className="text-gray-500 ml-1">— PDF report will be generated automatically</span>
              )}
            </motion.div>
          )}

          {/* Warning */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-start gap-3 px-4 py-3 rounded border border-yellow-500/20 bg-yellow-500/5 text-xs font-mono text-yellow-500/70"
          >
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>Only scan systems you own or have explicit written permission to test. Unauthorized scanning is illegal.</span>
          </motion.div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 px-4 py-3 rounded border border-red-500/30 bg-red-500/5 text-red-400 text-xs font-mono"
            >
              <Shield className="w-4 h-4" />
              {error}
            </motion.div>
          )}

          {/* Submit */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            type="submit"
            disabled={isLoading || !target || !selectedType}
            className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 text-white font-bold text-sm tracking-widest rounded hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <><Terminal className="w-4 h-4 animate-spin" />QUEUING...</>
            ) : isFullRecon ? (
              <><Layers className="w-4 h-4" />LAUNCH FULL RECON</>
            ) : (
              <><Zap className="w-4 h-4" />LAUNCH SCAN</>
            )}
          </motion.button>
        </form>
      </div>
    </div>
  );
}

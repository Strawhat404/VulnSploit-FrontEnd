import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  History as HistoryIcon, Search, Terminal,
  ArrowRight, Filter, Calendar, Target
} from 'lucide-react';
import { useScans } from '../hooks/useScans';
import StatusBadge, { getScanStatus } from '../components/StatusBadge';

const ALL_TYPES = 'all';

export default function History() {
  const { data: scans = [], isLoading } = useScans();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState(ALL_TYPES);
  const [filterStatus, setFilterStatus] = useState(ALL_TYPES);

  // Unique scan types for filter
  const scanTypes = [...new Set(scans.map((s) => s.scan_type))].sort();

  const filtered = scans.filter((scan) => {
    const matchSearch =
      !search ||
      scan.target.toLowerCase().includes(search.toLowerCase()) ||
      scan.scan_type.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === ALL_TYPES || scan.scan_type === filterType;
    const matchStatus = filterStatus === ALL_TYPES || getScanStatus(scan.result) === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  return (
    <div className="min-h-screen bg-black pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-600 font-mono mb-1">
              <Terminal className="w-3 h-3 text-blue-400" />
              <span>root@vulnsploit:~$ scan-history</span>
            </div>
            <h1 className="text-2xl font-bold text-white">
              SCAN <span className="text-blue-400">HISTORY</span>
            </h1>
          </div>
          <Link
            to="/scan"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-bold tracking-widest rounded hover:bg-blue-500 transition-all"
          >
            + NEW SCAN
          </Link>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-3 mb-6"
        >
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search target or scan type..."
              className="w-full bg-[#0d0d0f] border border-[#1a1d26] rounded px-10 py-2.5 text-sm font-mono text-white placeholder-gray-700 focus:outline-none focus:border-blue-500/35 transition-all"
            />
          </div>

          {/* Type filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-600" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-[#0d0d0f] border border-[#1a1d26] rounded pl-8 pr-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-blue-500/35 transition-all appearance-none cursor-pointer"
            >
              <option value={ALL_TYPES}>All Types</option>
              {scanTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#0d0d0f] border border-[#1a1d26] rounded px-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-blue-500/35 transition-all appearance-none cursor-pointer"
          >
            <option value={ALL_TYPES}>All Status</option>
            <option value="completed">Completed</option>
            <option value="running">Running</option>
            <option value="error">Error</option>
          </select>
        </motion.div>

        {/* Count */}
        <div className="text-xs text-gray-600 font-mono mb-4">
          {filtered.length} scan{filtered.length !== 1 ? 's' : ''} found
        </div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-lg bg-[#0d0d0f] border border-[#1a1d26] overflow-hidden"
        >
          {/* Table header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 border-b border-[#1a1d26] text-xs text-gray-600 font-mono tracking-widest">
            <span className="col-span-1">#</span>
            <span className="col-span-4">TARGET</span>
            <span className="col-span-2">TYPE</span>
            <span className="col-span-2">STATUS</span>
            <span className="col-span-2">DATE</span>
            <span className="col-span-1" />
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-gray-600 font-mono text-sm">
              <Terminal className="w-5 h-5 text-blue-400/30 mx-auto mb-2 animate-spin" />
              Loading scan history...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-gray-600 font-mono text-sm">
              {scans.length === 0
                ? <>No scans yet. <Link to="/scan" className="text-blue-400 hover:underline">Launch your first scan →</Link></>
                : 'No scans match your filters.'}
            </div>
          ) : (
            <div className="divide-y divide-[#1a1d26]">
              {filtered.map((scan, i) => (
                <motion.div
                  key={scan.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Link
                    to={`/scans/${scan.id}`}
                    className="flex md:grid md:grid-cols-12 gap-4 items-center px-5 py-4 hover:bg-blue-500/5 transition-colors group"
                  >
                    <span className="col-span-1 text-xs text-gray-600 font-mono">#{scan.id}</span>
                    <div className="col-span-4 min-w-0">
                      <div className="flex items-center gap-2">
                        <Target className="w-3 h-3 text-gray-600 flex-shrink-0" />
                        <span className="text-sm text-white font-mono truncate">{scan.target}</span>
                      </div>
                    </div>
                    <span className="col-span-2 text-xs text-cyan-400 font-mono">{scan.scan_type}</span>
                    <div className="col-span-2">
                      <StatusBadge result={scan.result} />
                    </div>
                    <div className="col-span-2 flex items-center gap-1.5 text-xs text-gray-600 font-mono">
                      <Calendar className="w-3 h-3" />
                      {new Date(scan.created_at).toLocaleDateString()}
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <ArrowRight className="w-4 h-4 text-gray-700 group-hover:text-blue-400 transition-colors" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

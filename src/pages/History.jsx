import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, Terminal, ArrowRight,
  Filter, Calendar, Target, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useScans, useScansMeta } from '../hooks/useScans';
import StatusBadge from '../components/StatusBadge';

const ALL = 'all';

export default function History() {
  const [page, setPage]             = useState(1);
  const [search, setSearch]         = useState('');
  const [filterType, setFilterType] = useState(ALL);
  const [filterStatus, setFilterStatus] = useState(ALL);

  const { data: scans = [], isLoading } = useScans(page);
  const { data: meta }                  = useScansMeta(page);

  const totalPages = meta ? Math.ceil(meta.count / 20) : 1;

  // Unique scan types from current page for the filter dropdown
  const scanTypes = [...new Set(scans.map((s) => s.scan_type))].sort();

  const filtered = scans.filter((scan) => {
    const matchSearch =
      !search ||
      scan.target.toLowerCase().includes(search.toLowerCase()) ||
      scan.scan_type.toLowerCase().includes(search.toLowerCase());
    const matchType   = filterType   === ALL || scan.scan_type === filterType;
    const matchStatus = filterStatus === ALL || scan.status    === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  return (
    <div className="min-h-screen bg-theme-base pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <div className="flex items-center gap-2 text-xs text-theme-faint font-mono mb-1">
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

        {/* ── Filters ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-3 mb-6"
        >
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search target or scan type..."
              className="w-full bg-theme-card border border-theme rounded px-10 py-2.5 text-sm font-mono text-white placeholder-gray-700 focus:outline-none focus:border-blue-500/35 transition-all"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-600" />
            <select
              value={filterType}
              onChange={(e) => { setFilterType(e.target.value); setPage(1); }}
              className="bg-theme-card border border-theme rounded pl-8 pr-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-blue-500/35 transition-all appearance-none cursor-pointer"
            >
              <option value={ALL}>All Types</option>
              {scanTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
            className="bg-theme-card border border-theme rounded px-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-blue-500/35 transition-all appearance-none cursor-pointer"
          >
            <option value={ALL}>All Status</option>
            <option value="completed">Completed</option>
            <option value="running">Running</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </motion.div>

        {/* ── Count ── */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-theme-faint font-mono">
            {meta ? `${meta.count} total scan${meta.count !== 1 ? 's' : ''}` : `${filtered.length} scans`}
          </span>
          {totalPages > 1 && (
            <span className="text-xs text-theme-faint font-mono">
              Page {page} of {totalPages}
            </span>
          )}
        </div>

        {/* ── Table ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-lg bg-theme-card border border-theme overflow-hidden"
        >
          <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 border-b border-theme text-xs text-theme-faint font-mono tracking-widest">
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
                ? <><span>No scans yet. </span><Link to="/scan" className="text-blue-400 hover:underline">Launch your first scan →</Link></>
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
                    <span className="col-span-1 text-xs text-theme-faint font-mono">#{scan.id}</span>
                    <div className="col-span-4 min-w-0">
                      <div className="flex items-center gap-2">
                        <Target className="w-3 h-3 text-gray-600 flex-shrink-0" />
                        <span className="text-sm text-white font-mono truncate">{scan.target}</span>
                      </div>
                    </div>
                    <span className="col-span-2 text-xs text-cyan-400 font-mono">{scan.scan_type}</span>
                    <div className="col-span-2">
                      <StatusBadge scan={scan} />
                    </div>
                    <div className="col-span-2 flex items-center gap-1.5 text-xs text-theme-faint font-mono">
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

        {/* ── Pagination controls ── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1.5 px-4 py-2 rounded border border-theme text-sm font-mono text-gray-400 hover:text-blue-400 hover:border-blue-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              Prev
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded text-xs font-mono transition-all ${
                      p === page
                        ? 'bg-blue-600 text-white'
                        : 'border border-theme text-gray-500 hover:text-blue-400 hover:border-blue-500/30'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-1.5 px-4 py-2 rounded border border-theme text-sm font-mono text-gray-400 hover:text-blue-400 hover:border-blue-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

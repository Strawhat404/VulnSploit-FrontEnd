import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Terminal, ChevronRight, RefreshCw,
  FileText, CheckCircle, Loader2, XCircle, Clock, Zap
} from 'lucide-react';
import { useReconSession } from '../hooks/useRecon';
import StatusBadge from '../components/StatusBadge';

const TOOL_ORDER = ['subfinder', 'whatweb', 'testssl', 'headers', 'quick', 'nikto', 'gobuster', 'nuclei', 'sqlmap'];

const TOOL_LABELS = {
  subfinder: 'Subfinder',
  whatweb:   'WhatWeb',
  testssl:   'TestSSL',
  headers:   'Headers Check',
  quick:     'Nmap Quick',
  nikto:     'Nikto',
  gobuster:  'Gobuster',
  nuclei:    'Nuclei',
  sqlmap:    'SQLMap',
};

function ToolRow({ scan, index }) {
  const statusIcon = {
    pending:   <Clock className="w-4 h-4 text-gray-600" />,
    running:   <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />,
    completed: <CheckCircle className="w-4 h-4 text-blue-400" />,
    failed:    <XCircle className="w-4 h-4 text-red-400" />,
  };

  const statusColor = {
    pending:   'text-gray-600',
    running:   'text-cyan-400',
    completed: 'text-blue-400',
    failed:    'text-red-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center gap-4 px-5 py-3.5 border-b border-[#1a1d26] last:border-0"
    >
      <span className="text-xs text-gray-600 font-mono w-5">{index + 1}</span>
      <div className="flex-shrink-0">{statusIcon[scan?.status] || statusIcon.pending}</div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-mono font-semibold ${statusColor[scan?.status] || 'text-gray-600'}`}>
          {TOOL_LABELS[scan?.scan_type] || scan?.scan_type || TOOL_LABELS[TOOL_ORDER[index]]}
        </p>
        {scan?.status === 'running' && (
          <p className="text-xs text-gray-600 font-mono">Running...</p>
        )}
        {scan?.status === 'completed' && scan?.completed_at && (
          <p className="text-xs text-gray-600 font-mono">
            Completed {new Date(scan.completed_at).toLocaleTimeString()}
          </p>
        )}
        {scan?.status === 'failed' && (
          <p className="text-xs text-red-400/70 font-mono truncate">{scan?.result}</p>
        )}
      </div>
      {scan?.id && scan?.status === 'completed' && (
        <Link
          to={`/scans/${scan.id}`}
          className="text-xs text-blue-400/60 hover:text-blue-400 font-mono transition-colors flex-shrink-0"
        >
          View →
        </Link>
      )}
    </motion.div>
  );
}

export default function ReconDetail() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const { data: session, isLoading, refetch, isFetching } = useReconSession(id);

  const isRunning  = session?.status === 'running' || session?.status === 'pending';
  const completed  = session?.completed_scans || 0;
  const total      = session?.total_scans || TOOL_ORDER.length;
  const progress   = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Map scans by scan_type for display
  const scanMap = {};
  (session?.scans || []).forEach(s => { scanMap[s.scan_type] = s; });

  return (
    <div className="min-h-screen bg-black pt-20 pb-12 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-1.5 text-xs font-mono text-gray-600 mb-6"
        >
          <Link to="/dashboard" className="hover:text-blue-400 transition-colors">Dashboard</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/recon/new" className="hover:text-blue-400 transition-colors">Full Recon</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-blue-400">Session #{id}</span>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-24 text-gray-600 font-mono text-sm">
            <Terminal className="w-5 h-5 text-blue-400/30 animate-spin mr-3" />
            Loading recon session...
          </div>
        ) : !session ? (
          <div className="text-center py-24 text-gray-600 font-mono">
            Session #{id} not found.
          </div>
        ) : (
          <>
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start justify-between mb-6 gap-4"
            >
              <div>
                <div className="flex items-center gap-2 text-xs text-gray-600 font-mono mb-1.5">
                  <Terminal className="w-3 h-3 text-blue-400" />
                  <span>full recon #{session.id}</span>
                </div>
                <h1 className="text-xl font-bold text-white font-mono">{session.target}</h1>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <StatusBadge scan={session} />
                <button
                  onClick={() => refetch()}
                  disabled={isFetching}
                  className="p-2 rounded border border-[#1a1d26] hover:border-blue-500/30 text-gray-500 hover:text-blue-400 transition-all"
                >
                  <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </motion.div>

            {/* Progress bar */}
            {(isRunning || session.status === 'completed') && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 rounded-lg bg-[#0d0d0f] border border-[#1a1d26] mb-6"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500 font-mono">PROGRESS</span>
                  <span className="text-xs text-blue-400 font-mono">{completed}/{total} tools</span>
                </div>
                <div className="w-full h-2 bg-[#1a1d26] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full bg-blue-600 rounded-full"
                  />
                </div>
                {isRunning && (
                  <p className="text-xs text-cyan-400/70 font-mono mt-2">
                    Auto-refreshing every 3 seconds...
                  </p>
                )}
              </motion.div>
            )}

            {/* Tool status list */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-lg bg-[#0d0d0f] border border-[#1a1d26] overflow-hidden mb-6"
            >
              <div className="px-5 py-3 border-b border-[#1a1d26]">
                <span className="text-xs text-gray-400 tracking-widest font-mono">SCAN TOOLS</span>
              </div>
              {TOOL_ORDER.map((toolType, i) => (
                <ToolRow
                  key={toolType}
                  scan={scanMap[toolType]}
                  index={i}
                />
              ))}
            </motion.div>

            {/* Report section */}
            {session.status === 'completed' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-5 rounded-lg bg-[#0d0d0f] border border-[#1a1d26]"
              >
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-gray-400 tracking-widest font-mono">REPORT</span>
                </div>

                {session.has_report ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white font-mono">Report ready</p>
                      <p className="text-xs text-gray-500 font-mono mt-0.5">
                        PDF report generated with all findings
                      </p>
                    </div>
                    <button
                      onClick={() => navigate(`/reports/${session.report_id}`)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs font-bold tracking-widest rounded hover:bg-blue-500 transition-all"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      VIEW REPORT
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-xs font-mono text-cyan-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating PDF report... this may take a minute.
                  </div>
                )}
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

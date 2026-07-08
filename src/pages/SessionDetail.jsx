import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Terminal, ChevronRight, RefreshCw,
  Layers, FileText, Zap, CheckCircle,
  Loader2, XCircle, Clock
} from 'lucide-react';
import { useSession, useGenerateReport } from '../hooks/useReports';
import StatusBadge from '../components/StatusBadge';
import TerminalOutput from '../components/TerminalOutput';

const BORDER  = 'border-theme';
const CARD_BG = 'bg-theme-card';

const TOOL_ORDER = ['subfinder', 'whatweb', 'quick', 'nikto', 'gobuster', 'nuclei', 'full', 'sqlmap'];

function ToolRow({ scan }) {
  const statusIcon = {
    pending:   <Clock className="w-4 h-4 text-gray-600" />,
    running:   <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />,
    completed: <CheckCircle className="w-4 h-4 text-blue-400" />,
    failed:    <XCircle className="w-4 h-4 text-red-400" />,
  }[scan.status] || <Clock className="w-4 h-4 text-gray-600" />;

  return (
    <Link
      to={`/scans/${scan.id}`}
      className={`flex items-center gap-4 px-4 py-3 rounded border ${BORDER} hover:border-blue-500/30 hover:bg-blue-500/5 transition-all group`}
    >
      {statusIcon}
      <span className="text-sm font-mono text-white flex-1">{scan.scan_type}</span>
      <StatusBadge scan={scan} size="sm" />
      <ChevronRight className="w-3 h-3 text-gray-700 group-hover:text-blue-400 transition-colors" />
    </Link>
  );
}

export default function SessionDetail() {
  const { id } = useParams();
  const { data: session, isLoading, refetch, isFetching } = useSession(id);
  const { mutateAsync: generateReport, isLoading: generating } = useGenerateReport();

  const isRunning   = session?.status === 'running' || session?.status === 'pending';
  const isCompleted = session?.status === 'completed';
  const hasReport   = session?.has_report;

  const handleGenerateReport = async () => {
    try {
      await generateReport({ session_id: parseInt(id) });
    } catch (err) {
      console.error('Report generation failed:', err);
    }
  };

  // Sort scans by tool order
  const sortedScans = session?.scans
    ? [...session.scans].sort((a, b) => {
        const ai = TOOL_ORDER.indexOf(a.scan_type);
        const bi = TOOL_ORDER.indexOf(b.scan_type);
        return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
      })
    : [];

  return (
    <div className="min-h-screen bg-theme-base pt-20 pb-12 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-1.5 text-xs font-mono text-gray-600 mb-6"
        >
          <Link to="/dashboard" className="hover:text-blue-400 transition-colors">Dashboard</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/reports" className="hover:text-blue-400 transition-colors flex items-center gap-1">
            <FileText className="w-3 h-3" />
            Reports
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-blue-400">Session #{id}</span>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-24 text-gray-600 font-mono text-sm">
            <Terminal className="w-5 h-5 text-blue-400/30 animate-spin mr-3" />
            Loading session...
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
                  <Layers className="w-3 h-3 text-blue-400" />
                  <span>full recon · session #{session.id}</span>
                </div>
                <h1 className="text-xl font-bold text-white font-mono">{session.target}</h1>
                <p className="text-xs text-gray-500 font-mono mt-1">
                  {session.scan_count} tool(s) · started {new Date(session.created_at).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => refetch()}
                  disabled={isFetching}
                  className={`p-2 rounded border ${BORDER} hover:border-blue-500/30 text-gray-500 hover:text-blue-400 transition-all`}
                >
                  <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </motion.div>

            {/* Running banner */}
            {isRunning && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3 px-4 py-3 rounded-lg border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 text-xs font-mono mb-6"
              >
                <RefreshCw className="w-4 h-4 animate-spin flex-shrink-0" />
                Full recon in progress — tools running sequentially. Auto-refreshing every 3 seconds.
                <span className="ml-auto text-cyan-500/40">live</span>
              </motion.div>
            )}

            {/* Completed — generate report CTA */}
            {isCompleted && !hasReport && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between px-5 py-4 rounded-lg border border-blue-500/20 bg-blue-500/5 mb-6"
              >
                <div>
                  <p className="text-sm font-semibold text-white font-mono">All tools completed</p>
                  <p className="text-xs text-gray-500 font-mono mt-0.5">
                    Generate a PDF report with AI-interpreted findings
                  </p>
                </div>
                <button
                  onClick={handleGenerateReport}
                  disabled={generating}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-bold tracking-widest rounded hover:bg-blue-500 disabled:opacity-50 transition-all"
                >
                  {generating
                    ? <><Loader2 className="w-4 h-4 animate-spin" />GENERATING...</>
                    : <><FileText className="w-4 h-4" />GENERATE REPORT</>
                  }
                </button>
              </motion.div>
            )}

            {/* Report ready */}
            {hasReport && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between px-5 py-4 rounded-lg border border-blue-500/20 bg-blue-500/5 mb-6"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-sm font-semibold text-white font-mono">Report ready</p>
                    <p className="text-xs text-gray-500 font-mono mt-0.5">Report #{session.report_id}</p>
                  </div>
                </div>
                <Link
                  to="/reports"
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-bold tracking-widest rounded hover:bg-blue-500 transition-all"
                >
                  <FileText className="w-4 h-4" />
                  VIEW REPORT
                </Link>
              </motion.div>
            )}

            {/* Tool progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`rounded-lg ${CARD_BG} border ${BORDER} overflow-hidden mb-6`}
            >
              <div className={`flex items-center gap-2 px-5 py-4 border-b ${BORDER}`}>
                <Zap className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-gray-400 tracking-widest font-mono">TOOL PROGRESS</span>
                <span className="ml-auto text-xs text-gray-600 font-mono">
                  {sortedScans.filter(s => s.status === 'completed').length} / {sortedScans.length} completed
                </span>
              </div>
              <div className="p-4 space-y-2">
                {sortedScans.length === 0 ? (
                  <p className="text-xs text-gray-600 font-mono text-center py-4">
                    Tools will appear here as they start running...
                  </p>
                ) : (
                  sortedScans.map((scan) => <ToolRow key={scan.id} scan={scan} />)
                )}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}

import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Terminal, ChevronRight, Download, Loader2,
  FileText, Shield, AlertTriangle, Info,
  CheckCircle, XCircle, RefreshCw
} from 'lucide-react';
import { useReport } from '../hooks/useRecon';

const severityConfig = {
  critical: { color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/30',    icon: XCircle },
  high:     { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', icon: AlertTriangle },
  medium:   { color: 'text-amber-400',  bg: 'bg-amber-500/10',  border: 'border-amber-500/30',  icon: AlertTriangle },
  low:      { color: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/30',   icon: Info },
  info:     { color: 'text-gray-400',   bg: 'bg-gray-500/10',   border: 'border-gray-500/30',   icon: Info },
};

const riskColors = {
  CRITICAL: 'text-red-400',
  HIGH:     'text-orange-400',
  MEDIUM:   'text-amber-400',
  LOW:      'text-blue-400',
};

function FindingCard({ finding, index }) {
  const cfg  = severityConfig[finding.severity] || severityConfig.info;
  const Icon = cfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className={`rounded-lg border ${cfg.border} overflow-hidden mb-4`}
    >
      {/* Header */}
      <div className={`flex items-center justify-between px-5 py-3 ${cfg.bg}`}>
        <div className="flex items-center gap-3 min-w-0">
          <Icon className={`w-4 h-4 ${cfg.color} flex-shrink-0`} />
          <span className={`text-sm font-semibold font-mono ${cfg.color} truncate`}>
            {finding.title}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-3">
          <span className={`text-xs font-mono font-bold tracking-widest px-2 py-0.5 rounded border ${cfg.border} ${cfg.color} ${cfg.bg}`}>
            {finding.severity?.toUpperCase()}
          </span>
          <span className="text-xs text-gray-600 font-mono border border-[#1a1d26] px-2 py-0.5 rounded bg-black">
            {finding.tool}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-4 bg-[#0d0d0f] space-y-3">
        <div>
          <p className="text-xs text-gray-500 font-mono tracking-widest mb-1">DESCRIPTION</p>
          <p className="text-sm text-gray-300 leading-relaxed">{finding.description}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 font-mono tracking-widest mb-1">IMPACT</p>
          <p className="text-sm text-gray-300 leading-relaxed">{finding.impact}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 font-mono tracking-widest mb-1">RECOMMENDATION</p>
          <p className="text-sm text-gray-300 leading-relaxed">{finding.recommendation}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 font-mono tracking-widest mb-1">EVIDENCE</p>
          <div className="bg-black rounded px-3 py-2 font-mono text-xs text-blue-300/80 break-all">
            {finding.evidence}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ReportDetail() {
  const { id } = useParams();
  const { data: report, isLoading, refetch, isFetching } = useReport(id);

  const isGenerating = report?.status === 'generating';
  const counts       = report?.severity_counts || {};
  const findings     = report?.findings_json   || [];

  return (
    <div className="min-h-screen bg-black pt-20 pb-12 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-1.5 text-xs font-mono text-gray-600 mb-6"
        >
          <Link to="/dashboard" className="hover:text-blue-400 transition-colors">Dashboard</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/reports" className="hover:text-blue-400 transition-colors">Reports</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-blue-400">Report #{id}</span>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-24 text-gray-600 font-mono text-sm">
            <Terminal className="w-5 h-5 text-blue-400/30 animate-spin mr-3" />
            Loading report...
          </div>
        ) : !report ? (
          <div className="text-center py-24 text-gray-600 font-mono">
            Report #{id} not found.
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
                  <FileText className="w-3 h-3 text-blue-400" />
                  <span>security report #{report.id}</span>
                </div>
                <h1 className="text-xl font-bold text-white font-mono">{report.target}</h1>
                {report.risk_level && (
                  <p className={`text-sm font-mono font-bold mt-1 ${riskColors[report.risk_level]}`}>
                    Overall Risk: {report.risk_level}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {report.status === 'ready' && (
                  <a
                    href={`/api/reports/${report.id}/download/`}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs font-bold tracking-widest rounded hover:bg-blue-500 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    DOWNLOAD PDF
                  </a>
                )}
                <button
                  onClick={() => refetch()}
                  disabled={isFetching}
                  className="p-2 rounded border border-[#1a1d26] hover:border-blue-500/30 text-gray-500 hover:text-blue-400 transition-all"
                >
                  <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </motion.div>

            {/* Generating banner */}
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3 px-4 py-3 rounded-lg border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 text-xs font-mono mb-6"
              >
                <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                Generating PDF report — parsing scan results and running AI interpretation...
                <span className="ml-auto text-cyan-500/40">auto-refreshing</span>
              </motion.div>
            )}

            {/* Severity summary */}
            {report.status === 'ready' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-5 gap-3 mb-6"
              >
                {[
                  { key: 'critical', label: 'Critical', color: 'text-red-400',    border: 'border-red-500/20' },
                  { key: 'high',     label: 'High',     color: 'text-orange-400', border: 'border-orange-500/20' },
                  { key: 'medium',   label: 'Medium',   color: 'text-amber-400',  border: 'border-amber-500/20' },
                  { key: 'low',      label: 'Low',      color: 'text-blue-400',   border: 'border-blue-500/20' },
                  { key: 'info',     label: 'Info',     color: 'text-gray-400',   border: 'border-gray-500/20' },
                ].map((s) => (
                  <div key={s.key} className={`p-3 rounded-lg bg-[#0d0d0f] border ${s.border} text-center`}>
                    <div className={`text-2xl font-bold ${s.color}`}>{counts[s.key] || 0}</div>
                    <div className="text-xs text-gray-600 font-mono mt-0.5">{s.label}</div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Findings */}
            {report.status === 'ready' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-gray-400 tracking-widest font-mono">
                    FINDINGS ({findings.length})
                  </span>
                </div>

                {findings.length === 0 ? (
                  <div className="flex items-center gap-3 p-6 rounded-lg bg-[#0d0d0f] border border-[#1a1d26] text-blue-400 font-mono text-sm">
                    <CheckCircle className="w-5 h-5" />
                    No significant vulnerabilities identified.
                  </div>
                ) : (
                  findings.map((finding, i) => (
                    <FindingCard key={i} finding={finding} index={i} />
                  ))
                )}
              </motion.div>
            )}

            {/* Failed state */}
            {report.status === 'failed' && (
              <div className="p-5 rounded-lg bg-red-500/5 border border-red-500/20 text-red-400 font-mono text-sm">
                <p className="font-semibold mb-1">Report generation failed</p>
                <p className="text-red-400/70 text-xs">{report.error_message}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

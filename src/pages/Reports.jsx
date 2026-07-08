import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText, Terminal, Download, Loader2,
  CheckCircle, XCircle, ArrowRight, Calendar, Target
} from 'lucide-react';
import { useReports, useDownloadReport } from '../hooks/useReports';

const statusConfig = {
  generating: { icon: Loader2, label: 'GENERATING', color: 'text-cyan-400', spin: true },
  ready:      { icon: CheckCircle, label: 'READY',  color: 'text-blue-400', spin: false },
  failed:     { icon: XCircle, label: 'FAILED',     color: 'text-red-400',  spin: false },
};

const riskColors = {
  CRITICAL: 'text-red-400 bg-red-500/10 border-red-500/30',
  HIGH:     'text-orange-400 bg-orange-500/10 border-orange-500/30',
  MEDIUM:   'text-amber-400 bg-amber-500/10 border-amber-500/30',
  LOW:      'text-blue-400 bg-blue-500/10 border-blue-500/30',
};

export default function Reports() {
  const { data: reports = [], isLoading } = useReports();
  const downloadReport = useDownloadReport();

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
              <span>root@vulnsploit:~$ reports</span>
            </div>
            <h1 className="text-2xl font-bold text-white">
              SECURITY <span className="text-blue-400">REPORTS</span>
            </h1>
          </div>
          <Link
            to="/recon/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-bold tracking-widest rounded hover:bg-blue-500 transition-all"
          >
            + NEW RECON
          </Link>
        </motion.div>

        {/* Reports list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-lg bg-[#0d0d0f] border border-[#1a1d26] overflow-hidden"
        >
          <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 border-b border-[#1a1d26] text-xs text-gray-600 font-mono tracking-widest">
            <span className="col-span-1">#</span>
            <span className="col-span-3">TARGET</span>
            <span className="col-span-2">RISK</span>
            <span className="col-span-3">FINDINGS</span>
            <span className="col-span-2">DATE</span>
            <span className="col-span-1" />
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-gray-600 font-mono text-sm">
              <Terminal className="w-5 h-5 text-blue-400/30 mx-auto mb-2 animate-spin" />
              Loading reports...
            </div>
          ) : reports.length === 0 ? (
            <div className="p-12 text-center text-gray-600 font-mono text-sm">
              No reports yet.{' '}
              <Link to="/recon/new" className="text-blue-400 hover:underline">
                Launch a Full Recon to generate one →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[#1a1d26]">
              {reports.map((report, i) => {
                const sc     = statusConfig[report.status] || statusConfig.generating;
                const Icon   = sc.icon;
                const counts = report.severity_counts || {};

                return (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      to={`/reports/${report.id}`}
                      className="flex md:grid md:grid-cols-12 gap-4 items-center px-5 py-4 hover:bg-blue-500/5 transition-colors group"
                    >
                      <span className="col-span-1 text-xs text-gray-600 font-mono">#{report.id}</span>

                      <div className="col-span-3 min-w-0">
                        <div className="flex items-center gap-2">
                          <Target className="w-3 h-3 text-gray-600 flex-shrink-0" />
                          <span className="text-sm text-white font-mono truncate">{report.target}</span>
                        </div>
                      </div>

                      <div className="col-span-2">
                        {report.risk_level ? (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-mono font-bold tracking-widest ${riskColors[report.risk_level] || riskColors.LOW}`}>
                            {report.risk_level}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-xs text-cyan-400 font-mono">
                            <Icon className={`w-3 h-3 ${sc.spin ? 'animate-spin' : ''}`} />
                            {sc.label}
                          </span>
                        )}
                      </div>

                      <div className="col-span-3 flex items-center gap-2 text-xs font-mono">
                        {report.status === 'ready' ? (
                          <>
                            {counts.critical > 0 && <span className="text-red-400">{counts.critical}C</span>}
                            {counts.high     > 0 && <span className="text-orange-400">{counts.high}H</span>}
                            {counts.medium   > 0 && <span className="text-amber-400">{counts.medium}M</span>}
                            {counts.low      > 0 && <span className="text-blue-400">{counts.low}L</span>}
                            {counts.info     > 0 && <span className="text-gray-500">{counts.info}I</span>}
                          </>
                        ) : (
                          <span className="text-gray-600">—</span>
                        )}
                      </div>

                      <div className="col-span-2 flex items-center gap-1.5 text-xs text-gray-600 font-mono">
                        <Calendar className="w-3 h-3" />
                        {new Date(report.created_at).toLocaleDateString()}
                      </div>

                      <div className="col-span-1 flex justify-end items-center gap-2">
                        {report.status === 'ready' && (
                          <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); downloadReport(report.id, report.target); }}
                            className="p-1.5 rounded border border-[#1a1d26] hover:border-blue-500/30 text-gray-600 hover:text-blue-400 transition-all"
                            title="Download PDF"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <ArrowRight className="w-4 h-4 text-gray-700 group-hover:text-blue-400 transition-colors" />
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Terminal, ChevronRight, Clock, Target, Cpu,
  RefreshCw, Calendar, Hash, Zap, History
} from 'lucide-react';
import { useScan } from '../hooks/useScans';
import StatusBadge, { getScanStatus } from '../components/StatusBadge';
import TerminalOutput from '../components/TerminalOutput';

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-[#1a1d26] last:border-0">
      <Icon className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
      <span className="text-xs text-gray-500 font-mono w-20 flex-shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-white font-mono break-all">{value}</span>
    </div>
  );
}

export default function ScanDetail() {
  const { id } = useParams();
  const { data: scan, isLoading, refetch, isFetching } = useScan(id);

  const status = scan ? getScanStatus(scan.result) : null;
  const isRunning = status === 'running';

  return (
    <div className="min-h-screen bg-black pt-20 pb-12 px-4">
      <div className="max-w-5xl mx-auto">

        {/* ── Breadcrumb ── */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-1.5 text-xs font-mono text-gray-600 mb-6"
        >
          <Link to="/dashboard" className="hover:text-blue-400 transition-colors">Dashboard</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/history" className="hover:text-blue-400 transition-colors flex items-center gap-1">
            <History className="w-3 h-3" />
            History
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-blue-400">Scan #{id}</span>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-24 text-gray-600 font-mono text-sm">
            <Terminal className="w-5 h-5 text-blue-400/30 animate-spin mr-3" />
            Loading scan data...
          </div>
        ) : !scan ? (
          <div className="text-center py-24 text-gray-600 font-mono">
            Scan #{id} not found.{' '}
            <Link to="/history" className="text-blue-400 hover:underline">Back to history →</Link>
          </div>
        ) : (
          <>
            {/* ── Page header ── */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start justify-between mb-6 gap-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs text-gray-600 font-mono mb-1.5">
                  <Terminal className="w-3 h-3 text-blue-400" />
                  <span>scan #{scan.id} · {scan.scan_type}</span>
                </div>
                <h1 className="text-xl font-bold text-white font-mono break-all leading-snug">
                  {scan.target}
                </h1>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <StatusBadge result={scan.result} size="md" />
                <button
                  onClick={() => refetch()}
                  disabled={isFetching}
                  className="p-2 rounded border border-[#1a1d26] hover:border-blue-500/30 text-gray-500 hover:text-blue-400 transition-all"
                  title="Refresh"
                >
                  <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </motion.div>

            {/* ── Running banner ── */}
            {isRunning && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3 px-4 py-3 rounded-lg border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 text-xs font-mono mb-6"
              >
                <RefreshCw className="w-4 h-4 animate-spin flex-shrink-0" />
                Scan is running — auto-refreshing every 3 seconds
                <span className="ml-auto text-cyan-500/40">live</span>
              </motion.div>
            )}

            {/* ── Main grid ── */}
            <div className="grid lg:grid-cols-3 gap-5">

              {/* Left: Scan info card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="lg:col-span-1 space-y-4"
              >
                <div className="p-5 rounded-lg bg-[#0d0d0f] border border-[#1a1d26]">
                  <div className="flex items-center gap-2 mb-4">
                    <Cpu className="w-4 h-4 text-blue-400" />
                    <span className="text-xs text-gray-400 tracking-widest font-mono">SCAN INFO</span>
                  </div>
                  <InfoRow icon={Hash}     label="ID"      value={`#${scan.id}`} />
                  <InfoRow icon={Target}   label="Target"  value={scan.target} />
                  <InfoRow icon={Cpu}      label="Type"    value={scan.scan_type} />
                  <InfoRow icon={Calendar} label="Started" value={new Date(scan.created_at).toLocaleString()} />
                  <InfoRow icon={Clock}    label="Status"  value={status?.toUpperCase() || '—'} />
                </div>

                {/* Run another scan CTA */}
                <div className="p-4 rounded-lg bg-[#0d0d0f] border border-[#1a1d26]">
                  <p className="text-xs text-gray-500 font-mono mb-3">RUN ANOTHER SCAN</p>
                  <Link
                    to={`/scan?type=${scan.scan_type}`}
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-blue-600 text-white text-xs font-bold tracking-widest rounded hover:bg-blue-500 transition-all mb-2"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    SAME TYPE
                  </Link>
                  <Link
                    to="/scan"
                    className="flex items-center justify-center gap-2 w-full py-2.5 border border-[#1a1d26] text-gray-400 text-xs font-mono rounded hover:border-blue-500/30 hover:text-blue-300 transition-all"
                  >
                    Choose Different Type
                  </Link>
                </div>
              </motion.div>

              {/* Right: Terminal output */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="lg:col-span-2"
              >
                <TerminalOutput
                  content={scan.result || 'Waiting for output...'}
                  title={`${scan.scan_type.toUpperCase()} OUTPUT`}
                />
              </motion.div>
            </div>

            {/* ── JSON output (nuclei / wpscan) ── */}
            {scan.result_json && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-5"
              >
                <div className="text-xs text-gray-500 tracking-widest font-mono mb-3">
                  STRUCTURED JSON OUTPUT
                </div>
                <TerminalOutput
                  content={scan.result_json}
                  title="JSON DATA"
                  isJson
                />
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

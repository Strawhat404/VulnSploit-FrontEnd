import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Activity, Zap, CheckCircle, XCircle, Clock,
  ArrowRight, Terminal, TrendingUp
} from 'lucide-react';
import { useScans } from '../hooks/useScans';
import StatusBadge from '../components/StatusBadge';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

const BORDER  = 'border-[#1a1d26]';
const CARD_BG = 'bg-[#0d0d0f]';

function StatCard({ icon: Icon, label, value, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`relative p-5 rounded-lg ${CARD_BG} border ${BORDER} hover:border-blue-500/25 transition-all group`}
    >
      <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-blue-500/25" />
      <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-blue-500/25" />
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-gray-500 tracking-widest font-mono">{label}</span>
        <div className="w-8 h-8 rounded bg-black border border-[#1a1d26] flex items-center justify-center">
          <Icon className={`w-4 h-4 ${color}`} />
        </div>
      </div>
      <div className={`text-3xl font-bold ${color}`}>{value}</div>
    </motion.div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className={`${CARD_BG} border ${BORDER} rounded px-3 py-2 text-xs font-mono`}>
        <p className="text-gray-400">{label}</p>
        <p className="text-blue-400">{payload[0].value} scans</p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const { data: scans = [], isLoading } = useScans();

  const total     = scans.length;
  const completed = scans.filter((s) => s.status === 'completed').length;
  const running   = scans.filter((s) => s.status === 'running' || s.status === 'pending').length;
  const errors    = scans.filter((s) => s.status === 'failed').length;

  const typeCounts = scans.reduce((acc, s) => {
    acc[s.scan_type] = (acc[s.scan_type] || 0) + 1;
    return acc;
  }, {});
  const chartData = Object.entries(typeCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const recentScans = scans.slice(0, 6);

  return (
    <div className="min-h-screen bg-black pt-20 pb-12 px-4">
      <div className="max-w-7xl mx-auto">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-600 font-mono mb-1">
              <Terminal className="w-3 h-3 text-blue-400" />
              <span>root@vulnsploit:~$</span>
            </div>
            <h1 className="text-2xl font-bold text-white">
              COMMAND <span className="text-blue-400">CENTER</span>
            </h1>
          </div>
          <Link
            to="/scan"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-bold tracking-widest rounded hover:bg-blue-500 transition-all"
          >
            <Zap className="w-4 h-4" />
            NEW SCAN
          </Link>
        </motion.div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Activity}    label="TOTAL SCANS" value={total}     color="text-white"      delay={0}    />
          <StatCard icon={CheckCircle} label="COMPLETED"   value={completed} color="text-blue-400"   delay={0.05} />
          <StatCard icon={Clock}       label="RUNNING"     value={running}   color="text-cyan-400"   delay={0.1}  />
          <StatCard icon={XCircle}     label="ERRORS"      value={errors}    color="text-red-400"    delay={0.15} />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* ── Chart ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`lg:col-span-2 p-5 rounded-lg ${CARD_BG} border ${BORDER}`}
          >
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-gray-400 tracking-widest font-mono">SCAN TYPE DISTRIBUTION</span>
            </div>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#4a4a5a', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: '#4a4a5a', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59,130,246,0.05)' }} />
                  <Bar dataKey="count" radius={[3, 3, 0, 0]}>
                    {chartData.map((_, i) => (
                      <Cell key={i} fill={i % 2 === 0 ? '#3b82f6' : '#06b6d4'} opacity={0.85} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-gray-700 text-sm font-mono">
                No scan data yet. Launch your first scan.
              </div>
            )}
          </motion.div>

          {/* ── Quick launch ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className={`p-5 rounded-lg ${CARD_BG} border ${BORDER}`}
          >
            <div className="flex items-center gap-2 mb-5">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-gray-400 tracking-widest font-mono">QUICK LAUNCH</span>
            </div>
            <div className="space-y-2">
              {[
                { type: 'quick',     label: 'Nmap Quick', color: 'text-blue-400'  },
                { type: 'full',      label: 'Nmap Full',  color: 'text-blue-400'  },
                { type: 'nikto',     label: 'Nikto Scan', color: 'text-cyan-400'  },
                { type: 'subfinder', label: 'Subfinder',  color: 'text-cyan-400'  },
                { type: 'nuclei',    label: 'Nuclei',     color: 'text-amber-400' },
                { type: 'sqlmap',    label: 'SQLMap',     color: 'text-red-400'   },
              ].map((item) => (
                <Link
                  key={item.type}
                  to={`/scan?type=${item.type}`}
                  className={`flex items-center justify-between px-3 py-2.5 rounded border ${BORDER} hover:border-blue-500/30 hover:bg-blue-500/5 transition-all group`}
                >
                  <span className={`text-xs font-mono ${item.color}`}>{item.label}</span>
                  <ArrowRight className="w-3 h-3 text-gray-700 group-hover:text-blue-400 transition-colors" />
                </Link>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Recent scans ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`mt-6 rounded-lg ${CARD_BG} border ${BORDER} overflow-hidden`}
        >
          <div className={`flex items-center justify-between px-5 py-4 border-b ${BORDER}`}>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-gray-400 tracking-widest font-mono">RECENT SCANS</span>
            </div>
            <Link to="/history" className="text-xs text-blue-400/60 hover:text-blue-400 font-mono transition-colors">
              View all →
            </Link>
          </div>

          {isLoading ? (
            <div className="p-8 text-center text-gray-600 font-mono text-sm">
              <Terminal className="w-5 h-5 text-blue-400/30 mx-auto mb-2 animate-spin" />
              Loading scans...
            </div>
          ) : recentScans.length === 0 ? (
            <div className="p-8 text-center text-gray-600 font-mono text-sm">
              No scans yet.{' '}
              <Link to="/scan" className="text-blue-400 hover:underline">Launch your first scan →</Link>
            </div>
          ) : (
            <div className={`divide-y ${BORDER}`}>
              {recentScans.map((scan) => (
                <Link
                  key={scan.id}
                  to={`/scans/${scan.id}`}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-blue-500/5 transition-colors group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span className="text-xs text-gray-600 font-mono w-8">#{scan.id}</span>
                    <div className="min-w-0">
                      <p className="text-sm text-white font-mono truncate">{scan.target}</p>
                      <p className="text-xs text-gray-600 font-mono">{scan.scan_type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <StatusBadge scan={scan} />
                    <span className="text-xs text-gray-700 hidden md:block">
                      {new Date(scan.created_at).toLocaleDateString()}
                    </span>
                    <ArrowRight className="w-3 h-3 text-gray-700 group-hover:text-blue-400 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

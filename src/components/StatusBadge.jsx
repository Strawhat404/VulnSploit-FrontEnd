import { Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';

/**
 * Resolve a scan's status from the new `status` field.
 * Falls back to parsing `result` text for backwards compatibility
 * with any scans created before the status field was added.
 */
export function getScanStatus(scan) {
  // New API — use the status field directly
  if (scan?.status) return scan.status;

  // Legacy fallback — parse result text
  const result = typeof scan === 'string' ? scan : scan?.result;
  if (!result || result.startsWith('Scan')) return 'running';
  if (
    result.startsWith('Error') ||
    result.startsWith('Scan execution error') ||
    result.startsWith('An unexpected error')
  ) return 'failed';
  return 'completed';
}

const statusConfig = {
  pending: {
    label: 'PENDING',
    icon: Clock,
    className: 'status-pending',
    spin: false,
  },
  running: {
    label: 'RUNNING',
    icon: Loader2,
    className: 'status-running',
    spin: true,
  },
  completed: {
    label: 'COMPLETED',
    icon: CheckCircle,
    className: 'status-completed',
    spin: false,
  },
  failed: {
    label: 'FAILED',
    icon: XCircle,
    className: 'status-error',
    spin: false,
  },
  // legacy alias
  error: {
    label: 'FAILED',
    icon: XCircle,
    className: 'status-error',
    spin: false,
  },
};

export default function StatusBadge({ scan, result, size = 'sm' }) {
  // Accept either a full scan object or a legacy result string
  const status = getScanStatus(scan ?? result);
  const config = statusConfig[status] ?? statusConfig.running;
  const { label, icon: Icon, className, spin } = config;

  const sizeClass = size === 'sm' ? 'text-xs px-2 py-1' : 'text-sm px-3 py-1.5';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded border font-mono font-semibold tracking-widest ${sizeClass} ${className}`}
    >
      <Icon className={`w-3 h-3 ${spin ? 'animate-spin' : ''}`} />
      {label}
    </span>
  );
}

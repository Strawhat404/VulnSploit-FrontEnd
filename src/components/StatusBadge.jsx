import { Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';

export function getScanStatus(result) {
  if (!result || result === 'Scan in progress') return 'running';
  if (result.startsWith('Error') || result.startsWith('Scan execution error') || result.startsWith('An unexpected error')) return 'error';
  return 'completed';
}

const statusConfig = {
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
  error: {
    label: 'ERROR',
    icon: XCircle,
    className: 'status-error',
    spin: false,
  },
  pending: {
    label: 'PENDING',
    icon: Clock,
    className: 'status-pending',
    spin: false,
  },
};

export default function StatusBadge({ result, size = 'sm' }) {
  const status = getScanStatus(result);
  const { label, icon: Icon, className, spin } = statusConfig[status];

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

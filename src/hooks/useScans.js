import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';

// ─── Fetch all scans (handles paginated response) ──────────────────────────────
export const useScans = (page = 1) =>
  useQuery({
    queryKey: ['scans', page],
    queryFn: async () => {
      const res = await api.get('/api/scans/', { params: { page } });
      // Backend returns { count, next, previous, results: [...] }
      // Fall back to plain array for backwards compatibility
      return res.data?.results ?? res.data;
    },
    refetchInterval: 8000, // Refresh list every 8s to catch status changes
    keepPreviousData: true,
  });

// ─── Fetch paginated meta (count / next / previous) ───────────────────────────
export const useScansMeta = (page = 1) =>
  useQuery({
    queryKey: ['scans-meta', page],
    queryFn: async () => {
      const res = await api.get('/api/scans/', { params: { page } });
      if (res.data?.count !== undefined) {
        return {
          count:    res.data.count,
          next:     res.data.next,
          previous: res.data.previous,
        };
      }
      return { count: res.data.length, next: null, previous: null };
    },
    keepPreviousData: true,
  });

// ─── Fetch single scan — polls until status is terminal ───────────────────────
export const useScan = (id) =>
  useQuery({
    queryKey: ['scan', id],
    queryFn: async () => {
      const res = await api.get(`/api/scans/${id}/`);
      return res.data;
    },
    enabled: !!id,
    refetchInterval: (data) => {
      if (!data) return 3000;
      // Use the status field if available, fall back to result text
      const status = data.status;
      if (status) {
        return (status === 'pending' || status === 'running') ? 3000 : false;
      }
      // Legacy fallback
      const isRunning = !data.result || data.result.startsWith('Scan');
      return isRunning ? 3000 : false;
    },
  });

// ─── Create a new scan ────────────────────────────────────────────────────────
export const useCreateScan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ target, scan_type }) => {
      const res = await api.post('/api/scans/', { target, scan_type });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scans'] });
    },
  });
};

// ─── Register a new account ───────────────────────────────────────────────────
export const useRegister = () =>
  useMutation({
    mutationFn: async ({ username, password, password2 }) => {
      const res = await api.post('/api/register/', { username, password, password2 });
      return res.data;
    },
  });

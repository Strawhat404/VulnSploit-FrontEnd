import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';

// ─── Recon Sessions ───────────────────────────────────────────────────────────

export const useSessions = () =>
  useQuery({
    queryKey: ['sessions'],
    queryFn: async () => {
      const res = await api.get('/api/sessions/');
      return res.data?.results ?? res.data;
    },
    refetchInterval: 8000,
  });

export const useSession = (id) =>
  useQuery({
    queryKey: ['session', id],
    queryFn: async () => {
      const res = await api.get(`/api/sessions/${id}/`);
      return res.data;
    },
    enabled: !!id,
    refetchInterval: (data) => {
      if (!data) return 3000;
      return (data.status === 'pending' || data.status === 'running') ? 3000 : false;
    },
  });

export const useCreateSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ target, tools }) => {
      const res = await api.post('/api/sessions/', { target, tools });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
};

// ─── Reports ──────────────────────────────────────────────────────────────────

export const useReports = () =>
  useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      const res = await api.get('/api/reports/');
      return res.data?.results ?? res.data;
    },
    refetchInterval: 5000,
  });

export const useReport = (id) =>
  useQuery({
    queryKey: ['report', id],
    queryFn: async () => {
      const res = await api.get(`/api/reports/${id}/`);
      return res.data;
    },
    enabled: !!id,
    refetchInterval: (data) => {
      if (!data) return 3000;
      return data.status === 'generating' ? 3000 : false;
    },
  });

export const useGenerateReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ session_id, scan_ids, target }) => {
      const res = await api.post('/api/reports/generate/', { session_id, scan_ids, target });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
};

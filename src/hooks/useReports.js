import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';

// ─── Recon Sessions (uses correct /api/recon/ endpoints) ──────────────────────

export const useSessions = () =>
  useQuery({
    queryKey: ['recon-sessions'],
    queryFn: async () => {
      const res = await api.get('/api/recon/list/');
      return res.data?.results ?? res.data;
    },
    refetchInterval: 8000,
  });

export const useSession = (id) =>
  useQuery({
    queryKey: ['recon-session', id],
    queryFn: async () => {
      const res = await api.get(`/api/recon/${id}/`);
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
    mutationFn: async ({ target }) => {
      const res = await api.post('/api/recon/', { target });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recon-sessions'] });
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
    mutationFn: async ({ scan_ids }) => {
      const res = await api.post('/api/reports/generate/', { scan_ids });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
};

// ─── Authenticated PDF download ───────────────────────────────────────────────

export const useDownloadReport = () => {
  return async (reportId, target) => {
    const res = await api.get(`/api/reports/${reportId}/download/`, {
      responseType: 'blob',
    });
    const url      = URL.createObjectURL(res.data);
    const filename = `vulnsploit_report_${target}_${reportId}.pdf`;
    const a        = document.createElement('a');
    a.href         = url;
    a.download     = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
};

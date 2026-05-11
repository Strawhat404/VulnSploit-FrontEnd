import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';

// Fetch all scans
export const useScans = () =>
  useQuery({
    queryKey: ['scans'],
    queryFn: async () => {
      const res = await api.get('/api/scans/');
      return res.data;
    },
    refetchInterval: 5000, // Poll every 5s to catch completed scans
  });

// Fetch single scan — polls until result is no longer "Scan in progress"
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
      const isRunning =
        !data.result ||
        data.result === 'Scan in progress' ||
        data.result.startsWith('Scan in progress');
      return isRunning ? 3000 : false; // Stop polling when done
    },
  });

// Create a new scan
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

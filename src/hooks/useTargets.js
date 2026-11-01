import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';

export const useTargets = () =>
  useQuery({
    queryKey: ['targets'],
    queryFn: async () => {
      const res = await api.get('/api/targets/');
      return res.data?.results ?? res.data;
    },
  });

export const useTarget = (id) =>
  useQuery({
    queryKey: ['target', id],
    queryFn: async () => {
      const res = await api.get(`/api/targets/${id}/`);
      return res.data;
    },
    enabled: !!id,
  });

export const useCreateTarget = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const res = await api.post('/api/targets/', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['targets'] });
    },
  });
};

export const useUpdateTarget = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }) => {
      const res = await api.put(`/api/targets/${id}/`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['targets'] });
    },
  });
};

export const useDeleteTarget = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      await api.delete(`/api/targets/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['targets'] });
    },
  });
};

// Prove ownership of a target (DNS TXT record or well-known file) so it can be scanned.
export const useVerifyTarget = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, method }) => {
      const res = await api.post(`/api/targets/${id}/verify/`, {
        method,
        confirm_authorization: true,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['targets'] });
    },
  });
};

// Add many targets at once (one per line in the UI). Each line succeeds or fails on its own.
export const useBulkCreateTargets = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values) => {
      const res = await api.post('/api/targets/bulk/', { values });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['targets'] });
    },
  });
};

// Verify several targets with the same method in one request (max 20).
export const useBulkVerifyTargets = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ ids, method }) => {
      const res = await api.post('/api/targets/verify-bulk/', {
        ids,
        method,
        confirm_authorization: true,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['targets'] });
    },
  });
};

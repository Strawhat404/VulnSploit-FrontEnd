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

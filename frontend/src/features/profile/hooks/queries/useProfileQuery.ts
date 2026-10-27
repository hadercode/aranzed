import { useState, useCallback, useEffect } from 'react';
import { ApiClient } from '@/lib/api-client';
import { useAuthStore } from '@/shared/hooks/store/useAuthStore';

export interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string | null;
  jobTitle?: string;
  bio?: string;
  roles?: string[];
  permissions?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export function useProfileQuery() {
  const [data, setData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const updateUser = useAuthStore((state) => state.updateUser);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const profile = await ApiClient.get<UserProfile>('/profile');
      setData(profile);
      updateUser(profile);
    } catch (err: any) {
      setError(err || 'Error al cargar el perfil del usuario');
    } finally {
      setLoading(false);
    }
  }, [updateUser]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch, setData };
}

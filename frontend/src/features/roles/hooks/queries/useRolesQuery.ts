import { useState, useCallback } from 'react';
import { ApiClient } from '@/lib/api-client';

export interface Permission {
  id: string;
  action: string;
  resource: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  permissions: Permission[];
}

export function useRolesQuery() {
  const [data, setData] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      const rolesData = await ApiClient.get<Role[]>("/roles");
      setData(rolesData);
      setError('');
    } catch (err: any) {
      setError(err || "Error al cargar los roles");
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, refetch };
}

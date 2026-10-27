import { useState } from 'react';
import { ApiClient } from '@/lib/api-client';

interface UseRoleMutationsOptions {
  onSuccess?: () => void;
}

export function useRoleMutations(options?: UseRoleMutationsOptions) {
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState("");

  const execute = async (action: () => Promise<void>) => {
    setIsMutating(true);
    setError("");
    try {
      await action();
      if (options?.onSuccess) {
        options.onSuccess();
      }
    } catch (err: any) {
      setError(err || "Error en la operación");
      throw err;
    } finally {
      setIsMutating(false);
    }
  };

  const createRole = (name: string, description: string) => 
    execute(() => ApiClient.post("/roles", { name, description }));

  const updateRole = (id: string, name: string, description: string) => 
    execute(() => ApiClient.put(`/roles/${id}`, { name, description }));

  const deleteRole = (id: string) => 
    execute(() => ApiClient.delete(`/roles/${id}`));

  return { createRole, updateRole, deleteRole, isMutating, error };
}

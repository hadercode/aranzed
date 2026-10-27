import { useState } from 'react';
import { ApiClient } from '@/lib/api-client';
import type { Company } from '../queries/useCompanyQuery';

interface UseCompanyMutationsOptions {
  onSuccess?: (updated: Company) => void;
}

export function useCompanyMutations(options?: UseCompanyMutationsOptions) {
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const execute = async <T>(action: () => Promise<T>): Promise<T> => {
    setIsMutating(true);
    setError('');
    setSuccessMessage('');
    try {
      const res = await action();
      return res;
    } catch (err: any) {
      setError(err || 'Error en la operación');
      throw err;
    } finally {
      setIsMutating(false);
    }
  };

  const updateCompany = async (data: Partial<Company>): Promise<Company> => {
    return execute(async () => {
      const updated = await ApiClient.put<Company>('/company', data);
      setSuccessMessage('Datos de la empresa actualizados exitosamente');
      if (options?.onSuccess) {
        options.onSuccess(updated);
      }
      return updated;
    });
  };

  const uploadLogo = async (file: File): Promise<string> => {
    return execute(async () => {
      const formData = new FormData();
      formData.append('file', file);
      const res = await ApiClient.post<{ message: string; logoUrl: string; company: Company }>(
        '/company/logo',
        formData,
      );
      setSuccessMessage('Logotipo subido y actualizado exitosamente');
      if (options?.onSuccess && res.company) {
        options.onSuccess(res.company);
      }
      return res.logoUrl;
    });
  };

  const clearMessages = () => {
    setError('');
    setSuccessMessage('');
  };

  return {
    updateCompany,
    uploadLogo,
    isMutating,
    error,
    successMessage,
    clearMessages,
  };
}

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { companyService, type Company } from '../../services';
import { COMPANY_QUERY_KEY } from '../queries/useCompanyQuery';

interface UseCompanyMutationsOptions {
  onSuccess?: (updated: Company) => void;
}

export function useCompanyMutations(options?: UseCompanyMutationsOptions) {
  const queryClient = useQueryClient();
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const invalidateCompany = () => {
    queryClient.invalidateQueries({ queryKey: COMPANY_QUERY_KEY });
  };

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Company>) => companyService.updateCompany(data),
    onSuccess: (updated) => {
      setSuccessMessage('Datos de la empresa actualizados exitosamente');
      invalidateCompany();
      options?.onSuccess?.(updated);
    },
    onError: (err: any) => setError(err.message || 'Error al actualizar empresa'),
  });

  const uploadLogoMutation = useMutation({
    mutationFn: (file: File) => companyService.uploadLogo(file),
    onSuccess: (res) => {
      setSuccessMessage('Logotipo subido y actualizado exitosamente');
      invalidateCompany();
      if (res.company) {
        options?.onSuccess?.(res.company);
      }
    },
    onError: (err: any) => setError(err.message || 'Error al subir logotipo'),
  });

  const isMutating = updateMutation.isPending || uploadLogoMutation.isPending;

  const updateCompany = async (data: Partial<Company>): Promise<Company> => {
    setError('');
    return updateMutation.mutateAsync(data);
  };

  const uploadLogo = async (file: File): Promise<string> => {
    setError('');
    const res = await uploadLogoMutation.mutateAsync(file);
    return res.logoUrl;
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

import { useState, useCallback } from 'react';
import { ApiClient } from '@/lib/api-client';

export interface Company {
  id: string;
  identificationNumber: string;
  legalName: string;
  tradeName?: string;
  slogan?: string;
  phone?: string;
  secondaryPhone?: string;
  email?: string;
  website?: string;
  address?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  currencyCode: string;
  currencySymbol: string;
  currencyPosition: string;
  decimalPlaces: number;
  timezone: string;
  dateFormat: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPassword?: string;
  smtpSecure?: boolean;
  smtpFromName?: string;
  smtpFromEmail?: string;
  logoUrl?: string;
  logoDarkUrl?: string;
  faviconUrl?: string;
  taxRegime?: string;
  footerNotes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export function useCompanyQuery() {
  const [data, setData] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const companyData = await ApiClient.get<Company>('/company');
      setData(companyData);
    } catch (err: any) {
      setError(err?.message || err || 'Error al cargar los datos de la empresa');
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, refetch, setData };
}

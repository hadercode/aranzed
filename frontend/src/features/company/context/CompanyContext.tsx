import type { ReactNode } from 'react';
import { useCompanyPage } from '../hooks/logic/useCompanyPage';
import { CompanyContext } from './companyContextDefinition';

export interface CompanyProviderProps {
  children: ReactNode;
}

export function CompanyProvider({ children }: CompanyProviderProps) {
  const value = useCompanyPage();

  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>;
}

export default CompanyProvider;

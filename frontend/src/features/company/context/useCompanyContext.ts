import { useContext } from 'react';
import { CompanyContext, type CompanyContextValue } from './companyContextDefinition';

export function useCompanyContext(): CompanyContextValue {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompanyContext debe ser utilizado dentro de un CompanyProvider');
  }
  return context;
}

export default useCompanyContext;

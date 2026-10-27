import { createContext } from 'react';
import type { useCompanyPage } from '../hooks/logic/useCompanyPage';

export type CompanyContextValue = ReturnType<typeof useCompanyPage>;

export const CompanyContext = createContext<CompanyContextValue | null>(null);

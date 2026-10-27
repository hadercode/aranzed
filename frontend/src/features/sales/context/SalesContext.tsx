import { type ReactNode } from 'react';
import { SalesContext } from './SalesContextDefinition';
import { useSalesPage } from '../hooks/logic/useSalesPage';

export interface SalesProviderProps {
  children: ReactNode;
}

export function SalesProvider({ children }: SalesProviderProps) {
  const value = useSalesPage();

  return (
    <SalesContext.Provider value={value}>
      {children}
    </SalesContext.Provider>
  );
}

import { type ReactNode } from 'react';
import { SalesFormContext } from './SalesFormContextDefinition';
import { useSaleFormPage } from '../hooks/logic/useSaleFormPage';

export interface SalesFormProviderProps {
  children: ReactNode;
}

export function SalesFormProvider({ children }: SalesFormProviderProps) {
  const value = useSaleFormPage();

  return (
    <SalesFormContext.Provider value={value}>
      {children}
    </SalesFormContext.Provider>
  );
}

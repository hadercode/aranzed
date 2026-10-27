import React, { createContext, useContext } from 'react';
import {
  usePurchaseFormPage,
  type UsePurchaseFormPageReturn,
} from '../hooks/logic/usePurchaseFormPage';

export type PurchaseFormContextType = UsePurchaseFormPageReturn;

export const PurchaseFormContext = createContext<PurchaseFormContextType | null>(null);

export interface PurchaseFormProviderProps {
  children: React.ReactNode;
}

export function PurchaseFormProvider({ children }: PurchaseFormProviderProps) {
  const value = usePurchaseFormPage();

  return (
    <PurchaseFormContext.Provider value={value}>
      {children}
    </PurchaseFormContext.Provider>
  );
}

export function usePurchaseFormContext(): PurchaseFormContextType {
  const context = useContext(PurchaseFormContext);
  if (!context) {
    throw new Error('usePurchaseFormContext debe ser utilizado dentro de un PurchaseFormProvider');
  }
  return context;
}

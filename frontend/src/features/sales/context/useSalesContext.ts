import { useContext } from 'react';
import { SalesContext, type SalesContextType } from './SalesContextDefinition';

export function useSalesContext(): SalesContextType {
  const context = useContext(SalesContext);
  if (!context) {
    throw new Error('useSalesContext debe ser utilizado dentro de un SalesProvider');
  }
  return context;
}

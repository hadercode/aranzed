import { useContext } from 'react';
import {
  SalesFormContext,
  type SalesFormContextType,
} from './SalesFormContextDefinition';

export function useSalesFormContext(): SalesFormContextType {
  const context = useContext(SalesFormContext);
  if (!context) {
    throw new Error('useSalesFormContext debe ser utilizado dentro de un SalesFormProvider');
  }
  return context;
}

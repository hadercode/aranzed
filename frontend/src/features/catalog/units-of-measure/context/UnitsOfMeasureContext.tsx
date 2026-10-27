import type { ReactNode } from 'react';
import { UnitsOfMeasureContext } from './unitsOfMeasureContextDefinition';
import { useUnitsOfMeasurePage } from '../hooks/logic/useUnitsOfMeasurePage';

export interface UnitsOfMeasureProviderProps {
  children: ReactNode;
}

export function UnitsOfMeasureProvider({ children }: UnitsOfMeasureProviderProps) {
  const value = useUnitsOfMeasurePage();

  return (
    <UnitsOfMeasureContext.Provider value={value}>
      {children}
    </UnitsOfMeasureContext.Provider>
  );
}

export default UnitsOfMeasureProvider;

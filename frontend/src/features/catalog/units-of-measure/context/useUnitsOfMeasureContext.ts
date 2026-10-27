import { useContext } from 'react';
import {
  UnitsOfMeasureContext,
  type UnitsOfMeasureContextType,
} from './unitsOfMeasureContextDefinition';

export function useUnitsOfMeasureContext(): UnitsOfMeasureContextType {
  const context = useContext(UnitsOfMeasureContext);
  if (!context) {
    throw new Error(
      'useUnitsOfMeasureContext debe ser utilizado dentro de un UnitsOfMeasureProvider'
    );
  }
  return context;
}

export default useUnitsOfMeasureContext;

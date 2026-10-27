import { createContext } from 'react';
import type { UseUnitsOfMeasurePageReturn } from '../hooks/logic/useUnitsOfMeasurePage';

export type UnitsOfMeasureContextType = UseUnitsOfMeasurePageReturn;

export const UnitsOfMeasureContext = createContext<UnitsOfMeasureContextType | undefined>(undefined);

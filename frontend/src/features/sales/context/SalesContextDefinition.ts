import { createContext } from 'react';
import type { UseSalesPageReturn } from '../hooks/logic/useSalesPage';

export type SalesContextType = UseSalesPageReturn;

export const SalesContext = createContext<SalesContextType | null>(null);

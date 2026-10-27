import { createContext } from 'react';
import type { UseSaleFormPageReturn } from '../hooks/logic/useSaleFormPage';

export type SalesFormContextType = UseSaleFormPageReturn;

export const SalesFormContext = createContext<SalesFormContextType | null>(null);

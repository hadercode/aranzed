import { createContext } from 'react';
import type { UseCategoriesPageReturn } from '../hooks/logic/useCategoriesPage';

export type CategoriesContextType = UseCategoriesPageReturn;

export const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

import type { ReactNode } from 'react';
import { CategoriesContext } from './categoriesContextDefinition';
import { useCategoriesPage } from '../hooks/logic/useCategoriesPage';

export interface CategoriesProviderProps {
  children: ReactNode;
}

export function CategoriesProvider({ children }: CategoriesProviderProps) {
  const value = useCategoriesPage();

  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
}

export default CategoriesProvider;

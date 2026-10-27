import { useContext } from 'react';
import { CategoriesContext, type CategoriesContextType } from './categoriesContextDefinition';

export function useCategoriesContext(): CategoriesContextType {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error('useCategoriesContext debe ser utilizado dentro de un CategoriesProvider');
  }
  return context;
}

export default useCategoriesContext;

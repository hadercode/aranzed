import type { ReactNode } from 'react';
import { RecipesContext } from './recipesContextDefinition';
import { useRecipesPage } from '../hooks/logic/useRecipesPage';

export interface RecipesProviderProps {
  children: ReactNode;
}

export function RecipesProvider({ children }: RecipesProviderProps) {
  const value = useRecipesPage();

  return (
    <RecipesContext.Provider value={value}>
      {children}
    </RecipesContext.Provider>
  );
}

export default RecipesProvider;

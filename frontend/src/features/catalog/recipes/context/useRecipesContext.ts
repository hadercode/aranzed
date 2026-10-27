import { useContext } from 'react';
import {
  RecipesContext,
  type RecipesContextType,
} from './recipesContextDefinition';

export function useRecipesContext(): RecipesContextType {
  const context = useContext(RecipesContext);
  if (!context) {
    throw new Error(
      'useRecipesContext debe ser utilizado dentro de un RecipesProvider'
    );
  }
  return context;
}

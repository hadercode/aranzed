import type { ReactNode } from 'react';
import { RecipeFormContext } from './recipeFormContextDefinition';
import { useRecipeFormPage } from '../hooks/logic/useRecipeFormPage';

export interface RecipeFormProviderProps {
  recipeId?: string;
  children: ReactNode;
}

export function RecipeFormProvider({
  recipeId,
  children,
}: RecipeFormProviderProps) {
  const value = useRecipeFormPage(recipeId);

  return (
    <RecipeFormContext.Provider value={value}>
      {children}
    </RecipeFormContext.Provider>
  );
}

export default RecipeFormProvider;

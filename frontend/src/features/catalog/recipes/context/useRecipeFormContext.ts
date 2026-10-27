import { useContext } from 'react';
import {
  RecipeFormContext,
  type RecipeFormContextType,
} from './recipeFormContextDefinition';

export function useRecipeFormContext(): RecipeFormContextType {
  const context = useContext(RecipeFormContext);
  if (!context) {
    throw new Error(
      'useRecipeFormContext debe ser utilizado dentro de un RecipeFormProvider'
    );
  }
  return context;
}

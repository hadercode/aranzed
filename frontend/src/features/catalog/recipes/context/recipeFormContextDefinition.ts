import { createContext } from 'react';
import type { UseRecipeFormPageReturn } from '../hooks/logic/useRecipeFormPage';

export type RecipeFormContextType = UseRecipeFormPageReturn;

export const RecipeFormContext = createContext<RecipeFormContextType | undefined>(
  undefined
);

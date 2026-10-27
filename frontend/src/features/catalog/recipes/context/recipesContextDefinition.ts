import { createContext } from 'react';
import type { UseRecipesPageReturn } from '../hooks/logic/useRecipesPage';

export type RecipesContextType = UseRecipesPageReturn;

export const RecipesContext = createContext<RecipesContextType | undefined>(
  undefined
);

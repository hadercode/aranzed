import { createContext } from 'react';
import type { useProductFormPage } from '../hooks/logic/useProductFormPage';

export type ProductFormContextType = ReturnType<typeof useProductFormPage>;

export const ProductFormContext = createContext<ProductFormContextType | null>(null);

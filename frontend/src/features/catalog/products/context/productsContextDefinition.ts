import { createContext } from 'react';
import type { useProductsPage } from '../hooks/logic/useProductsPage';

export type ProductsContextType = ReturnType<typeof useProductsPage>;

export const ProductsContext = createContext<ProductsContextType | null>(null);

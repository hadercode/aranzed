import { useContext } from 'react';
import { ProductsContext } from './productsContextDefinition';
import type { ProductsContextType } from './productsContextDefinition';

export function useProductsContext(): ProductsContextType {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProductsContext must be used within a ProductsProvider');
  }
  return context;
}

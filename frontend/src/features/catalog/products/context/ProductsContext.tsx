import React from 'react';
import { ProductsContext } from './productsContextDefinition';
import { useProductsPage } from '../hooks/logic/useProductsPage';

export interface ProductsProviderProps {
  children: React.ReactNode;
}

export function ProductsProvider({ children }: ProductsProviderProps) {
  const value = useProductsPage();

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}

import React from 'react';
import { useParams } from 'react-router-dom';
import { ProductFormContext } from './productFormContextDefinition';
import { useProductFormPage } from '../hooks/logic/useProductFormPage';

export interface ProductFormProviderProps {
  children: React.ReactNode;
  productId?: string;
}

export function ProductFormProvider({
  children,
  productId: propProductId,
}: ProductFormProviderProps) {
  const { id: routeId } = useParams<{ id: string }>();
  const resolvedId = propProductId ?? routeId;
  const value = useProductFormPage(resolvedId);

  return (
    <ProductFormContext.Provider value={value}>
      {children}
    </ProductFormContext.Provider>
  );
}

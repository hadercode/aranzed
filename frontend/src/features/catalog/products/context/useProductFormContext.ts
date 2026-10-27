import { useContext } from 'react';
import { ProductFormContext, type ProductFormContextType } from './productFormContextDefinition';

export function useProductFormContext(): ProductFormContextType {
  const context = useContext(ProductFormContext);
  if (!context) {
    throw new Error('useProductFormContext debe ser utilizado dentro de un ProductFormProvider');
  }
  return context;
}

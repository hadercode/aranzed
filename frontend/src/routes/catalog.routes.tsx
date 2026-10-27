import { Route } from 'react-router-dom';
import {
  CategoriesPage,
  UnitsOfMeasurePage,
  ProductsPage,
  ProductFormPage,
  RecipesPage,
  RecipeFormPage,
} from '@/features/catalog';

export const catalogRoutes = (
  <>
    <Route path="/catalog/products" element={<ProductsPage />} />
    <Route path="/catalog/products/new" element={<ProductFormPage />} />
    <Route path="/catalog/products/:id/edit" element={<ProductFormPage />} />
    <Route path="/products" element={<ProductsPage />} />
    <Route path="/products/new" element={<ProductFormPage />} />
    <Route path="/products/:id/edit" element={<ProductFormPage />} />
    <Route path="/catalog/recipes" element={<RecipesPage />} />
    <Route path="/catalog/recipes/new" element={<RecipeFormPage />} />
    <Route path="/catalog/recipes/:id/edit" element={<RecipeFormPage />} />
    <Route path="/recipes" element={<RecipesPage />} />
    <Route path="/recipes/new" element={<RecipeFormPage />} />
    <Route path="/recipes/:id/edit" element={<RecipeFormPage />} />
    <Route path="/catalog/categories" element={<CategoriesPage />} />
    <Route path="/categories" element={<CategoriesPage />} />
    <Route path="/catalog/uofm" element={<UnitsOfMeasurePage />} />
    <Route path="/catalog/units-of-measure" element={<UnitsOfMeasurePage />} />
    <Route path="/units-of-measure" element={<UnitsOfMeasurePage />} />
  </>
);

export default catalogRoutes;


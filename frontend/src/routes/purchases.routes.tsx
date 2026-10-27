import { Route } from 'react-router-dom';
import { PurchasesPage, PurchaseFormPage } from '@/features/purchases';

export const purchasesRoutes = (
  <>
    <Route path="/purchases" element={<PurchasesPage />} />
    <Route path="/purchases/new" element={<PurchaseFormPage />} />
    <Route path="/purchases/:id" element={<PurchaseFormPage />} />
  </>
);

export default purchasesRoutes;

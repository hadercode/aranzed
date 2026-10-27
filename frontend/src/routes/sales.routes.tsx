import { Route } from 'react-router-dom';
import {
  SalesPage,
  SaleFormPage,
  SalePaymentsPage,
  SalePaymentFormPage,
} from '@/features/sales';

export const salesRoutes = (
  <>
    <Route path="/sales" element={<SalesPage />} />
    <Route path="/sales/new" element={<SaleFormPage />} />
    <Route path="/sales/payments" element={<SalePaymentsPage />} />
    <Route path="/sales/payments/new" element={<SalePaymentFormPage />} />
    <Route path="/sales/:id" element={<SaleFormPage />} />
    <Route path="/sales/:id/edit" element={<SaleFormPage />} />
  </>
);

export default salesRoutes;

import { Route } from "react-router-dom";
import { CompanySettingsPage as CompanySettings } from "@/features/company";

export const companyRoutes = (
  <>
    <Route path="/company" element={<CompanySettings />} />
    <Route path="/settings" element={<CompanySettings />} />
  </>
);

export default companyRoutes;

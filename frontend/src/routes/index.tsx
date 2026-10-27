import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/shared/components/ProtectedRoute";
import Layout from "@/shared/components/Layout";
import { DashboardPage as Dashboard } from "@/features/dashboard";
import { ProfilePage as Profile } from "@/features/profile";

import { authRoutes } from "./auth.routes";
import { iamRoutes } from "./iam.routes";
import { companyRoutes } from "./company.routes";
import { catalogRoutes } from "./catalog.routes";
import { purchasesRoutes } from "./purchases.routes";
import { salesRoutes } from "./sales.routes";
import { inventoryRoutes } from "./inventory.routes";

export function AppRoutes() {
  return (
    <Routes>
      {/* Rutas Públicas de Autenticación */}
      {authRoutes}

      {/* Rutas Protegidas bajo Layout Principal */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          {/* Dashboard y Perfil */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/analytics" element={<Dashboard />} />

          {/* Módulo IAM (Usuarios, Roles, Permisos, Auditoría) */}
          {iamRoutes}

          {/* Módulo Catálogo (Categorías, Unidades de Medida) */}
          {catalogRoutes}

          {/* Módulo Compras de Materiales */}
          {purchasesRoutes}

          {/* Módulo Ventas y Cotizaciones */}
          {salesRoutes}

          {/* Módulo Inventario (Almacenes, Existencias, Movimientos, Kárdex, Mermas) */}
          {inventoryRoutes}

          {/* Módulo Empresa / Configuración */}
          {companyRoutes}
        </Route>
      </Route>

      {/* Redirección por defecto */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export * from "./auth.routes";
export * from "./iam.routes";
export * from "./company.routes";
export * from "./catalog.routes";
export * from "./purchases.routes";
export * from "./sales.routes";
export * from "./inventory.routes";
export default AppRoutes;

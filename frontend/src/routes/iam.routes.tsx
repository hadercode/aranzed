import { Route } from "react-router-dom";
import { UsersPage as Users } from "@/features/users";
import { RolesPage as Roles } from "@/features/roles";
import { RolePermissionsPage as RolePermissions } from "@/features/permissions";
import { AuditLogsPage as AuditLogs } from "@/features/audit";

export const iamRoutes = (
  <>
    <Route path="/users" element={<Users />} />
    <Route path="/roles" element={<Roles />} />
    <Route path="/permissions" element={<RolePermissions />} />
    <Route path="/audit" element={<AuditLogs />} />
  </>
);

export default iamRoutes;

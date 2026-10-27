import type { ReactNode } from "react";
import { useRolePermissionsPage } from "../hooks/logic/useRolePermissionsPage";
import { PermissionsContext } from "./permissionsContextDefinition";

export interface PermissionsProviderProps {
  children: ReactNode;
}

export function PermissionsProvider({ children }: PermissionsProviderProps) {
  const value = useRolePermissionsPage();

  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  );
}

export default PermissionsProvider;

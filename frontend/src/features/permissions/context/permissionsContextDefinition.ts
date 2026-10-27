import { createContext } from "react";
import type { useRolePermissionsPage } from "../hooks/logic/useRolePermissionsPage";

export type PermissionsContextValue = ReturnType<typeof useRolePermissionsPage>;

export const PermissionsContext = createContext<PermissionsContextValue | null>(null);

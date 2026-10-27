import { useContext } from "react";
import {
  PermissionsContext,
  type PermissionsContextValue,
} from "./permissionsContextDefinition";

export function usePermissionsContext(): PermissionsContextValue {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error(
      "usePermissionsContext debe ser utilizado dentro de un PermissionsProvider"
    );
  }
  return context;
}

export default usePermissionsContext;

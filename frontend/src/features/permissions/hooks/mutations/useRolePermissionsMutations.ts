import { useState } from "react";
import { ApiClient } from "@/lib/api-client";

interface UseRolePermissionsMutationsOptions {
  onSuccess?: () => void;
}

export function useRolePermissionsMutations(options?: UseRolePermissionsMutationsOptions) {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const clearError = () => setError("");

  const savePermissions = async (
    roleId: string,
    originalPerms: Set<string>,
    newPerms: Set<string>
  ) => {
    setIsSaving(true);
    setError("");
    try {
      const toAdd = Array.from(newPerms).filter((id) => !originalPerms.has(id));
      const toRemove = Array.from(originalPerms).filter((id) => !newPerms.has(id));

      await Promise.all([
        ...toAdd.map((id) =>
          ApiClient.post(`/roles/${roleId}/permissions`, { permissionId: id })
        ),
        ...toRemove.map((id) =>
          ApiClient.delete(`/roles/${roleId}/permissions/${id}`)
        ),
      ]);

      if (options?.onSuccess) {
        options.onSuccess();
      }
    } catch (err: any) {
      const errMsg =
        err?.message ||
        (typeof err === "string" ? err : "Error al actualizar los permisos del rol");
      setError(errMsg);
      console.error(err);
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    savePermissions,
    isSaving,
    isMutating: isSaving,
    error,
    clearError,
  };
}

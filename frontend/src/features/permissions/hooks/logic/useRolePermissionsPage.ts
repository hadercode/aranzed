import { useState, useEffect, useMemo, useCallback } from "react";
import { useRolesQuery, type Role } from "@/features/roles/hooks/queries/useRolesQuery";
import {
  usePermissionsQuery,
  type Permission,
} from "../queries/usePermissionsQuery";
import { useRolePermissionsMutations } from "../mutations/useRolePermissionsMutations";

export function useRolePermissionsPage() {
  const {
    data: roles,
    loading: loadingRoles,
    error: rolesError,
    refetch: refetchRoles,
  } = useRolesQuery();

  const {
    data: allPermissions,
    loading: loadingPerms,
    error: permsError,
    refetch: refetchPerms,
  } = usePermissionsQuery();

  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [customPerms, setCustomPerms] = useState<Set<string> | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog and confirmation states
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isConfirmDiscardOpen, setIsConfirmDiscardOpen] = useState(false);
  const [pendingRoleId, setPendingRoleId] = useState<string | null>(null);

  // Initial data loading on mount
  useEffect(() => {
    refetchRoles();
    refetchPerms();
  }, [refetchRoles, refetchPerms]);

  // Determine effective selected role
  const effectiveRoleId = selectedRoleId ?? (roles.length > 0 ? roles[0].id : null);

  const selectedRole = useMemo(
    () => roles.find((r) => r.id === effectiveRoleId) || null,
    [roles, effectiveRoleId]
  );

  const originalPermIds = useMemo(() => {
    if (!selectedRole || !selectedRole.permissions) return new Set<string>();
    return new Set<string>(selectedRole.permissions.map((p) => p.id));
  }, [selectedRole]);

  // Derived current permissions for the active role
  const localRolePerms = useMemo(
    () => customPerms ?? originalPermIds,
    [customPerms, originalPermIds]
  );

  // Determine if there are uncommitted changes for the currently selected role
  const hasChanges = useMemo(() => {
    if (!customPerms) return false;
    if (customPerms.size !== originalPermIds.size) return true;
    for (const id of customPerms) {
      if (!originalPermIds.has(id)) return true;
    }
    return false;
  }, [customPerms, originalPermIds]);

  const {
    savePermissions,
    isSaving,
    isMutating,
    error: mutationError,
    clearError,
  } = useRolePermissionsMutations({
    onSuccess: async () => {
      setCustomPerms(null);
      await refetchRoles();
      setSuccessMessage(
        `Los permisos para el rol "${selectedRole?.name || ""}" han sido guardados exitosamente.`
      );
      setIsSuccessOpen(true);
    },
  });

  // Role selection with dirty check
  const requestSelectRole = useCallback(
    (role: Role) => {
      if (role.id === effectiveRoleId) return;
      if (hasChanges) {
        setPendingRoleId(role.id);
        setIsConfirmDiscardOpen(true);
      } else {
        setSelectedRoleId(role.id);
        setCustomPerms(null);
      }
    },
    [effectiveRoleId, hasChanges]
  );

  const confirmDiscardAndSwitch = useCallback(() => {
    if (pendingRoleId) {
      setSelectedRoleId(pendingRoleId);
    }
    setCustomPerms(null);
    setPendingRoleId(null);
    setIsConfirmDiscardOpen(false);
  }, [pendingRoleId]);

  const cancelDiscardRoleSwitch = useCallback(() => {
    setPendingRoleId(null);
    setIsConfirmDiscardOpen(false);
  }, []);

  // Filtered and grouped permissions
  const groupedPermissions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const filtered = allPermissions.filter((p) => {
      if (!query) return true;
      return (
        p.resource.toLowerCase().includes(query) ||
        p.action.toLowerCase().includes(query)
      );
    });

    const groups: Record<string, Permission[]> = {};
    filtered.forEach((p) => {
      if (!groups[p.resource]) {
        groups[p.resource] = [];
      }
      groups[p.resource].push(p);
    });

    return groups;
  }, [allPermissions, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const totalPermissions = allPermissions.length;
    const activeInRole = localRolePerms.size;
    const totalModules = new Set(allPermissions.map((p) => p.resource)).size;
    const filteredCount = Object.values(groupedPermissions).reduce(
      (acc, curr) => acc + curr.length,
      0
    );

    return {
      totalPermissions,
      activeInRole,
      totalModules,
      filteredCount,
    };
  }, [allPermissions, localRolePerms, groupedPermissions]);

  // Permission toggle actions
  const handleTogglePermission = useCallback(
    (permId: string) => {
      setCustomPerms((prev) => {
        const next = new Set(prev ?? originalPermIds);
        if (next.has(permId)) {
          next.delete(permId);
        } else {
          next.add(permId);
        }
        return next;
      });
    },
    [originalPermIds]
  );

  const handleToggleModule = useCallback(
    (_resource: string, perms: Permission[]) => {
      setCustomPerms((prev) => {
        const next = new Set(prev ?? originalPermIds);
        const allSelected = perms.every((p) => next.has(p.id));

        if (allSelected) {
          perms.forEach((p) => next.delete(p.id));
        } else {
          perms.forEach((p) => next.add(p.id));
        }
        return next;
      });
    },
    [originalPermIds]
  );

  const handleSelectAll = useCallback(() => {
    setCustomPerms(new Set(allPermissions.map((p) => p.id)));
  }, [allPermissions]);

  const handleDeselectAll = useCallback(() => {
    setCustomPerms(new Set());
  }, []);

  const handleResetChanges = useCallback(() => {
    setCustomPerms(null);
  }, []);

  // Save operation
  const handleSave = async () => {
    if (!selectedRole || isSaving) return;
    try {
      await savePermissions(selectedRole.id, originalPermIds, localRolePerms);
    } catch {
      // Error handled by mutation hook state
    }
  };

  const closeSuccess = () => {
    setIsSuccessOpen(false);
    setSuccessMessage("");
  };

  const loading = (loadingRoles || loadingPerms) && roles.length === 0;
  const isRefreshing = loadingRoles || loadingPerms;
  const fetchError = rolesError || permsError;

  return {
    roles,
    selectedRole,
    selectedRoleId: effectiveRoleId,
    requestSelectRole,
    loading,
    isRefreshing,
    fetchError,
    mutationError,
    clearError,
    searchQuery,
    setSearchQuery,
    localRolePerms,
    groupedPermissions,
    stats,
    hasChanges,
    isSaving,
    isMutating,
    handleTogglePermission,
    handleToggleModule,
    handleSelectAll,
    handleDeselectAll,
    handleResetChanges,
    handleSave,
    isSuccessOpen,
    successMessage,
    closeSuccess,
    isConfirmDiscardOpen,
    confirmDiscardAndSwitch,
    cancelDiscardRoleSwitch,
    refetchRoles,
    refetchPerms,
  };
}

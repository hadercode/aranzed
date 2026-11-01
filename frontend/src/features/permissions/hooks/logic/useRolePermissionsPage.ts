import { useState, useMemo, useCallback } from 'react';
import { useRolesQuery, type Role } from '@/features/roles/hooks/queries/useRolesQuery';
import { usePermissionsQuery } from '../queries/usePermissionsQuery';
import { useRolePermissionsMutations } from '../mutations/useRolePermissionsMutations';
import { usePermissionsSelection } from './usePermissionsSelection';
import { usePermissionsFilter } from './usePermissionsFilter';

export function useRolePermissionsPage() {
  const { data: roles, loading: loadingRoles, error: rolesError, refetch: refetchRoles } = useRolesQuery();
  const { data: allPermissions, loading: loadingPerms, error: permsError, refetch: refetchPerms } = usePermissionsQuery();

  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isConfirmDiscardOpen, setIsConfirmDiscardOpen] = useState(false);
  const [pendingRoleId, setPendingRoleId] = useState<string | null>(null);

  const effectiveRoleId = selectedRoleId ?? (roles.length > 0 ? roles[0].id : null);
  const selectedRole = useMemo(() => roles.find((r) => r.id === effectiveRoleId) || null, [roles, effectiveRoleId]);

  const originalPermIds = useMemo(() => {
    if (!selectedRole || !selectedRole.permissions) return new Set<string>();
    return new Set<string>(selectedRole.permissions.map((p) => p.id));
  }, [selectedRole]);

  const selection = usePermissionsSelection(originalPermIds, allPermissions);
  const filter = usePermissionsFilter(allPermissions, selection.localRolePerms);

  const { savePermissions, isSaving, isMutating, error: mutationError, clearError } = useRolePermissionsMutations({
    onSuccess: async () => {
      selection.setCustomPerms(null);
      await refetchRoles();
      setSuccessMessage(`Los permisos para el rol "${selectedRole?.name || ''}" han sido guardados exitosamente.`);
      setIsSuccessOpen(true);
    },
  });

  const requestSelectRole = useCallback(
    (role: Role) => {
      if (role.id === effectiveRoleId) return;
      if (selection.hasChanges) {
        setPendingRoleId(role.id);
        setIsConfirmDiscardOpen(true);
      } else {
        setSelectedRoleId(role.id);
        selection.setCustomPerms(null);
      }
    },
    [effectiveRoleId, selection.hasChanges, selection.setCustomPerms]
  );

  const confirmDiscardAndSwitch = useCallback(() => {
    if (pendingRoleId) setSelectedRoleId(pendingRoleId);
    selection.setCustomPerms(null);
    setPendingRoleId(null);
    setIsConfirmDiscardOpen(false);
  }, [pendingRoleId, selection.setCustomPerms]);

  const cancelDiscardRoleSwitch = useCallback(() => {
    setPendingRoleId(null);
    setIsConfirmDiscardOpen(false);
  }, []);

  const handleSave = async () => {
    if (!selectedRole || isSaving) return;
    try {
      await savePermissions(selectedRole.id, originalPermIds, selection.localRolePerms);
    } catch {
      // Handled in mutation hook
    }
  };

  const closeSuccess = () => {
    setIsSuccessOpen(false);
    setSuccessMessage('');
  };

  return {
    roles,
    selectedRole,
    selectedRoleId: effectiveRoleId,
    requestSelectRole,
    loading: (loadingRoles || loadingPerms) && roles.length === 0,
    isRefreshing: loadingRoles || loadingPerms,
    fetchError: rolesError || permsError,
    mutationError,
    clearError,
    searchQuery: filter.searchQuery,
    setSearchQuery: filter.setSearchQuery,
    localRolePerms: selection.localRolePerms,
    groupedPermissions: filter.groupedPermissions,
    stats: filter.stats,
    hasChanges: selection.hasChanges,
    isSaving,
    isMutating,
    handleTogglePermission: selection.handleTogglePermission,
    handleToggleModule: selection.handleToggleModule,
    handleSelectAll: selection.handleSelectAll,
    handleDeselectAll: selection.handleDeselectAll,
    handleResetChanges: selection.handleResetChanges,
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

import { useState, useMemo, useCallback } from 'react';
import type { Permission } from '../queries/usePermissionsQuery';

export function usePermissionsSelection(
  originalPermIds: Set<string>,
  allPermissions: Permission[]
) {
  const [customPerms, setCustomPerms] = useState<Set<string> | null>(null);

  const localRolePerms = useMemo(
    () => customPerms ?? originalPermIds,
    [customPerms, originalPermIds]
  );

  const hasChanges = useMemo(() => {
    if (!customPerms) return false;
    if (customPerms.size !== originalPermIds.size) return true;
    for (const id of customPerms) {
      if (!originalPermIds.has(id)) return true;
    }
    return false;
  }, [customPerms, originalPermIds]);

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

  return {
    customPerms,
    setCustomPerms,
    localRolePerms,
    hasChanges,
    handleTogglePermission,
    handleToggleModule,
    handleSelectAll,
    handleDeselectAll,
    handleResetChanges,
  };
}


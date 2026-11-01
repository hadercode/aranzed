import { useState, useMemo } from 'react';
import type { Permission } from '../queries/usePermissionsQuery';

export function usePermissionsFilter(
  allPermissions: Permission[],
  localRolePerms: Set<string>
) {
  const [searchQuery, setSearchQuery] = useState('');

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

  return {
    searchQuery,
    setSearchQuery,
    groupedPermissions,
    stats,
  };
}


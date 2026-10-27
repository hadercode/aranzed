import { useState, useEffect } from "react";
import { useRolesQuery, type Role } from "../queries/useRolesQuery";
import { useRoleMutations } from "../mutations/useRoleMutations";
import { useModal } from "@/shared/hooks/ui/useModal";
import { useRolesTable } from "./useRolesTable";
import type { RoleFormData } from "../../schemas/role.schema";

export function useRolesPage() {
  const { data: roles, loading, error, refetch } = useRolesQuery();
  const {
    createRole,
    updateRole,
    deleteRole,
    isMutating,
    error: mutationError,
  } = useRoleMutations({
    onSuccess: refetch,
  });

  const {
    isOpen: isModalOpen,
    open: openModal,
    close: closeModal,
  } = useModal();
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  // Confirm delete state
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Success dialog state
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    refetch();
  }, [refetch]);

  const openCreateModal = () => {
    setEditingRole(null);
    openModal();
  };

  const openEditModal = (role: Role) => {
    setEditingRole(role);
    openModal();
  };

  const handleFormSubmit = async (data: RoleFormData) => {
    try {
      if (editingRole) {
        await updateRole(editingRole.id, data.name, data.description || "");
      } else {
        await createRole(data.name, data.description || "");
      }
      closeModal();
    } catch {
      // Error is handled by mutation hook
    }
  };

  const requestDelete = (id: string) => {
    const found = (roles || []).find((r) => r.id === id) || {
      id,
      name: "este rol",
      description: "",
      createdAt: "",
      permissions: [],
    };
    setRoleToDelete(found);
    setIsConfirmOpen(true);
  };

  const closeConfirm = () => {
    setRoleToDelete(null);
    setIsConfirmOpen(false);
  };

  const closeSuccess = () => {
    setIsSuccessOpen(false);
    setSuccessMessage("");
  };

  const handleConfirmDelete = async () => {
    if (!roleToDelete) return;
    const deletedRoleName = roleToDelete.name;
    try {
      await deleteRole(roleToDelete.id);
      closeConfirm();
      setSuccessMessage(`El rol "${deletedRoleName}" ha sido eliminado exitosamente.`);
      setIsSuccessOpen(true);
    } catch {
      // Error handled by mutation hook
    }
  };

  const { columns } = useRolesTable({
    onEdit: openEditModal,
    onDelete: requestDelete,
  });

  return {
    roles,
    loading,
    error,
    columns,
    isModalOpen,
    closeModal,
    openCreateModal,
    openEditModal,
    editingRole,
    handleFormSubmit,
    isMutating,
    mutationError,
    roleToDelete,
    isConfirmOpen,
    handleConfirmDelete,
    closeConfirm,
    isSuccessOpen,
    successMessage,
    closeSuccess,
    refetch,
  };
}

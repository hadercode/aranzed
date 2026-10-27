import { useState } from "react";
import type { User } from "../../types/user";
import type { UserFormData } from "../../schemas/user.schema";
import { useUsersQuery } from "../queries/useUsersQuery";
import { useUserMutations } from "../mutations/useUserMutations";

export function useUsersPage() {
  const { data: users, loading, error, refetch } = useUsersQuery();
  const {
    createUser,
    updateUser,
    deleteUser,
    isMutating: formLoading,
    mutationError: formError,
    setMutationError: setFormError,
  } = useUserMutations({
    onSuccess: refetch,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Confirm delete dialog state
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Success dialog state
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("");

  const availableRoles = ["ADMIN_ROLE", "USER_ROLE"];

  const openCreateModal = () => {
    setEditingUser(null);
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleFormSubmit = async (data: UserFormData) => {
    try {
      if (editingUser) {
        await updateUser(editingUser.id, {
          email: data.email,
          ...(data.password ? { password: data.password } : {}),
          roles: data.roles,
        });
      } else {
        await createUser({
          email: data.email,
          password: data.password!,
          roles: data.roles,
        });
      }
      closeModal();
    } catch {
      // Error handled by mutation hook
    }
  };

  const requestDelete = (id: string) => {
    const found = (users || []).find((u) => u.id === id) || {
      id,
      email: "este usuario",
      roles: [],
      createdAt: "",
    };
    setUserToDelete(found);
    setIsConfirmOpen(true);
  };

  const closeConfirm = () => {
    setUserToDelete(null);
    setIsConfirmOpen(false);
  };

  const closeSuccess = () => {
    setIsSuccessOpen(false);
    setSuccessMessage("");
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    const deletedUserEmail = userToDelete.email;
    try {
      await deleteUser(userToDelete.id);
      closeConfirm();
      setSuccessMessage(`El usuario "${deletedUserEmail}" ha sido eliminado exitosamente.`);
      setIsSuccessOpen(true);
    } catch {
      // Error handled by mutation hook
    }
  };

  return {
    users,
    loading,
    error,
    isModalOpen,
    editingUser,
    availableRoles,
    formLoading,
    formError,
    openCreateModal,
    openEditModal,
    closeModal,
    handleFormSubmit,
    handleDelete: requestDelete,
    userToDelete,
    isConfirmOpen,
    handleConfirmDelete,
    closeConfirm,
    isSuccessOpen,
    successMessage,
    closeSuccess,
    refetch,
  };
}

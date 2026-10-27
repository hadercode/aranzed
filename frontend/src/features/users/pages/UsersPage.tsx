import { Plus } from "lucide-react";
import { useUsersPage } from "../hooks/logic/useUsersPage";
import { UsersTable } from "../components/UsersTable";
import { UserFormModal } from "../components/UserFormModal";
import {
  PageHeader,
  ConfirmDialog,
  SuccessDialog,
} from "@/shared/components/ui";

export default function UsersPage() {
  const {
    users,
    loading,
    isModalOpen,
    editingUser,
    availableRoles,
    formLoading,
    formError,
    openCreateModal,
    openEditModal,
    closeModal,
    handleFormSubmit,
    handleDelete,
    userToDelete,
    isConfirmOpen,
    handleConfirmDelete,
    closeConfirm,
    isSuccessOpen,
    successMessage,
    closeSuccess,
  } = useUsersPage();

  return (
    <div className="max-w-8xl mx-auto">
      <PageHeader
        title="Usuarios"
        description="Gestiona los usuarios y sus roles en el sistema"
        action={{
          label: "Nuevo Usuario",
          onClick: openCreateModal,
          icon: <Plus size={20} />,
        }}
      />

      {/* Users Table */}
      <UsersTable
        users={users}
        loading={loading}
        onEdit={openEditModal}
        onDelete={handleDelete}
      />

      {/* Create / Edit User Modal */}
      <UserFormModal
        isOpen={isModalOpen}
        editingUser={editingUser}
        availableRoles={availableRoles}
        formLoading={formLoading}
        formError={formError}
        onClose={closeModal}
        onSubmit={handleFormSubmit}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Eliminar Usuario"
        message={
          <span>
            ¿Estás seguro de que deseas eliminar al usuario{" "}
            <strong className="text-[var(--color-text-primary)]">
              {userToDelete?.email}
            </strong>
            ? Esta acción no se puede deshacer.
          </span>
        }
        confirmText="Eliminar"
        variant="danger"
        loading={formLoading}
        onConfirm={handleConfirmDelete}
        onClose={closeConfirm}
      />

      {/* Success Dialog */}
      <SuccessDialog
        isOpen={isSuccessOpen}
        title="¡Usuario Eliminado!"
        message={successMessage}
        buttonText="Aceptar"
        onClose={closeSuccess}
      />
    </div>
  );
}

import { Plus } from "lucide-react";
import type { Role } from "../hooks/queries/useRolesQuery";
import { useRolesPage } from "../hooks/logic/useRolesPage";
import { RoleFormModal } from "../components/RoleFormModal";
import {
  Table,
  PageHeader,
  ConfirmDialog,
  SuccessDialog,
} from "@/shared/components/ui";

export default function RolesPage() {
  const {
    roles,
    loading,
    columns,
    isModalOpen,
    closeModal,
    openCreateModal,
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
  } = useRolesPage();

  return (
    <div className="max-w-8xl mx-auto">
      <PageHeader
        title="Roles del Sistema"
        description="Gestiona los roles y sus permisos asociados"
        action={{
          label: "Nuevo Rol",
          onClick: openCreateModal,
          icon: <Plus size={20} />,
        }}
      />

      {/* Roles Table */}
      <Table<Role>
        columns={columns}
        data={roles}
        loading={loading}
        emptyMessage="No se encontraron roles configurados."
      />

      {/* Create / Edit Role Modal */}
      <RoleFormModal
        isOpen={isModalOpen}
        editingRole={editingRole}
        isMutating={isMutating}
        error={mutationError}
        onClose={closeModal}
        onSubmit={handleFormSubmit}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Eliminar Rol"
        message={
          <span>
            ¿Estás seguro de que deseas eliminar el rol{" "}
            <strong className="text-[var(--color-text-primary)]">
              "{roleToDelete?.name}"
            </strong>
            ? Esta acción no se puede deshacer.
          </span>
        }
        confirmText="Eliminar"
        variant="danger"
        loading={isMutating}
        onConfirm={handleConfirmDelete}
        onClose={closeConfirm}
      />

      {/* Success Dialog */}
      <SuccessDialog
        isOpen={isSuccessOpen}
        title="¡Rol Eliminado!"
        message={successMessage}
        buttonText="Aceptar"
        onClose={closeSuccess}
      />
    </div>
  );
}

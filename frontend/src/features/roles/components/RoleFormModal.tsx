import { Modal } from "@/shared/components/ui/Modal";
import { RoleForm } from "./RoleForm";
import type { Role } from "../hooks/queries/useRolesQuery";
import type { RoleFormData } from "../schemas/role.schema";

export interface RoleFormModalProps {
  isOpen: boolean;
  editingRole: Role | null;
  isMutating: boolean;
  error?: string;
  onClose: () => void;
  onSubmit: (data: RoleFormData) => Promise<void>;
}

export function RoleFormModal({
  isOpen,
  editingRole,
  isMutating,
  error,
  onClose,
  onSubmit,
}: RoleFormModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingRole ? "Editar Rol" : "Nuevo Rol"}
    >
      <RoleForm
        editingRole={editingRole}
        isMutating={isMutating}
        error={error}
        onCancel={onClose}
        onSubmit={onSubmit}
      />
    </Modal>
  );
}

export default RoleFormModal;

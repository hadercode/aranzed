import { Modal } from "@/shared/components/ui/Modal";
import { UserForm } from "./UserForm";
import type { User } from "../types/user";
import type { UserFormData } from "../schemas/user.schema";

interface UserFormModalProps {
  isOpen: boolean;
  editingUser: User | null;
  availableRoles: string[];
  formLoading: boolean;
  formError: string;
  onClose: () => void;
  onSubmit: (data: UserFormData) => Promise<void>;
}

export function UserFormModal({
  isOpen,
  editingUser,
  availableRoles,
  formLoading,
  formError,
  onClose,
  onSubmit,
}: UserFormModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingUser ? "Editar Usuario" : "Nuevo Usuario"}
    >
      <UserForm
        editingUser={editingUser}
        availableRoles={availableRoles}
        formLoading={formLoading}
        formError={formError}
        onCancel={onClose}
        onSubmit={onSubmit}
      />
    </Modal>
  );
}

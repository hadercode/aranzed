import { useState } from "react";
import { Tag, Plus } from "lucide-react";
import { PageHeader, Button, ConfirmDialog } from "@/shared/components/ui";
import { useReasonsQuery } from "../hooks";
import { ReasonTable, ReasonFormModal } from "../components";
import type { InventoryReason, CreateInventoryReasonDto } from "../types";

export function ReasonsPage() {
  const {
    reasons,
    isLoading,
    createReason,
    updateReason,
    deleteReason,
    isMutating,
  } = useReasonsQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReason, setEditingReason] = useState<InventoryReason | null>(
    null,
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleOpenCreate = () => {
    setEditingReason(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (r: InventoryReason) => {
    setEditingReason(r);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (data: CreateInventoryReasonDto) => {
    if (editingReason) {
      await updateReason({ id: editingReason.id, data });
    } else {
      await createReason(data);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    if (deletingId) {
      await deleteReason(deletingId);
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-8xl mx-auto pb-12 animate-in fade-in duration-300">
      <PageHeader
        title="Motivos de Inventario"
        description="Tipifique y justifique las entradas, salidas, mermas y ajustes de mercancía."
        icon={<Tag className="w-6 h-6 text-[var(--color-sage-600)]" />}
      >
        <Button
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={handleOpenCreate}
        >
          Nuevo Motivo
        </Button>
      </PageHeader>

      <ReasonTable
        reasons={reasons}
        isLoading={isLoading}
        onEdit={handleOpenEdit}
        onDelete={(id) => setDeletingId(id)}
      />

      <ReasonFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        reason={editingReason}
        onSubmit={handleFormSubmit}
        loading={isMutating}
      />

      <ConfirmDialog
        isOpen={!!deletingId}
        title="Eliminar Motivo"
        message="¿Está seguro de que desea eliminar este motivo de inventario?"
        confirmText="Eliminar"
        variant="danger"
        onConfirm={handleDelete}
        onClose={() => setDeletingId(null)}
      />
    </div>
  );
}

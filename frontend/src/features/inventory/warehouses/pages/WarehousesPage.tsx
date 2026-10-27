import { useState } from "react";
import { Warehouse as WarehouseIcon, Plus } from "lucide-react";
import { PageHeader, Button, ConfirmDialog } from "@/shared/components/ui";
import { useWarehousesQuery } from "../hooks";
import { WarehouseTable, WarehouseFormModal } from "../components";
import type { Warehouse, CreateWarehouseDto } from "../types";

export function WarehousesPage() {
  const {
    warehouses,
    isLoading,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse,
    isMutating,
  } = useWarehousesQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(
    null,
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleOpenCreate = () => {
    setEditingWarehouse(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (w: Warehouse) => {
    setEditingWarehouse(w);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (data: CreateWarehouseDto) => {
    if (editingWarehouse) {
      await updateWarehouse({ id: editingWarehouse.id, data });
    } else {
      await createWarehouse(data);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    if (deletingId) {
      await deleteWarehouse(deletingId);
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-8xl mx-auto pb-12 animate-in fade-in duration-300">
      <PageHeader
        title="Almacenes y Depósitos"
        description="Gestione las ubicaciones físicas de resguardo y defina el almacén principal de ventas."
        icon={
          <WarehouseIcon className="w-6 h-6 text-[var(--color-sage-600)]" />
        }
      >
        <Button
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={handleOpenCreate}
        >
          Nuevo Almacén
        </Button>
      </PageHeader>

      <WarehouseTable
        warehouses={warehouses}
        isLoading={isLoading}
        onEdit={handleOpenEdit}
        onDelete={(id) => setDeletingId(id)}
      />

      <WarehouseFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        warehouse={editingWarehouse}
        onSubmit={handleFormSubmit}
        loading={isMutating}
      />

      <ConfirmDialog
        isOpen={!!deletingId}
        title="Eliminar Almacén"
        message="¿Está seguro de que desea eliminar este almacén? Las existencias asociadas podrían quedar restringidas."
        confirmText="Eliminar"
        variant="danger"
        onConfirm={handleDelete}
        onClose={() => setDeletingId(null)}
      />
    </div>
  );
}

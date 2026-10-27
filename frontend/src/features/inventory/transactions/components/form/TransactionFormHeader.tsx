import { ArrowLeftRight } from "lucide-react";
import { FormHeader } from "@/shared/components/ui";
import type { UseTransactionFormReturn } from "../../hooks/useTransactionForm";

interface TransactionFormHeaderProps {
  formContext: UseTransactionFormReturn;
}

export function TransactionFormHeader({
  formContext,
}: TransactionFormHeaderProps) {
  const { isEditMode, isMutating, handleCancel } = formContext;

  return (
    <FormHeader
      backTo="/inventory/transactions"
      backText="Volver a Movimientos"
      title={
        isEditMode
          ? "Editar Movimiento de Inventario"
          : "Registrar Movimiento de Inventario"
      }
      description="Configure entradas, salidas por consumo/merma, transferencias entre depósitos o ajustes de inventario físico."
      icon={<ArrowLeftRight className="w-5 h-5 text-[var(--color-sage-600)]" />}
      onCancel={handleCancel}
      cancelDisabled={isMutating}
      submitFormId="inventory-transaction-form"
      submitText={isEditMode ? "Guardar Cambios" : "Registrar Movimiento"}
      isSubmitting={isMutating}
    />
  );
}

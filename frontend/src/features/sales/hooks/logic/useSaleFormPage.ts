import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSaleFormDataQuery } from '../queries/useSaleFormDataQuery';
import { useSaleMutations } from '../mutations/useSaleMutations';
import { useSaleForm } from './useSaleForm';
import type { SaleFormData } from '../../schemas';

export function useSaleFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const {
    sale,
    sellableProducts,
    allProducts,
    loadingInitial,
    loadError,
    refetchInitial,
  } = useSaleFormDataQuery(id);

  const {
    createSale,
    updateSale,
    isCreating,
    isUpdating,
    mutationError,
  } = useSaleMutations();

  const form = useSaleForm({
    initialSale: sale,
    availableProducts: sellableProducts,
  });

  const onSubmit = useCallback(
    async (data: SaleFormData) => {
      try {
        if (isEditMode && id) {
          await updateSale({ id, data });
          setSuccessMessage(
            data.status === 'COMPLETED'
              ? 'Venta actualizada y confirmada con éxito. El evento para inventario ha sido emitido.'
              : 'Documento actualizado con éxito.',
          );
        } else {
          const created = await createSale(data);
          const isQuotation = created.saleType === 'QUOTATION';
          setSuccessMessage(
            created.status === 'COMPLETED'
              ? `Venta #${created.saleNumber} registrada con éxito. Evento de dominio emitido para inventario.`
              : isQuotation
                ? `Cotización #${created.saleNumber} creada con éxito.`
                : `Venta #${created.saleNumber} registrada como borrador.`,
          );
        }
        setIsSuccessOpen(true);
      } catch (err: any) {
        console.error('Error al guardar documento de venta:', err);
      }
    },
    [isEditMode, id, updateSale, createSale],
  );

  const handleCloseSuccess = () => {
    setIsSuccessOpen(false);
    navigate('/sales');
  };

  const handleCancel = () => {
    navigate('/sales');
  };

  return {
    isEditMode,
    saleId: id,
    sale,
    allProducts,
    sellableProducts,
    loadingInitial,
    loadError,
    refetchInitial,
    isSaving: isCreating || isUpdating,
    mutationError: mutationError
      ? mutationError instanceof Error
        ? mutationError.message
        : String(mutationError)
      : null,
    isSuccessOpen,
    successMessage,
    handleCloseSuccess,
    handleCancel,
    form,
    handleSave: form.handleSubmit(onSubmit),
  };
}

export type UseSaleFormPageReturn = ReturnType<typeof useSaleFormPage>;

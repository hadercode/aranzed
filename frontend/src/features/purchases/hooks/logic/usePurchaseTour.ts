import { useCallback } from 'react';
import { driver, type Config } from 'driver.js';
import { usePurchaseTourStore } from '../../store/usePurchaseTourStore';
import '@/features/sales/components/tour/driver-theme.css';

export function usePurchaseTour() {
  const { completeTour, openIntroModal, hasCompletedPurchaseTour } =
    usePurchaseTourStore();

  const startInteractiveTour = useCallback(() => {
    const config: Config = {
      animate: true,
      showProgress: true,
      popoverClass: 'ministore-tour-popover',
      nextBtnText: 'Siguiente →',
      prevBtnText: '← Anterior',
      doneBtnText: '¡Entendido, listo!',
      progressText: 'Paso {{current}} de {{total}}',
      onDestroyed: () => {
        completeTour();
      },
      steps: [
        {
          element: '#tour-purchase-header',
          popover: {
            title: '1. Comprobante y Proveedor',
            description:
              'Ingresa el nombre o razón social del proveedor y el número de factura/control del emisor. Selecciona la moneda de compra (USD o Moneda Local).',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#tour-purchase-rate-status',
          popover: {
            title: '2. Tasa de Cambio y Estado',
            description:
              'Verifica o ajusta la tasa de cambio bimoneda del día. Elige "Guardar Borrador" para preparar la orden sin mover inventario, o "Completada" para sumar existencias físicas al almacén.',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#tour-purchase-items',
          popover: {
            title: '3. Detalle de Materiales e Insumos',
            description:
              'Haz clic en "Agregar Material" para incorporar materias primas del catálogo. Especifica cantidades recibidas, costo unitario y tratamiento de IVA (16% o exento).',
            side: 'top',
            align: 'center',
          },
        },
        {
          element: '#tour-purchase-summary',
          popover: {
            title: '4. Liquidación y Base Imponible',
            description:
              'Visualiza la conversión bimoneda en tiempo real, desglose de subtotal, base gravada, IVA calculado y total definitivo a liquidar.',
            side: 'top',
            align: 'center',
          },
        },
        {
          element: '#tour-purchase-sticky-bar',
          popover: {
            title: '5. Guardar Compra e Inventario',
            description:
              'Haz clic en "Guardar Compra" para formalizar la transacción. Al completarse, se emitirá automáticamente el evento desacoplado para actualizar el stock y costos de reposición.',
            side: 'top',
            align: 'end',
          },
        },
      ],
    };

    const driverObj = driver(config);
    driverObj.drive();
  }, [completeTour]);

  return {
    startInteractiveTour,
    openIntroModal,
    hasCompletedPurchaseTour,
  };
}


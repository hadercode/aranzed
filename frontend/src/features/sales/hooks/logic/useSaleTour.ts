import { useCallback } from 'react';
import { driver, type Config } from 'driver.js';
import { useSaleTourStore } from '../../store/useSaleTourStore';
import '../../components/tour/driver-theme.css';

export function useSaleTour() {
  const { completeTour, openIntroModal, hasCompletedSaleTour } = useSaleTourStore();

  const startInteractiveTour = useCallback(() => {
    const config: Config = {
      animate: true,
      showProgress: true,
      popoverClass: 'ministore-tour-popover',
      nextBtnText: 'Siguiente →',
      prevBtnText: '← Anterior',
      doneBtnText: '¡Entendido, a vender!',
      progressText: 'Paso {{current}} de {{total}}',
      onDestroyed: () => {
        completeTour();
      },
      steps: [
        {
          element: '#tour-sale-header',
          popover: {
            title: '1. Comprobante y Cliente',
            description:
              'Ingresa el nombre o razón social del cliente. Selecciona si el documento se cotiza/factura en USD o Moneda Local.',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#tour-sale-rate-status',
          popover: {
            title: '2. Tasa de Cambio y Estado',
            description:
              'Ajusta la tasa de cambio del día si es necesario. Selecciona "Guardar Borrador" si es una orden preliminar, o "Completada" para descontar existencias de inventario.',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#tour-sale-items',
          popover: {
            title: '3. Productos y Control de Stock',
            description:
              'Agrega los artículos vendidos usando el botón "Agregar Producto". Selecciona el artículo, ajusta cantidad, precio y descuento. El sistema valida el stock disponible al instante.',
            side: 'top',
            align: 'center',
          },
        },
        {
          element: '#tour-sale-summary',
          popover: {
            title: '4. Liquidación y Rentabilidad',
            description:
              'Consulta la conversión bimoneda en tiempo real, subtotales, IVA y el widget de Análisis de Rentabilidad Comercial que calcula el margen bruto de la operación.',
            side: 'top',
            align: 'center',
          },
        },
        {
          element: '#tour-sale-sticky-bar',
          popover: {
            title: '5. Guardar y Post-Venta',
            description:
              'Haz clic en "Guardar y Procesar" para registrar la venta. Desde la ventana de éxito podrás imprimir la nota de entrega o enviarla por WhatsApp al cliente.',
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
    hasCompletedSaleTour,
  };
}


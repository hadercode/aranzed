import { useCallback } from 'react';
import { driver, type Config } from 'driver.js';
import { useProductTourStore } from '../../store/useProductTourStore';
import '@/features/sales/components/tour/driver-theme.css';

export function useProductTour() {
  const { completeTour, openIntroModal, hasCompletedProductTour } =
    useProductTourStore();

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
          element: '#tour-product-type',
          popover: {
            title: '1. Tipo de Producto',
            description:
              'Selecciona la naturaleza del ítem: Producto Final (listo para la venta), Materia Prima (para producción o compras) o Servicio.',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#tour-product-basic-info',
          popover: {
            title: '2. Identificación y SKU',
            description:
              'Define el código SKU único (identificador comercial o de barras), el nombre descriptivo y detalles adicionales del producto.',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#tour-product-classification',
          popover: {
            title: '3. Unidad de Medida y Categoría',
            description:
              'Asigna la unidad de medida en la que se controla el stock (unidades, kg, metros, litros) y agrúpalo en una categoría comercial.',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#tour-product-pricing',
          popover: {
            title: '4. Estructura de Costos y Precios',
            description:
              'Establece el costo base unitario y el margen de ganancia deseado. El sistema calculará el precio de venta sugerido y la rentabilidad bruta en tiempo real.',
            side: 'top',
            align: 'start',
          },
        },
        {
          element: '#tour-product-media-status',
          popover: {
            title: '5. Imagen y Estado del Producto',
            description:
              'Carga una fotografía de referencia para reconocimiento visual rápido en el punto de venta (POS) y verifica que el estado esté Activo.',
            side: 'left',
            align: 'start',
          },
        },
        {
          element: '#tour-product-sticky-bar',
          popover: {
            title: '6. Guardar en Catálogo',
            description:
              'Confirma los datos configurados y haz clic en "Crear Producto" para ponerlo a disposición en inventario, ventas y recetas.',
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
    hasCompletedProductTour,
  };
}


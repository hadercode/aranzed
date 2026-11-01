import { useCallback } from 'react';
import { driver, type Config } from 'driver.js';
import { useRecipeTourStore } from '../../store/useRecipeTourStore';
import '@/features/sales/components/tour/driver-theme.css';

export function useRecipeTour() {
  const { completeTour, openIntroModal, hasCompletedRecipeTour } =
    useRecipeTourStore();

  const startInteractiveTour = useCallback(() => {
    const config: Config = {
      animate: true,
      showProgress: true,
      popoverClass: 'ministore-tour-popover',
      nextBtnText: 'Siguiente →',
      prevBtnText: '← Anterior',
      doneBtnText: '¡Entendido, a formular!',
      progressText: 'Paso {{current}} de {{total}}',
      onDestroyed: () => {
        completeTour();
      },
      steps: [
        {
          element: '#tour-recipe-header',
          popover: {
            title: '1. Producto a Fabricar y Rendimiento',
            description:
              'Indica el nombre de la fórmula, selecciona el producto terminado que se producirá y la cantidad base de rendimiento del lote (ej. 1 batch rinde 10 unidades).',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#tour-recipe-sync-cost',
          popover: {
            title: '2. Sincronización Automática de Costos',
            description:
              'Activa esta opción para que el costo de reposición del producto terminado se actualice de forma automática cuando fluctúe el precio de sus materias primas.',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#tour-recipe-cost-summary',
          popover: {
            title: '3. Resumen y Desglose de Costos',
            description:
              'Visualiza el costo total de materias primas, el costo de mano de obra y el costo unitario por cada producto final elaborado.',
            side: 'bottom',
            align: 'center',
          },
        },
        {
          element: '#tour-recipe-items',
          popover: {
            title: '4. Insumos y Lista de Materiales (BOM)',
            description:
              'Agrega cada materia prima requerida, su cantidad neta por lote, unidad de medida y el factor de desperdicio o merma esperada.',
            side: 'top',
            align: 'center',
          },
        },
        {
          element: '#tour-recipe-sticky-bar',
          popover: {
            title: '5. Guardar Fórmula / Receta',
            description:
              'Guarda la receta para que el módulo de manufactura/producción pueda generar órdenes de fabricación y descontar inventario de insumos con precisión.',
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
    hasCompletedRecipeTour,
  };
}


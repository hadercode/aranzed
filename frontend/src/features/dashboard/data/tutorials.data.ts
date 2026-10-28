export interface TutorialStep {
  stepNumber: number;
  title: string;
  description: string;
  icon?: string;
}

export interface TutorialItem {
  id: string;
  category: 'Compras' | 'Ventas' | 'Inventario' | 'Recetas';
  title: string;
  duration: string;
  badgeColor: 'cyan' | 'pink' | 'amber' | 'purple';
  summary: string;
  proTip: string;
  actionLabel: string;
  actionUrl: string;
  steps: TutorialStep[];
}

export const TUTORIALS_DATA: TutorialItem[] = [
  {
    id: 'compras',
    category: 'Compras',
    title: 'Cómo registrar compras de materiales e insumos',
    duration: '2 min',
    badgeColor: 'cyan',
    summary:
      'Aprende a registrar facturas de proveedores, ingresar insumos con sus costos y actualizar el stock y costo promedio de tus materias primas automáticamente.',
    proTip:
      'Mantener los costos de compra actualizados garantiza que tus precios de venta y márgenes de ganancia en recetas sean siempre precisos y rentables.',
    actionLabel: 'Registrar Nueva Compra',
    actionUrl: '/purchases/new',
    steps: [
      {
        stepNumber: 1,
        title: 'Seleccionar Proveedor y Datos Generales',
        description:
          'Ingresa a Compras > Nueva Compra. Elige el proveedor, la fecha de emisión del comprobante y el número de control fiscal o factura.',
      },
      {
        stepNumber: 2,
        title: 'Agregar Renglones de Insumos',
        description:
          'Busca las materias primas o empaques recibidos (rosas, cintas, bases, golosinas), especificando la cantidad y el costo unitario pactado.',
      },
      {
        stepNumber: 3,
        title: 'Verificar Totales e Impuestos',
        description:
          'El sistema suma en tiempo real los subtotales, impuestos aplicables y total de la compra sin margen de error manual.',
      },
      {
        stepNumber: 4,
        title: 'Completar y Guardar',
        description:
          'Al guardar la compra, tus almacenes reciben el stock entrante y se actualiza el último costo para calcular las fichas técnicas.',
      },
    ],
  },
  {
    id: 'ventas',
    category: 'Ventas',
    title: 'Cómo registrar ventas y procesar cobros',
    duration: '3 min',
    badgeColor: 'pink',
    summary:
      'Guía para crear cotizaciones o ventas directas, agregar productos fabricados y asentar pagos en múltiples divisas o métodos de pago.',
    proTip:
      'Puedes consultar el historial de pagos y el saldo pendiente de cada cliente en cualquier momento desde la sección de Cobros.',
    actionLabel: 'Ir a Nueva Venta',
    actionUrl: '/sales/new',
    steps: [
      {
        stepNumber: 1,
        title: 'Datos del Cliente o Venta Rápida',
        description:
          'Selecciona un cliente existente o utiliza "Consumidor Final" para ventas rápidas de mostrador sin datos fiscales.',
      },
      {
        stepNumber: 2,
        title: 'Selección de Productos y Combos',
        description:
          'Agrega los arreglos o detalles solicitados. Ajusta cantidades y aplica descuentos comerciales autorizados.',
      },
      {
        stepNumber: 3,
        title: 'Confirmación y Descuento de Stock',
        description:
          'Revisa el resumen de la orden y confirma la venta. El inventario se rebaja automáticamente en los almacenes correspondientes.',
      },
      {
        stepNumber: 4,
        title: 'Asignación de Pagos y Comprobante',
        description:
          'Registra el cobro en Efectivo, Pago Móvil, Zelle o Transferencia, admitiendo abonos parciales o liquidación total al contado.',
      },
    ],
  },
  {
    id: 'inventario',
    category: 'Inventario',
    title: 'Cómo realizar ajustes de stock y mermas',
    duration: '2 min',
    badgeColor: 'amber',
    summary:
      'Descubre cómo asentar diferencias de inventario físico, registrar mermas o daños en flores y empaques, y auditar la trazabilidad en el Kárdex.',
    proTip:
      'Revisa periódicamente el Reporte de Mermas para identificar insumos con alta merma y ajustar las cantidades planificadas en tus compras.',
    actionLabel: 'Nuevo Ajuste de Inventario',
    actionUrl: '/inventory/transactions/new',
    steps: [
      {
        stepNumber: 1,
        title: 'Identificar Almacén y Tipo',
        description:
          'Selecciona el almacén a intervenir (ej. Almacén Principal o Taller) y define el tipo de movimiento: Entrada Manual, Salida o Merma.',
      },
      {
        stepNumber: 2,
        title: 'Seleccionar Motivo Justificado',
        description:
          'Indica el motivo del movimiento (ej. "Conteo Físico", "Flores Marchitas", "Deterioro de Caja", "Muestra de Exhibición").',
      },
      {
        stepNumber: 3,
        title: 'Detallar Ítems y Cantidades',
        description:
          'Añade cada artículo con la cantidad exacta a corregir e incluye observaciones explicativas para el equipo de auditoría.',
      },
      {
        stepNumber: 4,
        title: 'Confirmar en Kárdex',
        description:
          'El sistema asienta el movimiento en el libro mayor de inventario con fecha, hora y usuario responsable.',
      },
    ],
  },
  {
    id: 'recetas',
    category: 'Recetas',
    title: 'Cómo crear recetas y costear productos finales (BOM)',
    duration: '3 min',
    badgeColor: 'purple',
    summary:
      'Aprende a desglosar los materiales necesarios para ensamblar un detalle o arreglo, calculando el costo real y el precio de venta sugerido.',
    proTip:
      'Si el costo de un insumo cambia en una nueva compra, la receta se recalcula automáticamente advirtiéndote si tu margen de ganancia se reduce.',
    actionLabel: 'Crear Nueva Receta',
    actionUrl: '/catalog/recipes/new',
    steps: [
      {
        stepNumber: 1,
        title: 'Seleccionar Producto a Fabricar',
        description:
          'Escoge el producto final del catálogo que vas a estructurar (ej. "Box Dulzura Romántica", "Ramo Buchón 50 Rosas").',
      },
      {
        stepNumber: 2,
        title: 'Añadir Componentes e Insumos',
        description:
          'Agrega cada material o ingrediente requerido: rosas, globos, bombones, cinta de tela, papel coreano y horas de mano de obra.',
      },
      {
        stepNumber: 3,
        title: 'Cálculo de Costo Real',
        description:
          'La receta totaliza el Costo Unitario de Producción según las compras reales, mostrando la participación porcentual de cada insumo.',
      },
      {
        stepNumber: 4,
        title: 'Margen y Precio de Venta',
        description:
          'Configura el porcentaje de ganancia esperado (ej. 45%) para generar el precio de venta sugerido de forma automática.',
      },
    ],
  },
];

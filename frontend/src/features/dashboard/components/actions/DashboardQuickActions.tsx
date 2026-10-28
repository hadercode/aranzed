import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  ShoppingCart,
  Boxes,
  BookOpen,
  Plus,
  PackagePlus,
} from 'lucide-react';

export function DashboardQuickActions() {
  const actions = [
    {
      label: 'Nueva Venta',
      description: 'Emitir orden de venta o cotización',
      path: '/sales',
      icon: <ShoppingBag className="w-4 h-4" />,
      color: 'from-rose-500/15 text-[#F43F5E] dark:text-[#FB7185] border-rose-500/25',
      badge: 'Ventas',
    },
    {
      label: 'Registrar Compra',
      description: 'Ingresar factura de materias primas',
      path: '/purchases/new',
      icon: <ShoppingCart className="w-4 h-4" />,
      color: 'from-cyan-500/15 text-[#22B2B8] dark:text-[#38D5DB] border-cyan-500/25',
      badge: 'Compras',
    },
    {
      label: 'Ajuste de Stock',
      description: 'Registrar conteo físico o mermas',
      path: '/inventory/transactions/new',
      icon: <Boxes className="w-4 h-4" />,
      color: 'from-amber-500/15 text-[#F59E0B] dark:text-[#FBBF24] border-amber-500/25',
      badge: 'Inventario',
    },
    {
      label: 'Nueva Receta (BOM)',
      description: 'Costear nuevo detalle o arreglo floral',
      path: '/catalog/recipes/new',
      icon: <BookOpen className="w-4 h-4" />,
      color: 'from-purple-500/15 text-[#8B5CF6] dark:text-[#A78BFA] border-purple-500/25',
      badge: 'Recetas',
    },
    {
      label: 'Nuevo Producto',
      description: 'Agregar producto o insumo al catálogo',
      path: '/catalog/products/new',
      icon: <PackagePlus className="w-4 h-4" />,
      color: 'from-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/25',
      badge: 'Catálogo',
    },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
          Acciones Rápidas
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {actions.map((act) => (
          <Link
            key={act.label}
            to={act.path}
            className="group p-3.5 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] shadow-[var(--shadow-organic-sm)] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <div
                className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${act.color} border flex items-center justify-center shrink-0 shadow-xs`}
              >
                {act.icon}
              </div>
              <Plus className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#22B2B8] transition-colors" />
            </div>

            <div>
              <span className="text-xs font-bold text-[var(--color-text-primary)] group-hover:text-[#22B2B8] transition-colors line-clamp-1">
                {act.label}
              </span>
              <p className="text-[10px] text-[var(--color-text-secondary)] mt-0.5 line-clamp-1">
                {act.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default DashboardQuickActions;

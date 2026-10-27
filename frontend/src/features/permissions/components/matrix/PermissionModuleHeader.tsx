import {
  Check,
  Layers,
  Package,
  FolderTree,
  Scale,
  Users,
  Shield,
  Building,
  FileText,
  ScrollText,
} from "lucide-react";

interface PermissionModuleHeaderProps {
  resource: string;
  activeCount: number;
  totalCount: number;
  allSelected: boolean;
  someSelected: boolean;
  onToggle: () => void;
}

const MODULE_METADATA: Record<
  string,
  { label: string; icon: React.ReactNode; category: string }
> = {
  products: {
    label: "Productos y Servicios",
    icon: <Package size={16} className="text-[var(--color-sage-600)] dark:text-[var(--color-sage-400)]" />,
    category: "Catálogo",
  },
  recipes: {
    label: "Recetas / BOM",
    icon: <ScrollText size={16} className="text-violet-600 dark:text-violet-400" />,
    category: "Catálogo",
  },
  categories: {
    label: "Categorías",
    icon: <FolderTree size={16} className="text-blue-600 dark:text-blue-400" />,
    category: "Catálogo",
  },
  uofm: {
    label: "Unidades de Medida",
    icon: <Scale size={16} className="text-amber-600 dark:text-amber-400" />,
    category: "Catálogo",
  },
  users: {
    label: "Usuarios",
    icon: <Users size={16} className="text-purple-600 dark:text-purple-400" />,
    category: "Seguridad / IAM",
  },
  roles: {
    label: "Roles y Permisos",
    icon: <Shield size={16} className="text-rose-600 dark:text-rose-400" />,
    category: "Seguridad / IAM",
  },
  company: {
    label: "Empresa y Ajustes",
    icon: <Building size={16} className="text-emerald-600 dark:text-emerald-400" />,
    category: "Configuración",
  },
  audit: {
    label: "Auditoría de Logs",
    icon: <FileText size={16} className="text-cyan-600 dark:text-cyan-400" />,
    category: "Seguridad / Monitoreo",
  },
};

export function PermissionModuleHeader({
  resource,
  activeCount,
  totalCount,
  allSelected,
  someSelected,
  onToggle,
}: PermissionModuleHeaderProps) {
  const meta = MODULE_METADATA[resource.toLowerCase()] || {
    label: `Módulo: ${resource}`,
    icon: <Layers size={16} className="text-[var(--color-sage-500)]" />,
    category: "Sistema",
  };

  return (
    <div
      onClick={onToggle}
      className="bg-[var(--color-surface-bg)] border-b border-[var(--color-border)] px-5 py-3.5 flex items-center justify-between cursor-pointer hover:bg-[var(--color-surface-hover)] transition-colors select-none group"
    >
      <div className="flex items-center gap-3">
        {/* Module Tri-state Checkbox */}
        <div
          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
            allSelected
              ? "bg-[var(--color-sage-500)] border-[var(--color-sage-500)] shadow-xs"
              : someSelected
              ? "bg-[var(--color-sage-500)]/20 border-[var(--color-sage-500)]"
              : "border-gray-300 dark:border-gray-600 group-hover:border-[var(--color-sage-500)]"
          }`}
        >
          {allSelected && (
            <Check size={14} className="text-white" strokeWidth={3} />
          )}
          {someSelected && (
            <div className="w-2.5 h-0.5 bg-[var(--color-sage-600)] dark:bg-[var(--color-sage-400)] rounded-full" />
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-[var(--color-surface-card)] border border-[var(--color-border)]">
            {meta.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-[var(--color-text-primary)] tracking-wide">
                {meta.label}
              </span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[var(--color-surface-card)] border border-[var(--color-border)] text-[var(--color-text-muted)]">
                {resource}
              </span>
            </div>
            <span className="text-[11px] text-[var(--color-text-muted)]">
              {meta.category}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span
          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full transition-colors ${
            allSelected
              ? "bg-[var(--color-sage-50)] text-[var(--color-sage-600)] dark:bg-[var(--color-sage-500)]/20 dark:text-[var(--color-sage-400)]"
              : activeCount > 0
              ? "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
              : "bg-[var(--color-surface-card)] text-[var(--color-text-secondary)] border border-[var(--color-border)]"
          }`}
        >
          {activeCount} de {totalCount} activos
        </span>
      </div>
    </div>
  );
}

export default PermissionModuleHeader;

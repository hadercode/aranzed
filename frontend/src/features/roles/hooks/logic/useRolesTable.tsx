import { Edit2, Trash2 } from "lucide-react";
import type { Role } from "../queries/useRolesQuery";
import type { Column } from "@/shared/components/ui/Table";

interface UseRolesTableProps {
  onEdit: (role: Role) => void;
  onDelete: (id: string) => void;
}

export function useRolesTable({ onEdit, onDelete }: UseRolesTableProps) {
  const columns: Column<Role>[] = [
    {
      key: "name",
      title: "Rol",
      render: (role) => (
        <span className="font-medium text-[var(--color-text-primary)]">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              role.name === "ADMIN" || role.name === "SUPER_ADMIN"
                ? "bg-purple-100 text-purple-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {role.name}
          </span>
        </span>
      ),
    },
    {
      key: "description",
      title: "Descripción",
      render: (role) =>
        role.description || (
          <span className="italic opacity-50">Sin descripción</span>
        ),
    },
    {
      key: "createdAt",
      title: "Fecha de Creación",
      render: (role) => (
        <span className="text-sm">
          {new Date(role.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "actions",
      title: "",
      align: "right",
      render: (role) => (
        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(role)}
            className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-sage-600)] bg-[var(--color-surface-bg)] hover:bg-[var(--color-sage-50)] rounded-lg transition-colors cursor-pointer"
            title="Editar rol"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => onDelete(role.id)}
            className="p-2 text-[var(--color-text-secondary)] hover:text-red-600 bg-[var(--color-surface-bg)] hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            title="Eliminar rol"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  return { columns };
}

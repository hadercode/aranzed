import { useMemo } from "react";
import { Edit2, Trash2 } from "lucide-react";
import type { User } from "../types/user";
import { Table, type Column } from "@/shared/components/ui/Table";

interface UsersTableProps {
  users: User[];
  loading: boolean;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
}

export function UsersTable({
  users,
  loading,
  onEdit,
  onDelete,
}: UsersTableProps) {
  const columns: Column<User>[] = useMemo(
    () => [
      {
        key: "email",
        title: "Email",
        render: (user) => (
          <span className="font-medium text-[var(--color-text-primary)]">
            {user.email}
          </span>
        ),
      },
      {
        key: "roles",
        title: "Roles",
        render: (user) => (
          <div className="flex gap-2 flex-wrap">
            {user.roles &&
              user.roles.map((role) => (
                <span
                  key={role}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    role === "ADMIN_ROLE"
                      ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                      : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                  }`}
                >
                  {role}
                </span>
              ))}
          </div>
        ),
      },
      {
        key: "createdAt",
        title: "Fecha Creación",
        render: (user) => (
          <span className="text-sm">
            {user.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : "-"}
          </span>
        ),
      },
      {
        key: "actions",
        title: "Acciones",
        align: "right",
        render: (user) => (
          <div className="flex justify-end gap-2">
            <button
              onClick={() => onEdit(user)}
              className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-sage-600)] bg-[var(--color-surface-bg)] hover:bg-[var(--color-sage-50)] dark:hover:bg-[var(--color-surface-hover)] rounded-lg transition-colors cursor-pointer"
              title="Editar"
            >
              <Edit2 size={18} />
            </button>
            <button
              onClick={() => onDelete(user.id)}
              className="p-2 text-[var(--color-text-secondary)] hover:text-red-600 bg-[var(--color-surface-bg)] hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
              title="Eliminar"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ),
      },
    ],
    [onEdit, onDelete]
  );

  return (
    <Table<User>
      columns={columns}
      data={users}
      loading={loading}
      emptyMessage="No se encontraron usuarios."
      rowKey={(user) => user.id}
    />
  );
}

export default UsersTable;

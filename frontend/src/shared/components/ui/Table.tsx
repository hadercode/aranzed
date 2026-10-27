import React from 'react';

export interface Column<T> {
  key: string;
  title: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
  render?: (item: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  rowKey?: (item: T) => string | number;
}

export function Table<T>({ 
  columns, 
  data, 
  loading = false, 
  emptyMessage = "No se encontraron resultados",
  rowKey = (item: any) => item.id
}: TableProps<T>) {
  return (
    <div className="bg-[var(--color-surface-card)] rounded-2xl shadow-[var(--shadow-organic)] border border-[var(--color-border)] overflow-hidden relative before:absolute before:top-0 before:left-0 before:right-0 before:h-[2.5px] before:bg-gradient-to-r before:from-[#22B2B8] before:via-[#8B5CF6] before:via-[#F43F5E] before:via-[#F97316] before:to-[#F59E0B] before:z-10">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[var(--color-surface-bg)] border-b border-[var(--color-border)]">
              {columns.map((col) => (
                <th 
                  key={col.key} 
                  className={`px-6 py-4 text-sm font-semibold text-[var(--color-text-primary)] ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'} ${col.className || ''}`}
                >
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center text-[var(--color-text-secondary)]">
                  Cargando...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center text-[var(--color-text-secondary)]">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, i) => {
                const key = rowKey(item) ?? i;
                return (
                  <tr key={key} className="hover:bg-[var(--color-surface-bg)]/50 transition-colors group">
                    {columns.map((col) => (
                      <td 
                        key={col.key} 
                        className={`px-6 py-4 text-[var(--color-text-secondary)] ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}`}
                      >
                        {col.render ? col.render(item) : (item as any)[col.key]}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

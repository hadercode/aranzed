export interface ActivityLogItem {
  user: string;
  action: string;
  date: string;
  status: 'Success' | 'Failed' | 'Pending';
}

interface DashboardActivityTableProps {
  logs: ActivityLogItem[];
}

export function DashboardActivityTable({ logs }: DashboardActivityTableProps) {
  return (
    <div className="lg:col-span-2 bg-[var(--color-surface-card)] rounded-2xl p-6 shadow-[var(--shadow-organic)] border border-[var(--color-border)]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-semibold text-lg text-[var(--color-text-primary)]">Registro de Actividad Reciente</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-xs text-[var(--color-text-secondary)] uppercase bg-transparent border-b border-[var(--color-border)]">
            <tr>
              <th className="px-4 py-3 font-medium">Usuario</th>
              <th className="px-4 py-3 font-medium">Operación</th>
              <th className="px-4 py-3 font-medium">Fecha</th>
              <th className="px-4 py-3 font-medium text-right">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {logs.map((item, idx) => (
              <tr key={idx} className="hover:bg-[var(--color-surface-hover)] transition-colors group">
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[var(--color-surface-hover)] rounded-full shrink-0"></div>
                    <span className="font-medium text-[var(--color-text-primary)] group-hover:text-[var(--color-sage-500)] transition-colors">
                      {item.user}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-[var(--color-text-secondary)]">{item.action}</td>
                <td className="px-4 py-4 whitespace-nowrap text-[var(--color-text-secondary)]">{item.date}</td>
                <td className="px-4 py-4 whitespace-nowrap text-right">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                      item.status === 'Success'
                        ? 'bg-[var(--color-sage-50)] text-[var(--color-sage-600)] border border-[var(--color-sage-100)]'
                        : item.status === 'Failed'
                        ? 'bg-red-50 text-red-950 border border-red-200 dark:bg-red-900/30 dark:border-red-800/40 dark:text-red-300'
                        : 'bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400'
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

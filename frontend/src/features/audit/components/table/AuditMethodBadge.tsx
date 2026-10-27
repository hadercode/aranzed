interface AuditMethodBadgeProps {
  method: string;
}

export function AuditMethodBadge({ method }: AuditMethodBadgeProps) {
  const getMethodStyle = (m: string) => {
    switch (m.toUpperCase()) {
      case 'GET':
        return 'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300';
      case 'POST':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300';
      case 'PUT':
      case 'PATCH':
        return 'bg-amber-100 text-amber-950 dark:bg-amber-900/50 dark:text-amber-300 font-semibold';
      case 'DELETE':
        return 'bg-rose-100 text-rose-950 dark:bg-rose-900/50 dark:text-rose-300 font-semibold';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <span
      className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${getMethodStyle(method)}`}
    >
      {method}
    </span>
  );
}

export default AuditMethodBadge;

interface AuditActionBadgeProps {
  action: string;
  hasModifications?: boolean;
}

export function AuditActionBadge({ action, hasModifications }: AuditActionBadgeProps) {
  const getActionStyle = (act: string) => {
    switch (act.toUpperCase()) {
      case 'CREATE':
      case 'REGISTER':
        return {
          bg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
          label: 'Creación',
        };
      case 'UPDATE':
      case 'CHANGE_PASSWORD':
      case 'UPLOAD_AVATAR':
      case 'UPLOAD_LOGO':
        return {
          bg: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200 dark:border-blue-800',
          label: 'Modificación',
        };
      case 'DELETE':
      case 'DELETE_AVATAR':
        return {
          bg: 'bg-rose-50 text-rose-950 dark:bg-rose-950/40 dark:text-rose-300 border-rose-300 dark:border-rose-800 font-semibold',
          label: 'Eliminación',
        };
      case 'LOGIN':
        return {
          bg: 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 border-purple-200 dark:border-purple-800',
          label: 'Inicio Sesión',
        };
      case 'ASSIGN_PERMISSION':
        return {
          bg: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
          label: 'Asignar Permiso',
        };
      default:
        return {
          bg: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700',
          label: act,
        };
    }
  };

  const style = getActionStyle(action);

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${style.bg}`}
      >
        {style.label}
      </span>
      {hasModifications && (
        <span className="inline-flex items-center text-[10px] text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-950/40 px-1.5 py-0.5 rounded">
          Δ Diferencial
        </span>
      )}
    </div>
  );
}

export default AuditActionBadge;

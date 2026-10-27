import { Search, X } from 'lucide-react';
import { useAuditContext } from '../../context';
import { AuditDateRangePicker } from './AuditDateRangePicker';

export interface AuditFilterBarProps {
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  selectedModel?: string;
  onModelChange?: (value: string) => void;
  selectedAction?: string;
  onActionChange?: (value: string) => void;
  selectedStatus?: string;
  onStatusChange?: (value: string) => void;
  startDate?: string;
  onStartDateChange?: (value: string) => void;
  endDate?: string;
  onEndDateChange?: (value: string) => void;
  onClearFilters?: () => void;
}

export function AuditFilterBar({
  searchTerm: propSearchTerm,
  onSearchChange: propOnSearchChange,
  selectedModel: propSelectedModel,
  onModelChange: propOnModelChange,
  selectedAction: propSelectedAction,
  onActionChange: propOnActionChange,
  selectedStatus: propSelectedStatus,
  onStatusChange: propOnStatusChange,
  startDate: propStartDate,
  onStartDateChange: propOnStartDateChange,
  endDate: propEndDate,
  onEndDateChange: propOnEndDateChange,
  onClearFilters: propOnClearFilters,
}: AuditFilterBarProps) {
  const context = useAuditContext();

  const searchTerm = propSearchTerm ?? context.searchTerm;
  const onSearchChange = propOnSearchChange ?? context.handleSearchChange;
  const selectedModel = propSelectedModel ?? context.selectedModel;
  const onModelChange = propOnModelChange ?? context.handleModelChange;
  const selectedAction = propSelectedAction ?? context.selectedAction;
  const onActionChange = propOnActionChange ?? context.handleActionChange;
  const selectedStatus = propSelectedStatus ?? context.selectedStatus;
  const onStatusChange = propOnStatusChange ?? context.handleStatusChange;
  const startDate = propStartDate ?? context.startDate;
  const onStartDateChange = propOnStartDateChange ?? context.handleStartDateChange;
  const endDate = propEndDate ?? context.endDate;
  const onEndDateChange = propOnEndDateChange ?? context.handleEndDateChange;
  const onClearFilters = propOnClearFilters ?? context.clearAllFilters;

  return (
    <div className="p-4.5 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] shadow-sm space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
        {/* Search Input */}
        <div className="lg:col-span-2 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por usuario, descripción, ID, IP o ruta..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-sm border border-[var(--color-border)] bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)]/30 focus:border-[var(--color-sage-500)] transition-all"
          />
        </div>

        {/* Model Filter */}
        <div>
          <select
            value={selectedModel}
            onChange={(e) => onModelChange(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-sm border border-[var(--color-border)] bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)]/30 focus:border-[var(--color-sage-500)] transition-all"
          >
            <option value="">Todos los Módulos</option>
            <option value="Usuario">Usuario</option>
            <option value="Rol">Rol</option>
            <option value="Empresa">Empresa</option>
            <option value="Perfil">Perfil</option>
            <option value="Autenticación">Autenticación</option>
            <option value="Permisos">Permisos</option>
          </select>
        </div>

        {/* Action Filter */}
        <div>
          <select
            value={selectedAction}
            onChange={(e) => onActionChange(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-sm border border-[var(--color-border)] bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)]/30 focus:border-[var(--color-sage-500)] transition-all"
          >
            <option value="">Todas las Acciones</option>
            <option value="UPDATE">Modificación (UPDATE)</option>
            <option value="CREATE">Creación (CREATE)</option>
            <option value="DELETE">Eliminación (DELETE)</option>
            <option value="LOGIN">Inicio de Sesión (LOGIN)</option>
            <option value="CHANGE_PASSWORD">Cambio de Contraseña</option>
            <option value="UPLOAD_LOGO">Subida de Logo</option>
            <option value="UPLOAD_AVATAR">Subida de Avatar</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-sm border border-[var(--color-border)] bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)]/30 focus:border-[var(--color-sage-500)] transition-all"
          >
            <option value="">Cualquier Estado</option>
            <option value="SUCCESS">Exitoso (SUCCESS)</option>
            <option value="FAILED">Fallido (FAILED)</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={onClearFilters}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] border border-transparent hover:border-[var(--color-border)] transition-all cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Limpiar filtros</span>
          </button>
        </div>
      </div>

      {/* Date Filters Row */}
      <AuditDateRangePicker
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={onStartDateChange}
        onEndDateChange={onEndDateChange}
      />
    </div>
  );
}

export default AuditFilterBar;

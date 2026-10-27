import { User as UserIcon, Globe, Database } from 'lucide-react';
import type { AuditLog } from '../../types/audit';

interface AuditMetadataTabProps {
  log: AuditLog;
}

export function AuditMetadataTab({ log }: AuditMetadataTabProps) {
  return (
    <div className="space-y-4">
      {log.errorMessage && (
        <div className="alert-danger p-4 rounded-xl border border-rose-300 dark:border-rose-900 text-rose-950 dark:text-rose-300 text-xs font-medium">
          <span className="font-bold block mb-1">Detalle del Error Capturado:</span>
          <p className="font-mono">{log.errorMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        {/* Identidad del Usuario */}
        <div className="p-4 rounded-xl bg-[var(--color-surface-bg)] border border-[var(--color-border)] space-y-3">
          <h3 className="font-bold text-sm text-[var(--color-text-primary)] flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-[var(--color-sage-500)]" />
            <span>Identidad del Usuario</span>
          </h3>
          <div className="space-y-2">
            <div>
              <span className="text-gray-400 block text-[11px]">Email del Usuario:</span>
              <span className="font-semibold text-[var(--color-text-primary)]">
                {log.userEmail || 'No autenticado / Invitado'}
              </span>
            </div>
            <div>
              <span className="text-gray-400 block text-[11px]">ID de Usuario (UUID):</span>
              <span className="font-mono text-gray-600 dark:text-gray-300">
                {log.userId || 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-gray-400 block text-[11px]">Nombre Registrado:</span>
              <span className="text-[var(--color-text-primary)]">
                {log.userName || 'No especificado'}
              </span>
            </div>
          </div>
        </div>

        {/* Red y Cliente */}
        <div className="p-4 rounded-xl bg-[var(--color-surface-bg)] border border-[var(--color-border)] space-y-3">
          <h3 className="font-bold text-sm text-[var(--color-text-primary)] flex items-center gap-2">
            <Globe className="w-4 h-4 text-sky-500" />
            <span>Red y Cliente</span>
          </h3>
          <div className="space-y-2">
            <div>
              <span className="text-gray-400 block text-[11px]">Dirección IP de Origen:</span>
              <span className="font-mono font-semibold text-[var(--color-text-primary)]">
                {log.ipAddress}
              </span>
            </div>
            <div>
              <span className="text-gray-400 block text-[11px]">Agente de Usuario (User-Agent):</span>
              <span className="text-gray-600 dark:text-gray-400 break-words block max-h-16 overflow-y-auto">
                {log.userAgent || 'Desconocido'}
              </span>
            </div>
            <div>
              <span className="text-gray-400 block text-[11px]">Duración de la Ejecución:</span>
              <span className="font-mono font-semibold text-amber-700 dark:text-amber-300">
                {log.durationMs} milisegundos
              </span>
            </div>
          </div>
        </div>

        {/* Petición HTTP & Modelo Destino */}
        <div className="sm:col-span-2 p-4 rounded-xl bg-[var(--color-surface-bg)] border border-[var(--color-border)] space-y-3">
          <h3 className="font-bold text-sm text-[var(--color-text-primary)] flex items-center gap-2">
            <Database className="w-4 h-4 text-purple-500" />
            <span>Petición HTTP & Modelo Destino</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <span className="text-gray-400 block text-[11px]">Método y Endpoint:</span>
              <span className="font-mono font-semibold text-[var(--color-text-primary)]">
                {log.method} {log.endpoint}
              </span>
            </div>
            <div>
              <span className="text-gray-400 block text-[11px]">Módulo / Modelo:</span>
              <span className="font-semibold text-[var(--color-text-primary)]">
                {log.model}
              </span>
            </div>
            <div>
              <span className="text-gray-400 block text-[11px]">ID de la Entidad:</span>
              <span className="font-mono text-gray-600 dark:text-gray-300">
                {log.entityId || 'No asociado'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuditMetadataTab;

import type { SaleStatus } from '../../types';

export interface SalesStatusBadgeProps {
  status: SaleStatus;
}

export function SalesStatusBadge({ status }: SalesStatusBadgeProps) {
  switch (status) {
    case 'COMPLETED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/15 text-[#22B2B8] dark:text-[#38D5DB] border border-cyan-500/30 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22B2B8]" />
          Completada
        </span>
      );
    case 'PENDING':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-[#F59E0B] dark:text-[#FBBF24] border border-amber-500/30 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse" />
          Pendiente
        </span>
      );
    case 'CANCELLED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-pink-500/15 text-[#F43F5E] dark:text-[#FB7185] border border-pink-500/30 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F43F5E]" />
          Anulada
        </span>
      );
    case 'DRAFT':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/15 text-[#8B5CF6] dark:text-[#A78BFA] border border-purple-500/30 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
          Borrador
        </span>
      );
  }
}

import { Clock, CheckCircle2, WalletCards } from 'lucide-react';
import type { SalePaidStatus } from '../../types';

export interface SalesPaidBadgeProps {
  paidStatus?: SalePaidStatus | null;
  className?: string;
}

export function SalesPaidBadge({ paidStatus = 'PENDIENTE', className = '' }: SalesPaidBadgeProps) {
  const status = paidStatus || 'PENDIENTE';

  switch (status) {
    case 'PAGADO':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/15 text-[#22B2B8] dark:text-[#38D5DB] border border-cyan-500/30 shadow-xs ${className}`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-[#22B2B8] dark:text-[#38D5DB]" />
          <span>Pagado</span>
        </span>
      );

    case 'ABONADO':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-[#8B5CF6] dark:text-[#A78BFA] border border-purple-500/30 shadow-xs ${className}`}
        >
          <WalletCards className="w-3.5 h-3.5 text-[#8B5CF6] dark:text-[#A78BFA]" />
          <span>Abonado</span>
        </span>
      );

    case 'PENDIENTE':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-[#F59E0B] dark:text-[#FBBF24] border border-amber-500/30 shadow-xs ${className}`}
        >
          <Clock className="w-3.5 h-3.5 text-[#F59E0B] dark:text-[#FBBF24]" />
          <span>Pendiente</span>
        </span>
      );
  }
}

export default SalesPaidBadge;

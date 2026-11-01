import { HelpCircle, Sparkles } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import { usePurchaseTourStore } from '../../store/usePurchaseTourStore';

export interface PurchaseTourLauncherProps {
  className?: string;
  variant?: 'button' | 'icon' | 'badge';
}

export function PurchaseTourLauncher({
  className = '',
  variant = 'button',
}: PurchaseTourLauncherProps) {
  const { openIntroModal } = usePurchaseTourStore();

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={openIntroModal}
        className={`p-2 rounded-xl text-[var(--color-brand-cyan)] bg-[var(--color-primary-50)] hover:bg-[var(--color-primary-100)] border border-[var(--color-border)] transition-all cursor-pointer shadow-xs ${className}`}
        title="Guía Interactiva de Compras"
      >
        <Sparkles className="w-4 h-4" />
      </button>
    );
  }

  if (variant === 'badge') {
    return (
      <button
        type="button"
        onClick={openIntroModal}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-[var(--color-brand-cyan)] bg-[var(--color-primary-50)] hover:bg-[var(--color-primary-100)] border border-[var(--color-brand-cyan)]/20 transition-all cursor-pointer ${className}`}
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>Guía de Compra</span>
      </button>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={openIntroModal}
      leftIcon={<HelpCircle className="w-4 h-4 text-[var(--color-brand-cyan)]" />}
      className={className}
    >
      Guía Interactiva
    </Button>
  );
}

export default PurchaseTourLauncher;


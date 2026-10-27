import { Sparkles } from "lucide-react";

export function AvatarTipsSidebar() {
  return (
    <div className="space-y-6">
      <div className="bg-[var(--color-surface-card)] p-6 rounded-2xl border border-[var(--color-border)] shadow-sm space-y-4">
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[var(--color-sage-500)]" />
          <span>Recomendaciones</span>
        </h3>
        <ul className="text-xs text-[var(--color-text-secondary)] space-y-2.5">
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-sage-500)] font-bold">•</span>
            <span>Usa una foto donde tu rostro sea claramente visible y esté centrado.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-sage-500)] font-bold">•</span>
            <span>Las dimensiones ideales son cuadradas de al menos 400x400 píxeles.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-sage-500)] font-bold">•</span>
            <span>Evita imágenes con fondos demasiado saturados o con poca luz.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default AvatarTipsSidebar;

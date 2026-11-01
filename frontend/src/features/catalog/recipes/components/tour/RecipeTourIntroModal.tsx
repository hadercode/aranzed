import { useNavigate, useLocation } from 'react-router-dom';
import {
  PackageCheck,
  Scale,
  Sparkles,
  FlaskConical,
  X,
} from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import { useRecipeTourStore } from '../../store/useRecipeTourStore';
import { useRecipeTour } from '../../hooks/logic/useRecipeTour';

export function RecipeTourIntroModal() {
  const { isIntroModalOpen, closeIntroModal, setShouldAutoStartTour } =
    useRecipeTourStore();
  const { startInteractiveTour } = useRecipeTour();
  const navigate = useNavigate();
  const location = useLocation();

  if (!isIntroModalOpen) return null;

  const handleStartTour = () => {
    closeIntroModal();

    if (!location.pathname.includes('/catalog/recipes/new')) {
      setShouldAutoStartTour(true);
      navigate('/catalog/recipes/new');
      return;
    }

    setTimeout(() => {
      startInteractiveTour();
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6 relative">
        {/* Botón cerrar */}
        <button
          onClick={closeIntroModal}
          className="absolute top-5 right-5 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] p-1 rounded-xl hover:bg-[var(--color-surface-hover)] transition-colors"
          title="Cerrar ventana"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Encabezado */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-700 dark:text-teal-300 mb-1 border border-teal-500/20">
              Guía Interactiva
            </div>
            <h3 className="text-lg font-bold text-[var(--color-text-primary)]">
              Recetas y Fórmulas (BOM): Paso Cero
            </h3>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
              Antes de configurar una receta de fabricación, asegúrate de contar con estos 3 requisitos:
            </p>
          </div>
        </div>

        {/* Checklist Paso Cero */}
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[var(--color-surface-bg)] border border-[var(--color-border)]">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
              <PackageCheck className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <p className="font-semibold text-[var(--color-text-primary)]">
                1. Producto Terminado en Catálogo
              </p>
              <p className="text-[var(--color-text-secondary)] mt-0.5 leading-relaxed">
                El producto final que elaborarás debe estar previamente creado en el catálogo de productos con tipo manufacturado o vendible.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[var(--color-surface-bg)] border border-[var(--color-border)]">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
              <FlaskConical className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <p className="font-semibold text-[var(--color-text-primary)]">
                2. Materias Primas con Costo Unitario
              </p>
              <p className="text-[var(--color-text-secondary)] mt-0.5 leading-relaxed">
                Los componentes e insumos deben estar registrados con sus unidades de medida (kg, gr, lts, metros) y su costo de adquisición.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[var(--color-surface-bg)] border border-[var(--color-border)]">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
              <Scale className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <p className="font-semibold text-[var(--color-text-primary)]">
                3. Rendimiento del Lote y Porcentaje de Merma
              </p>
              <p className="text-[var(--color-text-secondary)] mt-0.5 leading-relaxed">
                Ten definido el tamaño del lote producido (ej: 1 batch rinde 20 unidades) y los factores de desperdicio previstos en la producción.
              </p>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-[var(--color-border)]">
          <Button variant="ghost" size="sm" onClick={closeIntroModal}>
            Cerrar
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleStartTour}
            leftIcon={<Sparkles className="w-4 h-4" />}
          >
            Iniciar Tour en Pantalla
          </Button>
        </div>
      </div>
    </div>
  );
}

export default RecipeTourIntroModal;


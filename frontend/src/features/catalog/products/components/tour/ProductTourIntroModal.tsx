import { useNavigate, useLocation } from 'react-router-dom';
import {
  Layers,
  Coins,
  Scale,
  X,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import { useProductTourStore } from '../../store/useProductTourStore';
import { useProductTour } from '../../hooks/logic/useProductTour';

export function ProductTourIntroModal() {
  const { isIntroModalOpen, closeIntroModal, setShouldAutoStartTour } =
    useProductTourStore();
  const { startInteractiveTour } = useProductTour();
  const navigate = useNavigate();
  const location = useLocation();

  if (!isIntroModalOpen) return null;

  const handleStartTour = () => {
    closeIntroModal();

    if (!location.pathname.includes('/catalog/products/new')) {
      setShouldAutoStartTour(true);
      navigate('/catalog/products/new');
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
              Catálogo de Productos: Paso Cero
            </h3>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
              Antes de crear un artículo en el catálogo, ten en cuenta estos 3 aspectos clave:
            </p>
          </div>
        </div>

        {/* Checklist Paso Cero */}
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[var(--color-surface-bg)] border border-[var(--color-border)]">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
              <Layers className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <p className="font-semibold text-[var(--color-text-primary)]">
                1. Clasificación y Tipo de Artículo
              </p>
              <p className="text-[var(--color-text-secondary)] mt-0.5 leading-relaxed">
                Determina si es un Producto Final (listo para la venta), Materia Prima (insumo para compras y recetas) o un Servicio.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[var(--color-surface-bg)] border border-[var(--color-border)]">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
              <Scale className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <p className="font-semibold text-[var(--color-text-primary)]">
                2. Unidad de Medida (UOM) y SKU
              </p>
              <p className="text-[var(--color-text-secondary)] mt-0.5 leading-relaxed">
                Define cómo medirás el inventario (Piezas/Unidades, Kg, Metros, Litros) y ten a mano un código SKU único o código de barras.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[var(--color-surface-bg)] border border-[var(--color-border)]">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <Coins className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <p className="font-semibold text-[var(--color-text-primary)]">
                3. Costo Base y Margen Deseado
              </p>
              <p className="text-[var(--color-text-secondary)] mt-0.5 leading-relaxed">
                Ingresa el costo de adquisición; el sistema te ayudará a calcular el precio de venta final según el margen de ganancia que establezcas.
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

export default ProductTourIntroModal;


import { useState } from 'react';
import { Sparkles, BookOpen } from 'lucide-react';
import { TUTORIALS_DATA, type TutorialItem } from '../../data/tutorials.data';
import { TutorialCard } from './TutorialCard';
import { TutorialModal } from './TutorialModal';

export function TutorialSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [activeTutorial, setActiveTutorial] = useState<TutorialItem | null>(null);

  const categories = ['Todos', 'Compras', 'Ventas', 'Inventario', 'Recetas'];

  const filteredTutorials =
    selectedCategory === 'Todos'
      ? TUTORIALS_DATA
      : TUTORIALS_DATA.filter((t) => t.category === selectedCategory);

  return (
    <section className="space-y-4 mb-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-pink-500/15 text-[#F43F5E] dark:bg-pink-500/25 dark:text-[#FB7185] flex items-center justify-center shrink-0">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
              Guías Rápidas y Flujos Operativos
            </h2>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
            Aprende los procesos clave para operar tu tienda y taller con Aranzed
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#22B2B8] to-[#8B5CF6] text-white shadow-xs'
                    : 'bg-[var(--color-surface-card)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tutorials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredTutorials.map((tutorial) => (
          <TutorialCard
            key={tutorial.id}
            tutorial={tutorial}
            onSelect={(item) => setActiveTutorial(item)}
          />
        ))}
      </div>

      {/* Pro Help Banner */}
      <div className="rounded-2xl p-4 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 border border-pink-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#22B2B8] via-[#8B5CF6] to-[#F43F5E] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-[var(--color-text-primary)]">
              ¿Tienes dudas con un flujo especial?
            </span>
            <p className="text-[11px] text-[var(--color-text-secondary)]">
              Puedes hacer clic en cualquier tutorial para ver la guía paso a paso con recomendaciones de rentabilidad.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Modal */}
      <TutorialModal
        tutorial={activeTutorial}
        isOpen={!!activeTutorial}
        onClose={() => setActiveTutorial(null)}
      />
    </section>
  );
}

export default TutorialSection;

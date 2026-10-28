import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { SearchIcon } from "./icons";
import {
  usePermittedNavItems,
  type PermittedNavItem,
} from "@/shared/hooks/ui/usePermittedNavItems";
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CornerDownLeft,
  X,
} from "lucide-react";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

function normalizeText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export const SearchModal = ({
  isOpen,
  onClose,
  searchQuery,
  onSearchChange,
}: SearchModalProps) => {
  const navigate = useNavigate();
  const { permittedItems, quickActions, userRoleBadge } = usePermittedNavItems();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  // Focus input automatically when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Filter items according to search query
  const filteredItems = useMemo(() => {
    const query = normalizeText(searchQuery);
    if (!query) return permittedItems;

    return permittedItems.filter((item) => {
      const matchTitle = normalizeText(item.title).includes(query);
      const matchSection = normalizeText(item.section).includes(query);
      const matchPath = normalizeText(item.path).includes(query);
      const matchDesc = normalizeText(item.description).includes(query);
      const matchKeywords = item.keywords.some((kw) =>
        normalizeText(kw).includes(query)
      );

      return matchTitle || matchSection || matchPath || matchDesc || matchKeywords;
    });
  }, [permittedItems, searchQuery]);

  // Adjust selectedIndex if out of bounds
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  const handleSelect = (item: PermittedNavItem) => {
    onClose();
    onSearchChange("");
    navigate(item.path);
  };

  // Keyboard navigation inside the search modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          filteredItems.length > 0 ? (prev + 1) % filteredItems.length : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          filteredItems.length > 0
            ? (prev - 1 + filteredItems.length) % filteredItems.length
            : 0
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredItems.length > 0 && filteredItems[selectedIndex]) {
          handleSelect(filteredItems[selectedIndex]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex]);

  // Scroll active item into view
  useEffect(() => {
    if (resultsContainerRef.current) {
      const activeEl = resultsContainerRef.current.querySelector(
        `[data-search-index="${selectedIndex}"]`
      ) as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-start justify-center pt-[10vh] sm:pt-[15vh] px-3 sm:px-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-[var(--color-surface-card)] w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-[var(--color-border)] flex flex-col max-h-[75vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Search Input */}
        <div className="flex items-center px-4 py-3.5 sm:px-5 sm:py-4 border-b border-[var(--color-border)] gap-3 bg-[var(--color-surface-card)] sticky top-0 z-10">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-[#22B2B8] flex items-center justify-center shrink-0 border border-cyan-500/20">
            <SearchIcon className="w-4 h-4" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar menú o acceso rápido (ej. ventas, recetas, compras)..."
            className="flex-1 bg-transparent border-none outline-none text-sm sm:text-base text-[var(--color-text-primary)] placeholder-gray-400 font-medium"
          />

          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-[var(--color-surface-hover)] transition-colors"
              title="Borrar búsqueda"
              type="button"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-mono text-[var(--color-text-secondary)] bg-[var(--color-surface-hover)] rounded-lg border border-[var(--color-border)] shrink-0">
            ESC
          </kbd>
        </div>

        {/* Quick Actions Pills (shown when query is empty) */}
        {!searchQuery && quickActions.length > 0 && (
          <div className="px-4 sm:px-5 py-3 border-b border-[var(--color-border)] bg-[var(--color-surface-bg)]/50">
            <p className="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#F43F5E]" />
              Accesos Rápidos Recomendados
            </p>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => handleSelect(action)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[var(--color-surface-card)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-[var(--color-text-primary)] transition-all hover:border-[#22B2B8] shrink-0 shadow-xs cursor-pointer"
                  type="button"
                >
                  {action.icon}
                  <span>{action.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results / Navigation List */}
        <div
          ref={resultsContainerRef}
          className="flex-1 overflow-y-auto px-2 sm:px-3 py-2 divide-y divide-[var(--color-border)]/50 space-y-1"
        >
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3 text-gray-400">
                <SearchIcon className="w-6 h-6" />
              </div>
              <p className="font-semibold text-sm text-[var(--color-text-primary)]">
                No se encontraron menús para "{searchQuery}"
              </p>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1 max-w-sm mx-auto">
                Verifica el término o consulta si tu rol de usuario tiene asignados los permisos necesarios para esa sección.
              </p>
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  data-search-index={idx}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`group flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${
                    isSelected
                      ? "bg-gradient-to-r from-cyan-500/10 via-purple-500/5 to-transparent border border-cyan-500/30 shadow-xs"
                      : "hover:bg-[var(--color-surface-hover)] border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0 flex-1 pr-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                        isSelected
                          ? "bg-white dark:bg-gray-800 border-cyan-500/40 shadow-xs scale-105"
                          : "bg-[var(--color-surface-hover)] border-transparent"
                      }`}
                    >
                      {item.icon}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`font-semibold text-sm transition-colors ${
                            isSelected
                              ? "text-[#22B2B8] dark:text-[#38D5DB]"
                              : "text-[var(--color-text-primary)]"
                          }`}
                        >
                          {item.title}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] border border-[var(--color-border)]">
                          {item.section}
                        </span>
                        {item.isQuickAction && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20">
                            Acceso Rápido
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[var(--color-text-secondary)] truncate mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="hidden sm:inline-block text-[11px] font-mono text-gray-400 opacity-60 group-hover:opacity-100 transition-opacity">
                      {item.path}
                    </span>
                    {isSelected ? (
                      <div className="w-7 h-7 rounded-lg bg-cyan-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <CornerDownLeft className="w-3.5 h-3.5" />
                      </div>
                    ) : (
                      <ArrowRight className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer with Role indicator and keyboard shortcuts */}
        <div className="px-4 sm:px-5 py-3 border-t border-[var(--color-border)] bg-[var(--color-surface-bg)] flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#22B2B8] shrink-0" />
            <span className="font-medium truncate max-w-[200px] sm:max-w-none">
              Nivel: <strong className="text-[var(--color-text-primary)]">{userRoleBadge.label}</strong> ({permittedItems.length} accesos)
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-[11px] font-mono">
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-[var(--color-surface-card)] border border-[var(--color-border)]">↑↓</kbd> Navegar
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-[var(--color-surface-card)] border border-[var(--color-border)]">↵</kbd> Abrir
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-[var(--color-surface-card)] border border-[var(--color-border)]">ESC</kbd> Cerrar
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;

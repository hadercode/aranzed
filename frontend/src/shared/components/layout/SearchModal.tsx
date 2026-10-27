import { SearchIcon } from "./icons";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const SearchModal = ({
  isOpen,
  onClose,
  searchQuery,
  onSearchChange,
}: SearchModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-start justify-center pt-[20vh]"
      onClick={onClose}
    >
      <div
        className="bg-[var(--color-surface-card)] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-[var(--color-border)] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3 border-b border-[var(--color-border)]">
          <SearchIcon className="w-5 h-5 text-gray-400 mr-3" />
          <input
            autoFocus
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search users, roles, or settings..."
            className="flex-1 bg-transparent border-none outline-none text-[var(--color-text-primary)] placeholder-gray-400"
          />
          <kbd className="hidden md:inline-block px-2 py-0.5 text-xs font-mono text-[var(--color-text-secondary)] bg-[var(--color-surface-hover)] rounded border border-[var(--color-border)]">
            ESC
          </kbd>
        </div>
        {/* Modal Content / Results Placeholder */}
      </div>
    </div>
  );
};

export default SearchModal;

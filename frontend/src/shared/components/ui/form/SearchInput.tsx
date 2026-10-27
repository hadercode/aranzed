import { forwardRef, type InputHTMLAttributes } from 'react';
import { Search, X } from 'lucide-react';

export interface SearchInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  containerClassName?: string;
  onClear?: () => void;
  showClearButton?: boolean;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      value,
      onChange,
      placeholder = 'Buscar...',
      className = '',
      containerClassName = '',
      onClear,
      showClearButton = true,
      ...props
    },
    ref
  ) => {
    const hasValue = Boolean(value && String(value).length > 0);

    return (
      <div className={`relative ${containerClassName}`}>
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none" />
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full pl-10 ${
            showClearButton && onClear && hasValue ? 'pr-9' : 'pr-4'
          } py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-bg)] text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)]/30 focus:border-[var(--color-sage-500)] transition-all ${className}`}
          {...props}
        />
        {showClearButton && onClear && hasValue && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors p-0.5 rounded-md focus:outline-none"
            aria-label="Limpiar búsqueda"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';

export default SearchInput;

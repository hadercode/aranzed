# Frontend Feature Architecture Boilerplate

Complete reference template for creating a new frontend feature in `src/features/<feature>/`.

---

## 1. Context Files (`context/`)

### `context/<feature>ContextDefinition.ts`
```typescript
import { createContext } from 'react';
import type { UseFeaturePageReturn } from '../hooks/logic/useFeaturePage';

export type FeatureContextType = UseFeaturePageReturn;

export const FeatureContext = createContext<FeatureContextType | undefined>(undefined);
```

### `context/use<Feature>Context.ts`
```typescript
import { useContext } from 'react';
import { FeatureContext } from './<feature>ContextDefinition';
import type { FeatureContextType } from './<feature>ContextDefinition';

export function useFeatureContext(): FeatureContextType {
  const context = useContext(FeatureContext);
  if (!context) {
    throw new Error('useFeatureContext debe ser utilizado dentro de un FeatureProvider');
  }
  return context;
}
```

### `context/<Feature>Context.tsx`
```typescript
import type { ReactNode } from 'react';
import { FeatureContext } from './<feature>ContextDefinition';
import { useFeaturePage } from '../hooks/logic/useFeaturePage';

export interface FeatureProviderProps {
  children: ReactNode;
}

export function FeatureProvider({ children }: FeatureProviderProps) {
  const state = useFeaturePage();

  return (
    <FeatureContext.Provider value={state}>
      {children}
    </FeatureContext.Provider>
  );
}

export default FeatureProvider;
```

### `context/index.ts`
```typescript
export * from './<feature>ContextDefinition';
export * from './use<Feature>Context';
export * from './<Feature>Context';
export { default } from './<Feature>Context';
```

---

## 2. Logic Hook (`hooks/logic/use<Feature>Page.ts`)

```typescript
import { useState, useMemo, useCallback } from 'react';
import { useFeatureQuery } from '../queries/useFeatureQuery';
import { useFeatureMutations } from '../mutations/useFeatureMutations';

export function useFeaturePage() {
  const { data, loading, error, refetch } = useFeatureQuery();
  const { updateItem, isMutating } = useFeatureMutations({
    onSuccess: () => refetch(),
  });

  // Local modifications state
  const [editedFields, setEditedFields] = useState<Record<string, any>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Dialogs
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // DERIVE formData reactively - NEVER use setState in useEffect
  const formData = useMemo(() => {
    return {
      ...(data || {}),
      ...editedFields,
    };
  }, [data, editedFields]);

  // Dirty tracking
  const hasChanges = useMemo(() => {
    return Object.keys(editedFields).length > 0;
  }, [editedFields]);

  // Handlers with automatic page reset on filter change
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, []);

  const handleChange = useCallback((field: string, value: any) => {
    setEditedFields((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleResetChanges = useCallback(() => {
    setEditedFields({});
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasChanges) return;

    try {
      await updateItem(formData);
      setEditedFields({});
      setSuccessMessage('Cambios guardados con éxito.');
      setIsSuccessOpen(true);
    } catch {
      // Error handled by mutation hook
    }
  }, [hasChanges, formData, updateItem]);

  return {
    data,
    formData,
    loading,
    error,
    isMutating,
    hasChanges,
    searchTerm,
    currentPage,
    itemsPerPage,
    isConfirmOpen,
    isSuccessOpen,
    successMessage,
    handleSearchChange,
    handleChange,
    handleResetChanges,
    handleSubmit,
    setCurrentPage,
    setItemsPerPage,
    setIsConfirmOpen,
    setIsSuccessOpen,
  };
}

export type UseFeaturePageReturn = ReturnType<typeof useFeaturePage>;
```

---

## 3. Subcomponents (`components/`)

### Grouping Pattern
- `components/header/FeaturePageHeader.tsx`
- `components/filters/FeatureFilterBar.tsx`
- `components/table/FeatureTable.tsx`
- `components/modal/FeatureDetailModal.tsx`
- `components/feedback/FeatureErrorBanner.tsx`
- `components/feedback/FeatureDialogs.tsx`

### Example Subcomponent Consuming Context
```tsx
import { useFeatureContext } from '../../context';

export interface FeatureFilterBarProps {
  searchTerm?: string;
  onSearchChange?: (val: string) => void;
}

export function FeatureFilterBar({
  searchTerm: propSearchTerm,
  onSearchChange: propOnSearchChange,
}: FeatureFilterBarProps) {
  const context = useFeatureContext();

  const searchTerm = propSearchTerm ?? context.searchTerm;
  const onSearchChange = propOnSearchChange ?? context.handleSearchChange;

  return (
    <div className="p-4 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)]">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Buscar..."
        className="w-full px-4 py-2 rounded-xl text-sm border border-[var(--color-border)] bg-[var(--color-surface-bg)] text-[var(--color-text-primary)]"
      />
    </div>
  );
}
```

---

## 4. Declarative Page (`pages/<Feature>Page.tsx`)

```tsx
import { FeatureProvider } from '../context';
import {
  FeaturePageHeader,
  FeatureFilterBar,
  FeatureErrorBanner,
  FeatureTable,
  FeatureDialogs,
} from '../components';

function FeaturePageContent() {
  return (
    <div className="space-y-6 max-w-8xl mx-auto pb-12 animate-in fade-in duration-300">
      <FeaturePageHeader />
      <FeatureFilterBar />
      <FeatureErrorBanner />
      <FeatureTable />
      <FeatureDialogs />
    </div>
  );
}

export function FeaturePage() {
  return (
    <FeatureProvider>
      <FeaturePageContent />
    </FeatureProvider>
  );
}

export default FeaturePage;
```

---

## 5. Complex Form Page Boilerplate (Full-Page Pattern)

Template for multi-field, scalable entity forms that require a dedicated route (`/<module>/<feature>/new` and `/<module>/<feature>/:id/edit`) instead of a modal dialog.

### 5.1 Form Context (`context/`)

#### `context/<feature>FormContextDefinition.ts`
```typescript
import { createContext } from 'react';
import type { useFeatureFormPage } from '../hooks/logic/useFeatureFormPage';

export type FeatureFormContextType = ReturnType<typeof useFeatureFormPage>;

export const FeatureFormContext = createContext<FeatureFormContextType | null>(null);
```

#### `context/use<Feature>FormContext.ts`
```typescript
import { useContext } from 'react';
import { FeatureFormContext, type FeatureFormContextType } from './<feature>FormContextDefinition';

export function useFeatureFormContext(): FeatureFormContextType {
  const context = useContext(FeatureFormContext);
  if (!context) {
    throw new Error('useFeatureFormContext debe ser utilizado dentro de un FeatureFormProvider');
  }
  return context;
}
```

#### `context/<Feature>FormProvider.tsx`
```typescript
import React from 'react';
import { useParams } from 'react-router-dom';
import { FeatureFormContext } from './<feature>FormContextDefinition';
import { useFeatureFormPage } from '../hooks/logic/useFeatureFormPage';

export interface FeatureFormProviderProps {
  children: React.ReactNode;
  itemId?: string;
}

export function FeatureFormProvider({ children, itemId }: FeatureFormProviderProps) {
  const { id: routeId } = useParams<{ id: string }>();
  const value = useFeatureFormPage(itemId ?? routeId);

  return (
    <FeatureFormContext.Provider value={value}>
      {children}
    </FeatureFormContext.Provider>
  );
}
```

---

### 5.2 Triple-Hook Separation for Forms

#### `hooks/queries/use<Feature>FormDataQuery.ts`
```typescript
import { useState, useCallback, useEffect } from 'react';
import { ApiClient } from '@/lib/api-client';

export function useFeatureFormDataQuery(itemId?: string) {
  const [item, setItem] = useState<any | null>(null);
  const [catalogs, setCatalogs] = useState<any[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadError, setLoadError] = useState('');

  const loadData = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setLoadingInitial(true);
      setLoadError('');
    }

    try {
      const [catalogsRes, itemRes] = await Promise.all([
        ApiClient.get<any[]>('/related-catalog').catch(() => []),
        itemId ? ApiClient.get<any>(`/feature/${itemId}`) : Promise.resolve(null),
      ]);

      setCatalogs(catalogsRes || []);
      setItem(itemRes);
      setLoadError('');
    } catch (err: any) {
      setLoadError(err.message || 'Error al cargar datos del formulario');
    } finally {
      setLoadingInitial(false);
    }
  }, [itemId]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  return {
    item,
    catalogs,
    loadingInitial,
    loadError,
    refetchInitial: () => loadData(true),
  };
}
```

#### `hooks/logic/use<Feature>Form.ts`
```typescript
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { featureSchema, type FeatureFormData } from '../../schemas/feature.schema';

export function useFeatureForm({ item, onSubmit }: { item: any | null; onSubmit: (data: FeatureFormData) => Promise<void> }) {
  const form = useForm<FeatureFormData>({
    resolver: zodResolver(featureSchema),
    defaultValues: { name: '', isActive: true },
  });

  useEffect(() => {
    if (item) {
      form.reset({ name: item.name, isActive: item.isActive });
    }
  }, [item, form.reset]);

  return {
    ...form,
    handleSubmit: form.handleSubmit(onSubmit),
  };
}
```

#### `hooks/logic/use<Feature>FormPage.ts`
```typescript
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFeatureFormDataQuery } from '../queries/useFeatureFormDataQuery';
import { useFeatureMutations } from '../mutations/useFeatureMutations';
import { useFeatureForm } from './useFeatureForm';

export function useFeatureFormPage(itemId?: string) {
  const navigate = useNavigate();
  const isEditing = Boolean(itemId);

  const { item, catalogs, loadingInitial, loadError, refetchInitial } = useFeatureFormDataQuery(itemId);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const { createItem, updateItem, isMutating, error: mutationError, clearError } = useFeatureMutations();

  const handleSave = useCallback(async (data: any) => {
    clearError();
    try {
      if (itemId) {
        await updateItem(itemId, data);
        setSuccessMessage('Elemento actualizado correctamente.');
      } else {
        await createItem(data);
        setSuccessMessage('Elemento creado con éxito.');
      }
      setIsSuccessOpen(true);
    } catch {
      // Handled by mutation hook
    }
  }, [itemId, createItem, updateItem, clearError]);

  const form = useFeatureForm({ item, onSubmit: handleSave });

  return {
    itemId,
    isEditing,
    item,
    catalogs,
    loadingInitial,
    loadError,
    refetchInitial,
    ...form,
    isMutating,
    mutationError,
    isSuccessOpen,
    successMessage,
    handleCancel: () => navigate('/feature'),
    closeSuccessDialog: () => {
      setIsSuccessOpen(false);
      navigate('/feature');
    },
  };
}
```

---

### 5.3 Declarative Form Page (`pages/<Feature>FormPage.tsx`)

```tsx
import { FeatureFormProvider, useFeatureFormContext } from '../context';
import {
  FeatureFormHeader,
  FeatureBasicInfoSection,
  FeatureStatusSection,
  FeatureFormStickyBar,
  FeatureFormFeedback,
  FeatureFormLoadingState,
  FeatureFormErrorState,
} from '../components';

function FeatureFormPageContent() {
  const { loadingInitial, loadError, handleSubmit } = useFeatureFormContext();

  if (loadingInitial) return <FeatureFormLoadingState />;
  if (loadError) return <FeatureFormErrorState />;

  return (
    <form id="feature-form-page" onSubmit={handleSubmit} noValidate className="max-w-8xl mx-auto pb-24 space-y-6">
      <FeatureFormHeader />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <FeatureBasicInfoSection />
        </div>
        <div className="space-y-6">
          <FeatureStatusSection />
        </div>
      </div>
      <FeatureFormStickyBar />
      <FeatureFormFeedback />
    </form>
  );
}

export function FeatureFormPage() {
  return (
    <FeatureFormProvider>
      <FeatureFormPageContent />
    </FeatureFormProvider>
  );
}

export default FeatureFormPage;
```

---

## 6. Advanced Hook Decomposition (Header-Detail & Complex Domains)

For complex features (like BOM/Recetas, Invoices, Orders) exceeding 100 lines per hook or involving financial/domain math, decompose into specialized sub-hooks:

### 6.1 Isolated Domain Math Hook (`hooks/logic/use<Feature>Calculations.ts`)
```typescript
import { useMemo } from 'react';

interface UseFeatureCalculationsProps<TItem> {
  items: TItem[];
  yieldQuantity?: number;
  productsMap: Map<string, any>;
}

export function useFeatureCalculations<TItem extends { productId: string; quantity: number; unitCost: number }>({
  items,
  yieldQuantity = 1,
  productsMap,
}: UseFeatureCalculationsProps<TItem>) {
  return useMemo(() => {
    let materialsCost = 0;
    let laborCost = 0;

    for (const item of items) {
      const lineSubtotal = (Number(item.quantity) || 0) * (Number(item.unitCost) || 0);
      const product = productsMap.get(item.productId);
      if (product?.type === 'SERVICE') {
        laborCost += lineSubtotal;
      } else {
        materialsCost += lineSubtotal;
      }
    }

    const totalCost = materialsCost + laborCost;
    const yieldQty = yieldQuantity > 0 ? yieldQuantity : 1;
    const unitCost = totalCost / yieldQty;

    return {
      materialsCost: Number(materialsCost.toFixed(4)),
      laborCost: Number(laborCost.toFixed(4)),
      totalCost: Number(totalCost.toFixed(4)),
      unitCost: Number(unitCost.toFixed(4)),
    };
  }, [items, yieldQuantity, productsMap]);
}
```

### 6.2 Header-Detail Array Subcomponent Layout
For sections containing dynamic arrays, tables, and empty states:
```text
sections/
├── items/
│   ├── use<Feature>ItemsColumns.tsx  # Table column definitions & inputs
│   ├── <Feature>ItemsTable.tsx       # Shared <Table /> consumer
│   ├── <Feature>ItemsEmptyState.tsx  # Dedicated empty state presentation
│   └── index.ts
└── <Feature>ItemsSection.tsx         # Clean declarative section (< 50 lines)
```


---
name: starterkit-architecture-standards
description: >-
  Standardized full-stack architecture patterns and implementation guidelines for the my-starter-kit project across frontend (React, Context, Hooks, Modular Components, Zero Prop Drilling) and backend (NestJS, Clean Architecture, Hexagonal DDD, TypeORM, Audit). Use whenever creating, refactoring, modernizing, or reviewing features in this codebase.
---

# StarterKit Full-Stack Architecture & Implementation Standards

This skill documents the exact architectural patterns, directory conventions, and coding rules established across the frontend (`frontend/`) and backend (`backend/`) of this codebase. Every new feature or refactor must strictly adhere to these standards.

---

## 1. Frontend Architecture Standards (React + TypeScript + Tailwind)

### 1.1 Feature Directory Layout
Every feature under `frontend/src/features/<feature>/` must follow this standardized directory structure:

```text
features/<feature_name>/
├── components/          # Subcomponents grouped by domain
│   ├── header/          # Feature header and action bars
│   ├── filters/         # Search, dropdowns, date pickers
│   ├── table/           # Table, row, badges, pagination, empty state
│   ├── form/            # Dedicated subcomponents for full-page forms
│   │   ├── header/      # Form breadcrumbs, titles, top save/cancel
│   │   ├── sections/    # Domain-specific card sections (Type, BasicInfo, Pricing, Media, Status)
│   │   ├── actions/     # Floating sticky action bars
│   │   ├── feedback/    # Form error alerts and success dialogs
│   │   ├── states/      # Form loading skeleton and error recovery screens
│   │   └── index.ts     # Form components barrel export
│   ├── tabs/            # Tab content components (for tabbed views)
│   ├── navigation/      # Tab buttons or subnav bars
│   ├── modal/           # Lightweight modals (diff viewers, trivial 1-2 field actions)
│   ├── feedback/        # Error banners, alert dialogs
│   ├── stats/           # KPI cards, metrics
│   └── index.ts         # Re-exports all subcomponent folders
├── context/             # Feature-scoped React Contexts
│   ├── <feature>ContextDefinition.ts       # List page context definition & types
│   ├── use<Feature>Context.ts              # List page consumer hook (Fast Refresh)
│   ├── <Feature>Context.tsx                # List page FeatureProvider component
│   ├── <feature>FormContextDefinition.ts   # Form page context definition & types
│   ├── use<Feature>FormContext.ts          # Form page consumer hook (Fast Refresh)
│   ├── <Feature>FormProvider.tsx           # Form page Provider component
│   └── index.ts                            # Context barrel export
├── hooks/               # Custom hooks
│   ├── logic/           # Business logic, state, form handlers
│   │   ├── use<Feature>Page.ts             # List page orchestrator
│   │   ├── use<Feature>Form.ts             # React Hook Form + Zod setup
│   │   ├── use<Feature>FormPage.ts         # Form page orchestrator
│   │   ├── use<Feature>Calculations.ts     # Domain/financial math isolated from UI
│   │   ├── use<Feature>FormItems.ts        # useFieldArray & dynamic row operations (Header-Detail)
│   │   ├── use<Feature>Filters.ts          # Filter and search state logic
│   │   ├── use<Feature>Stats.ts            # Reactive KPI metrics calculation
│   │   └── index.ts
│   ├── queries/         # API fetch hooks (GET)
│   │   ├── use<Feature>Query.ts            # List & catalog queries
│   │   ├── use<Feature>FormDataQuery.ts    # Parallel form query (entity + related catalogs)
│   │   └── index.ts
│   ├── mutations/       # API mutate hooks (POST, PUT, DELETE)
│   │   ├── use<Feature>Mutations.ts
│   │   └── index.ts
│   └── index.ts         # Hooks barrel export
├── pages/               # Declarative page views
│   ├── <Feature>Page.tsx                   # Declarative list/index page
│   ├── <Feature>FormPage.tsx               # Declarative create/edit form page
│   └── index.ts
├── schemas/             # Zod validation schemas
│   ├── <feature>.schema.ts
│   └── index.ts
├── types/               # TypeScript interfaces & types
│   └── <feature>.ts
└── index.ts             # Public feature export
```

---

### 1.2 Feature-Scoped React Context Pattern
To prevent prop drilling across deep component trees, every feature must manage its state through a local React Context:

1. **Context Definition File (`context/<feature>ContextDefinition.ts`)**:
   - Define `ContextType` matching the return type of the primary page hook.
   - Call `createContext<ContextType | null>(null)`.
2. **Dedicated Consumer Hook File (`context/use<Feature>Context.ts`)**:
   - Must live in a separate file from components to satisfy `oxlint`'s `react(only-export-components)` and Vite HMR Fast Refresh.
   - Throws an informative error if used outside its provider:
     ```ts
     export function useFeatureContext(): FeatureContextType {
       const context = useContext(FeatureContext);
       if (!context) {
         throw new Error('useFeatureContext debe ser utilizado dentro de un FeatureProvider');
       }
       return context;
     }
     ```
3. **Provider Component File (`context/<Feature>Context.tsx`)**:
   - Calls the main business hook (`use<Feature>Page()`).
   - Wraps `children` with `<FeatureContext.Provider value={state}>`.
4. **Context Barrel File (`context/index.ts`)**:
   - Exports all contexts, hooks, providers, and types.

---

### 1.3 Subcomponent Design & Zero Prop Drilling
- **Direct Context Consumption**: Subcomponents consume state and action handlers directly from `use<Feature>Context()` or `use<Feature>FormContext()`.
- **Backward-Compatible Props**: Component props interfaces allow optional overrides for testing or standalone usage:
  ```tsx
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
    // ...
  }
  ```
- **No Flat Component Dumps**: Components must NOT be dumped loosely in `components/`. They must be categorized into subfolders: `header/`, `table/`, `filters/`, `form/`, `modal/`, `tabs/`, `feedback/`, etc.

---

### 1.4 Business Logic Hooks & State Rules
1. **Separation of Concerns**:
   - UI components should contain almost zero state management logic.
   - All state, handlers, form validations, and dirty tracking live in `hooks/logic/use<Feature>Page.ts` or `hooks/logic/use<Feature>FormPage.ts`.
2. **Preventing `set-state-in-effect` Warnings**:
   - **NEVER** synchronize incoming server data into local state via `useEffect(() => { setState(data); }, [data])`.
   - **DERIVE** state reactively using `useMemo`:
     ```ts
     const formData = useMemo(() => ({
       ...(serverData || {}),
       ...editedFields,
     }), [serverData, editedFields]);
     ```
   - Dirty checking (`hasChanges`) is computed by comparing `editedFields` or deep equality against `serverData`.
3. **Automated Pagination Resets**:
   - Whenever a filter or search criteria changes, the hook's handler automatically resets `currentPage` to 1.

### 1.4.1 Hook Decomposition & Anti-"God Hook" Standards
To prevent hooks from becoming monolithic ("God Hooks") as business rules, financial formulas, and dynamic rows grow, adhere to these decomposition rules:

1. **Size & Responsibility Threshold**:
   - If a logic hook exceeds **100–120 lines** or handles **more than 2 distinct responsibilities**, it must be decomposed into dedicated sub-hooks.

2. **Domain Math & Formula Isolation (`use<Feature>Calculations.ts`)**:
   - Any financial arithmetic, BOM total costs, unit cost derivations, profit margins, tax computations, or discounts must live in a dedicated calculation hook or pure helper.
   - **Zero React Hook Form Coupling**: The calculation hook receives raw inputs (e.g., `items`, `yieldQuantity`, `productsMap`) and reactively derives breakdown metrics using `useMemo`. This allows 100% isolated unit testing without simulating form lifecycle.

3. **Dynamic Array Rows in Header-Detail Records (`use<Feature>FormItems.ts`)**:
   - When using `useFieldArray` for complex child items (e.g., BOM components, invoice lines, purchase order items), extract row manipulation (`append`, `remove`, `handleComponentSelect`, price auto-population) into `use<Feature>FormItems.ts`.
   - `use<Feature>Form.ts` remains clean and dedicated exclusively to form lifecycle, schema resolver, and reset behaviors.

4. **List Page Sub-Hook Modularization**:
   - **`use<Feature>Filters.ts`**: Encapsulates search term, category/status filters, filtered array memoization, and automatic pagination resets.
   - **`use<Feature>Stats.ts`**: Computes aggregated KPI metrics (totals, active counts, draft counts, averages).
   - **`use<Feature>Actions.ts`**: Encapsulates modal dialog state for entity deletion, status toggling, or quick synchronization actions.
   - **`use<Feature>Page.ts`**: Acts as an assembler orchestrator connecting queries, filters, stats, and actions into the feature Context.

5. **Complex Section Subcomponent Extraction**:
   - Any form section component (e.g., `RecipeItemsSection`) that contains both table column definitions, interactive cell inputs, and empty states must modularize into a subfolder:
     ```text
     sections/
     ├── items/
     │   ├── use<Feature>ItemsColumns.tsx  # Column definitions & cell renderers
     │   ├── <Feature>ItemsTable.tsx       # Table wrapper using shared <Table />
     │   ├── <Feature>ItemsEmptyState.tsx  # Empty state presentation
     │   └── index.ts
     └── <Feature>ItemsSection.tsx         # Concise orchestrator (< 60 lines)
     ```

---

### 1.5 Declarative Page Component
The main page components (`pages/<Feature>Page.tsx` and `pages/<Feature>FormPage.tsx`) must be declarative, concise (under 70–90 lines), and free of inline state logic:

```tsx
import { FeatureProvider } from '../context';
import {
  FeaturePageHeader,
  FeatureStatsCards,
  FeatureFilterBar,
  FeatureErrorBanner,
  FeatureTable,
  FeatureDialogs,
} from '../components';

function FeaturePageContent() {
  return (
    <div className="space-y-6 max-w-8xl mx-auto pb-12 animate-in fade-in duration-300">
      <FeaturePageHeader />
      <FeatureStatsCards />
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

### 1.6 Complex Form Pages Architecture (Full-Page vs Modal Pattern)

When an entity requires multiple fields, categorizations, mathematical pricing formulas, media/images, or is expected to grow over time, **NEVER use a modal dialog**. Modals create cramped views, degrade mobile usability, and prevent bookmarkable deep links.

#### 1.6.1 Routing Standard for Forms
Every complex entity must support dedicated RESTful form routes in `src/routes/<module>.routes.tsx`:
- `/<module>/<feature>/new` (Create item)
- `/<module>/<feature>/:id/edit` (Edit existing item)

#### 1.6.2 Triple-Hook Separation for Forms
Form logic must be decomposed into three dedicated hooks:
1. **`queries/use<Feature>FormDataQuery.ts`**:
   - Executes parallel data fetching for the target entity (if `:id` exists) plus all related catalogs (e.g. units of measure, categories, suppliers, roles).
   - Manages `loadingInitial`, `loadError`, and manual `refetchInitial`.
2. **`logic/use<Feature>Form.ts`**:
   - Manages React Hook Form with `@hookform/resolvers/zod` and schema validation.
   - Synchronizes defaults upon initial data load.
   - Implements fine-grained mathematical calculations reactively (e.g., Cost, Profit Margin %, Suggested Sale Price).
3. **`logic/use<Feature>FormPage.ts`**:
   - Top-level orchestrator connecting `use<Feature>FormDataQuery`, `use<Feature>Mutations`, and `use<Feature>Form`.
   - Computes derived reactive business metrics (e.g., Gross Profit Unitary, Markup percentages).
   - Manages dialog feedback (`isSuccessOpen`, `successMessage`), navigation handlers, and API payload transformation.

#### 1.6.3 Form Subcomponent Directory Organization (`components/form/`)
Forms must be split into isolated domain sections under `components/form/`:
- **`header/<Feature>FormHeader.tsx`**: Top breadcrumbs to parent listing, dynamic title, subtitle, and top action buttons (Cancel & Save).
- **`sections/<Domain>Section.tsx`**:
  - **Selector Cards**: Visual card pickers for entity types/roles with icons, badges, descriptions, and active ring styling.
  - **Basic Info**: Name input with character length limits and description textareas.
  - **Classification**: Dropdowns for related entities with direct links to create/manage auxiliary catalogs.
  - **Financial / Pricing**: Reactive input grids with formulas (`Precio = Costo × (1 + Margen%)`) and real-time KPI analysis cards.
  - **Media & Preview**: Image URL input with real-time responsive visual preview card and graceful error fallbacks.
  - **Status & Audit**: Active switches, audit timestamps (`createdAt`, `updatedAt`), and domain management advice.
- **`actions/<Feature>FormStickyBar.tsx`**: Fixed floating bottom bar (`fixed bottom-0`, `backdrop-blur-md`, `rounded-t-3xl`) with active record name preview and Cancel / Submit buttons.
- **`feedback/<Feature>FormFeedback.tsx`**: Dismissible mutation error banners and auto-closing `SuccessDialog` with redirect.
- **`states/<Feature>FormStates.tsx`**: Dedicated `LoadingState` spinner and `ErrorState` recovery view with retry button.

#### 1.6.4 Declarative Form Page Example
```tsx
import { FeatureFormProvider, useFeatureFormContext } from '../context';
import {
  FeatureFormHeader,
  FeatureTypeSection,
  FeatureBasicInfoSection,
  FeatureClassificationSection,
  FeaturePricingSection,
  FeatureMediaSection,
  FeatureStatusSection,
  FeatureFormStickyBar,
  FeatureFormFeedback,
  FeatureFormLoadingState,
  FeatureFormErrorState,
} from '../components';

function FeatureFormPageContent() {
  const { loadingInitial, loadError, handleSave } = useFeatureFormContext();

  if (loadingInitial) return <FeatureFormLoadingState />;
  if (loadError) return <FeatureFormErrorState />;

  return (
    <form id="feature-form-page" onSubmit={handleSave} noValidate className="max-w-8xl mx-auto pb-24 space-y-6">
      <FeatureFormHeader />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <FeatureTypeSection />
          <FeatureBasicInfoSection />
          <FeatureClassificationSection />
          <FeaturePricingSection />
        </div>
        <div className="space-y-6">
          <FeatureMediaSection />
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

### 1.7 UI & Design System Conventions
- **Shared UI Components**: Always prioritize shared components from `shared/components/ui`:
  - `PageHeader` (with title, description, icon, and actions as `children`)
  - `Button` (with `variant="primary" | "secondary" | "outline" | "danger"`, `size="sm" | "md" | "lg"`, `loading`, `leftIcon`)
  - `ConfirmDialog` and `SuccessDialog`
  - `Modal`
  - `Table`
- **Tailwind Tokens & Variables**: Use CSS variables for consistent theming:
  - Backgrounds: `bg-[var(--color-surface-card)]`, `bg-[var(--color-surface-bg)]`, `hover:bg-[var(--color-surface-hover)]`
  - Borders: `border-[var(--color-border)]`
  - Text: `text-[var(--color-text-primary)]`, `text-[var(--color-text-secondary)]`, `text-[var(--color-text-muted)]`
  - Primary accents: `var(--color-sage-500)`, `var(--color-sage-600)`, `var(--color-sage-100)`
  - Status colors: Emerald (Success), Blue (Updates/Info), Amber (Warnings), Rose (Deletes/Errors), Purple (Logins/Auth)
- **Icons**: Use `lucide-react` with consistent sizing (`w-4 h-4` for inline, `w-5 h-5` / `w-6 h-6` for headers).

---

## 2. Backend Architecture Standards (NestJS + CQRS + Clean Architecture + TypeORM)

### 2.1 Standardized Module Directory Layout
Every backend module under `backend/src/<module>/` must strictly adhere to the Hexagonal / Clean Architecture structure with CQRS and 3-Tier Layered Mappers:

```text
backend/src/<module>/
├── application/           # Application Layer (CQRS Use Cases, Commands, Services & Mappers)
│   ├── commands/          # Mutating use cases grouped by intent
│   │   └── <command-name>/
│   │       ├── <command-name>.command.ts     # Command payload + static fromDto() factory
│   │       └── <command-name>.use-case.ts    # Single-responsibility command handler
│   ├── queries/           # Read-only use cases
│   │   └── <query-name>/
│   │       └── <query-name>.use-case.ts      # Query handler injecting Read Repository
│   ├── services/          # Reusable domain orchestration across use cases
│   │   ├── <entity>-items.service.ts         # Multi-item validation, correlatives, catalog checks
│   │   ├── <entity>-completion.service.ts    # Lifecycle finalization & event dispatching
│   │   └── index.ts
│   ├── mappers/           # Command-to-Domain mappers
│   │   ├── <entity>-command.mapper.ts        # Currency context & aggregate instantiator
│   │   └── index.ts
│   └── events/            # NestJS CQRS Event Listeners
│       ├── <event-name>.listener.ts          # @EventsHandler() reacting to domain events
│       └── index.ts
├── domain/                # Domain Layer (Enterprise Business Rules - Pure TypeScript)
│   ├── entities/          # Rich Domain Models (extend BaseEntity with invariants & methods)
│   │   ├── <entity>.entity.ts
│   │   └── <entity>-item.entity.ts
│   ├── enums/             # Domain state machines and enumerations
│   │   └── <entity>-status.enum.ts
│   ├── events/            # Domain Event payloads
│   │   └── <event-name>.event.ts
│   └── repositories/      # Segregated Repository Interfaces (ISP) & DI Tokens
│       └── <entity>.repository.interface.ts
├── infrastructure/        # Infrastructure Layer (Database Adapters & Framework Details)
│   └── persistence/
│       └── typeorm/
│           ├── entities/      # TypeORM table definitions (*.orm-entity.ts)
│           │   ├── <entity>.orm-entity.ts
│           │   └── <entity>-item.orm-entity.ts
│           ├── mappers/       # Bidirectional ORM <-> Domain Mappers (*.orm-mapper.ts)
│           │   ├── <entity>.orm-mapper.ts
│           │   └── index.ts
│           └── repositories/  # Atomic transactional repository implementation
│               └── typeorm-<entity>.repository.ts
├── presentation/          # Presentation Layer (HTTP / REST API)
│   └── http/
│       ├── controllers/   # Thin NestJS controllers with Swagger & Guards
│       │   └── <module>.controller.ts
│       ├── dto/           # Grouped DTOs (Categorized subdirectories)
│       │   ├── requests/  # Create, Update, Status request payloads (*.dto.ts)
│       │   ├── responses/ # API response view models (*-response.dto.ts)
│       │   ├── queries/   # Pagination and filter query params (*-query.dto.ts)
│       │   └── index.ts   # Barrel export
│       └── mappers/       # Domain-to-Response DTO mappers (*-response.mapper.ts)
│           ├── <entity>-response.mapper.ts
│           └── index.ts
└── <module>.module.ts     # NestJS module registering CQRS, ISP repository tokens & providers
```

---

### 2.2 CQRS Pattern: Commands & Queries Segregation
To prevent "God Services" that combine read and write responsibilities, every business workflow must be modeled as a dedicated Use Case:

1. **Commands (`application/commands/<command-name>/`)**:
   - Encapsulate mutating operations (`Create`, `Update`, `UpdateStatus`, `Delete`).
   - Define `<command-name>.command.ts` containing the typed input parameters and a static `fromDto(dto, userId?)` factory method to decouple HTTP transport representations from application models.
   - Define `<command-name>.use-case.ts` with a single public method: `execute(command): Promise<Entity>`.
2. **Queries (`application/queries/<query-name>/`)**:
   - Encapsulate read operations (`FindAll`, `FindById`).
   - Pure read operations must **only inject the Read Repository** (`I<Entity>ReadRepository`), enforcing read-only boundaries.

---

### 2.3 Interface Segregation Principle (ISP) for Repositories
Repositories must segregate read and write contracts in `domain/repositories/<entity>.repository.interface.ts`:

```typescript
export const PURCHASE_REPOSITORY_TOKEN = 'IPurchaseRepository';
export const PURCHASE_READ_REPOSITORY_TOKEN = 'IPurchaseReadRepository';
export const PURCHASE_WRITE_REPOSITORY_TOKEN = 'IPurchaseWriteRepository';

/** Contrato segregado exclusivo para LECTURA (Queries) */
export interface IPurchaseReadRepository {
  findAll(filters?: FindPurchasesFilters): Promise<{ purchases: Purchase[]; total: number }>;
  findById(id: string): Promise<Purchase | null>;
  findByNumber(purchaseNumber: string): Promise<Purchase | null>;
}

/** Contrato segregado exclusivo para ESCRITURA (Commands) */
export interface IPurchaseWriteRepository {
  save(purchase: Purchase): Promise<Purchase>;
  delete(id: string): Promise<void>;
  getNextSequenceNumber(): Promise<string>;
}

/** Contrato unificado que combina lectura y escritura con retrocompatibilidad */
export interface IPurchaseRepository
  extends IPurchaseReadRepository,
    IPurchaseWriteRepository {}
```

**NestJS Module Registration Pattern**:
```typescript
providers: [
  TypeOrmPurchaseRepository,
  {
    provide: PURCHASE_REPOSITORY_TOKEN,
    useClass: TypeOrmPurchaseRepository,
  },
  {
    provide: PURCHASE_READ_REPOSITORY_TOKEN,
    useExisting: PURCHASE_REPOSITORY_TOKEN,
  },
  {
    provide: PURCHASE_WRITE_REPOSITORY_TOKEN,
    useExisting: PURCHASE_REPOSITORY_TOKEN,
  },
]
```

---

### 2.4 3-Tier Layered Mappers Architecture (Zero Layer Contamination)
**Critical Rule**: Domain entities must never bleed into presentation responses, and ORM entities must never bleed into the domain or application layers. Every boundary crossing has a dedicated, pure mapper:

1. **Layer 1: Persistence / ORM Mapper (`infrastructure/persistence/typeorm/mappers/<entity>.orm-mapper.ts`)**:
   - Maps bidirectionally between `TypeOrmEntity` and pure `DomainEntity`.
   - `toDomain(orm): DomainEntity`: Restores domain aggregates, instantiates child entities, and normalizes database records.
   - `toOrm(domain): TypeOrmEntity`: Prepares TypeORM entities for persistence, extracting foreign keys and scalar columns.
   - `toDomainList()` and `toOrmList()` for collections.
2. **Layer 2: Application / Command Mapper (`application/mappers/<entity>-command.mapper.ts`)**:
   - Maps CQRS Commands and DTO payloads into Domain Aggregates.
   - Resolves currencies, exchange rates, and business context defaults.
   - Calls domain initialization and triggers mathematical calculations (`aggregate.calculateTotals()`).
3. **Layer 3: Presentation / Response Mapper (`presentation/http/mappers/<entity>-response.mapper.ts`)**:
   - Maps Domain Aggregates into client-facing Response DTOs.
   - Serializes dates to ISO 8601 strings, formats monetary numbers, and structures relations for the frontend.
   - Exposes `toDto()`, `toDtoList()`, and `toItemDto()`.

---

### 2.5 Categorized DTO Organization
DTO directories must never be flat dumps. Group them logically under `presentation/http/dto/`:
- `dto/requests/`: `create-<entity>.dto.ts`, `update-<entity>.dto.ts`, `<entity>-item.dto.ts`.
- `dto/responses/`: `<entity>-response.dto.ts`, `<entity>-item-response.dto.ts`.
- `dto/queries/`: `find-<entities>-query.dto.ts` with pagination and filter params.
- Each subdirectory contains its own `index.ts`, re-exported by the root `dto/index.ts`.

---

### 2.6 Shared Application Services (De-duplicating Cross-Use-Case Logic)
When two or more Use Cases (e.g. `CreatePurchaseUseCase` and `UpdatePurchaseUseCase`) share identical domain orchestration or complex preparation:
- **Do NOT duplicate code** across use cases.
- **Do NOT leak technical ORM logic** into shared helpers.
- Extract into a focused Application Service under `application/services/`:
  - `<entity>-items.service.ts`: Validates item lists, validates document uniqueness (e.g., duplicate supplier invoice), resolves sequential document codes, validates catalog dependencies, and builds domain child items.
  - `<entity>-completion.service.ts`: Orchestrates finalization workflows, catalog cost updates, and domain event publishing.

---

### 2.7 Rich Domain Aggregates & Invariant Protection (DDD)
- Domain entities must extend `BaseEntity` (`@/core/domain/base.entity`).
- **Encapsulated Business Math**: Financial sums, tax calculations, and currency conversions must be methods on the domain model (`calculateTotals()`), never loose in controllers or services.
- **State Machine Transitions**: State changes are guarded by domain methods (`transitionTo(newStatus)`), preventing illegal transitions (e.g., reverting a `COMPLETED` order back to `DRAFT`).
- **Invariants Validation**: Entities expose a `validate()` method throwing `BusinessRuleException` (`@/core/domain/domain-exception`) for violated business rules.
- **Deletion & Update Rules**: Methods like `ensureCanBeUpdated()` and `ensureCanBeDeleted()` enforce immutable rules directly on the domain model.

---

### 2.8 Transactional Unit-of-Work Persistence in TypeORM
In the repository implementation (`TypeOrm<Entity>Repository`):
- Inject `DataSource` and `Repository<OrmEntity>`.
- For aggregate roots with child collections (Header-Detail), **always wrap persistence in an atomic transaction**:
  ```typescript
  async save(purchase: Purchase): Promise<Purchase> {
    await this.dataSource.transaction(async (manager) => {
      const purchaseOrm = PurchaseOrmMapper.toOrm(purchase);
      await manager.save(PurchaseOrmEntity, purchaseOrm);

      // Sincronización atómica de renglones hijos
      await manager.delete(PurchaseItemOrmEntity, { purchaseId: purchase.id });
      if (purchase.items && purchase.items.length > 0) {
        const itemOrms = PurchaseItemOrmMapper.toOrmList(purchase.items, purchase.id);
        await manager.save(PurchaseItemOrmEntity, itemOrms);
      }
    });

    // Consultamos el agregado completo post-commit con sus relaciones cargadas
    const saved = await this.findById(purchase.id);
    return saved || purchase;
  }
  ```
- Implement soft deletes via `this.repo.softDelete(id)`.

---

### 2.9 Event-Driven Cross-Context Decoupling
To avoid tightly coupling bounded contexts (e.g., Purchases updating Inventory stock or Product last costs synchronously within the same HTTP thread):
1. **Domain Events (`domain/events/<event-name>.event.ts`)**: Define immutable payload classes capturing domain milestones.
2. **Event Publishing**: Application services dispatch events via NestJS CQRS `EventBus`:
   ```typescript
   this.eventBus.publish(new MaterialPurchaseCompletedEvent(...));
   ```
3. **Event Listeners (`application/events/<event-name>.listener.ts`)**:
   Implement `@EventsHandler(MaterialPurchaseCompletedEvent)` and `IEventHandler<MaterialPurchaseCompletedEvent>` to perform side-effects, log milestones, or trigger downstream stock/cost updates asynchronously.

---

### 2.10 Comprehensive Audit Tracking & Controller Standards
- **Lean Controllers**: Controllers must remain thin coordinators:
  1. Validate incoming request DTO.
  2. Map DTO to Command via `Command.fromDto(dto, userId)`.
  3. Execute Use Case.
  4. Map Domain output to Response DTO via `<Entity>ResponseMapper.toDto(...)`.
- **RBAC & Security**:
  - Secure controllers with `@UseGuards(JwtAuthGuard, PermissionsGuard)`.
  - Require granular permissions with `@RequirePermissions('<resource>:<action>')`.
  - Extract authenticated user details via `@CurrentUser('id')`.
- **Audit Interceptor**:
  - Automatically captures HTTP duration, user, IP, and status.
  - Supports differential state snapshots (`previousState`, `newState`, `changes`).

---

## 3. Verification & Quality Protocol

Before completing any task, execute the following validation steps:

1. **TypeScript Verification**:
   ```bash
   npx tsc --noEmit (or npm run build in frontend)
   ```
   Must pass with **0 compilation errors**.
2. **Linting Check**:
   ```bash
   npm run lint
   ```
   Must verify that no new `react(set-state-in-effect)` or `react(only-export-components)` warnings are introduced.
3. **Route Integrity**:
   Verify that barrel exports in `features/<feature>/index.ts` preserve backward compatibility for routes in `src/routes/`.

---

## 4. Reference Templates

Detailed templates and code boilerplates are available in the references folder:
- [Frontend Feature Boilerplate](./references/frontend-feature-template.md)
- [Backend Clean Architecture Boilerplate](./references/backend-module-template.md)

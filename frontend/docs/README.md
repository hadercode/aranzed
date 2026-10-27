# Documentación Técnica del Frontend — Aranzed - Software de Gestión

Bienvenido a la documentación arquitectónica, técnica y de diseño del frontend de **Aranzed - Software de Gestión**.

Esta aplicación está construida sobre **React 19**, **TypeScript**, **Tailwind CSS v4** y **Vite**, siguiendo rigurosamente una arquitectura orientada a dominios de negocio (_Feature-Sliced Design_), separación de responsabilidades con hooks especializados y gestión de estado con cero perforación de propiedades (_Zero Prop Drilling_).

---

## 🧭 Índice de Documentos Técnicos

1. **[Arquitectura y Estructura de Módulos (`architecture.md`)](./architecture.md)**
   - Estándar de directorio por feature (`features/<modulo>/`).
   - Patrón de separación en tres hooks (_Triple-Hook Pattern_).
   - Contextos locales de feature (_Feature-Scoped Context_).
   - Reglas anti "God Hook" y descomposición modular.
2. **[Sistema de Diseño y Componentes UI (`design-system.md`)](./design-system.md)**
   - Catálogo de componentes compartidos (`@/shared/components/ui`).
   - Tokens CSS y paleta de colores corporativa.
   - Directrices de formularios, diálogos y barras de acción flotantes (_Sticky Bar_).
3. **[Autenticación, Permisos y Enrutamiento (`auth-and-routing.md`)](./auth-and-routing.md)**
   - Flujo de autenticación JWT y persistencia en Zustand (`auth-storage`).
   - Protección de rutas con `ProtectedRoute` y Guards.
   - Control granular de visibilidad mediante permisos RBAC (`user.permissions`).
   - Manejo automático de sesiones expiradas (HTTP 401) y accesos prohibidos (HTTP 403).
4. **[Integración API y Gestión de Estado Server (`api-and-state.md`)](./api-and-state.md)**
   - Cliente HTTP centralizado `ApiClient` y helper de assets `getAssetUrl`.
   - Estrategias de caché y mutaciones con `@tanstack/react-query`.
   - Store global de feedback modal (`useFeedbackStore`).

---

## 📦 Mapa de Módulos y Dominios Funcionales

| Módulo (`src/features/`) | Dominio del Negocio   | Componentes Principales                                       | Rutas Asociadas                                                                               |
| :----------------------- | :-------------------- | :------------------------------------------------------------ | :-------------------------------------------------------------------------------------------- |
| **`auth`**               | Acceso y Seguridad    | Login, Registro, Recuperación y Reseteo                       | `/login`, `/register`, `/recover-password`, `/reset-password`                                 |
| **`profile`**            | Perfil Personal       | Información personal, cambio de clave, avatar                 | `/profile`                                                                                    |
| **`users`**              | Maestro de Usuarios   | Tabla, modal de creación/edición, roles                       | `/users`                                                                                      |
| **`roles`**              | Roles y Permisos      | Asignación de permisos granulares por rol                     | `/roles`                                                                                      |
| **`company`**            | Empresa y Fiscalidad  | Tabs de datos fiscales, moneda, SMTP, branding                | `/company`                                                                                    |
| **`dashboard`**          | Analítica y KPIs      | Métricas consolidadas, gráficas y accesos                     | `/`, `/analytics`                                                                             |
| **`catalog`**            | Maestro de Artículos  | Productos (Simple/Compuesto), Recetas (BOM), Categorías, UOFM | `/catalog/products`, `/catalog/recipes`, `/catalog/categories`, `/catalog/uofm`               |
| **`inventory`**          | Control de Stock      | Almacenes, Existencias, Movimientos Kardex, Motivos           | `/inventory/warehouses`, `/inventory/stocks`, `/inventory/transactions`, `/inventory/reasons` |
| **`purchases`**          | Compras Materia Prima | Órdenes de compra, multimoneda, recepción física              | `/purchases`, `/purchases/new`, `/purchases/:id/edit`                                         |
| **`sales`**              | Ventas y Facturación  | Cotizaciones, Ventas a crédito, Pagos/Abonos, PDF             | `/sales`, `/sales/new`, `/sales/:id/edit`                                                     |
| **`audit`**              | Auditoría Forense     | Trazabilidad de operaciones, comparador diff                  | `/audit`, `/audit/:id`                                                                        |

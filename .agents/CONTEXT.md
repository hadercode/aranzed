# Contexto del Proyecto: MiniStore (Nexus ERP)

Documento maestro de arquitectura, lógica del negocio, alcance funcional y reglas de dominio del sistema **MiniStore** (Nexus ERP / StarterKit). Este archivo sirve como punto de referencia único y permanente para todas las sesiones de desarrollo, evitando tener que re-explicar la naturaleza y reglas del proyecto.

---

## 1. Visión General del Proyecto

### 1.1 Propósito y Filosofía
**MiniStore** es una plataforma integral de gestión empresarial (ERP liviano) diseñada para comercios, talleres de manufactura/ensamble liviano, distribuidoras y pequeños negocios. Centraliza el ciclo operativo completo:
- Compra y recepción bimoneda de insumos y mercadería.
- Control de formulaciones y costeo mediante Recetas / Estructura de Materiales (BOM - *Bill of Materials*).
- Gestión del Catálogo de Productos (materias primas, productos de reventa, elaborados y servicios) y su categorización jerárquica.
- Control de Inventario y Kardex (entradas por compra, salidas por ventas y transformación por recetas).
- Ventas y Facturación / POS bimoneda con control de márgenes.
- Seguridad RBAC granular y auditoría profunda de operaciones con deltas diferenciales.

### 1.2 Stack Tecnológico
- **Backend**:
  - [NestJS 10](https://nestjs.com/) con **Clean Architecture / Arquitectura Hexagonal** y **Domain-Driven Design (DDD)**.
  - **CQRS & Event-Driven** vía `@nestjs/cqrs` (Commands, Queries, Domain Events y Event Handlers).
  - **TypeORM** con PostgreSQL (migraciones, relaciones explícitas, timestamps y soft deletes).
  - Autenticación asimétrica **JWT** (claves RSA pública/privada) y autorización por Roles/Permisos (`PermissionsGuard`).
  - Auditoría exhaustiva mediante `AuditInterceptor` con capturas diferenciales (`previousState`, `newState`, `changes`).
  - Documentación viva OpenAPI / Swagger en `/api`.
- **Frontend**:
  - **React 18** + **TypeScript** + **Vite**.
  - **Tailwind CSS** estructurado mediante variables de diseño (`--color-surface-*`, `--color-sage-*`, `--color-border`) con soporte nativo de Modo Claro / Oscuro.
  - Gestión de estado por característica mediante **React Context local** (**Zero Prop Drilling**), hooks especializados (`use<Feature>Page`, `use<Feature>FormPage`, `use<Feature>Calculations`) y validación con **React Hook Form + Zod**.
  - Componentes modulares desacoplados (formularios en página completa `/new` y `/:id/edit`, nunca modales apretados para entidades complejas).

---

## 2. Diagrama de Relaciones y Flujo de Negocio

El siguiente diagrama ilustra cómo interactúan los diferentes módulos del sistema:

```
  +---------------------------------------------------------------------------------+
  |                               PROVEEDORES                                       |
  +---------------------------------------+-----------------------------------------+
                                          |
                                          v Factura Proveedor / Bimoneda (USD / VES)
                      +---------------------------------------+
                      |               COMPRAS                 |
                      |  - Estado DRAFT -> COMPLETED          |
                      |  - Actualiza lastCost de insumos      |
                      |  - Emite MaterialPurchaseCompleted    |
                      +-------------------+-------------------+
                                          |
                                          v (Entrada de Insumos)
+-----------------------------------------------------------------------------------+
|                              CATÁLOGO Y STOCK                                     |
|                                                                                   |
|  [UNIDADES DE MEDIDA]  <------+  [CATEGORÍAS (Árbol/Path)]                        |
|  (UND, KG, LT, etc.)          |  (Electrónica, Hogar, Alimentos)                  |
|                               |                                                   |
|  [PRODUCTOS / MATERIALES] <---+                                                   |
|   - RAW_MATERIAL  (Materia prima comprada)  ---+                                  |
|   - TRADITIONAL   (Reventa comercial)          | Consumido por                    |
|   - SERVICE       (Mano de obra, portes)    ---+                                  |
|                                                |                                  |
|                                                v                                  |
|                                 +------------------------------+                  |
|                                 |        RECETAS / BOM         |                  |
|                                 | - Yield Quantity (Rendimiento)|                 |
|                                 | - Total Cost & Unit Cost     |                  |
|                                 | - Solo 1 Activa por Producto |                  |
|                                 +--------------+---------------+                  |
|                                                | Genera / Costea                  |
|                                                v                                  |
|   - FINISHED_GOOD (Producto Elaborado) <-------+                                  |
|                                                                                   |
|                                                                                   |
|  [INVENTARIO / KARDEX]                                                            |
|   - Stock en tiempo real por producto y almacén                                   |
|   - Movimientos: COMPRA_IN, VENTA_OUT, PRODUCCION_CONSUMO, PRODUCCION_ENTRADA     |
+---------------------------------------+-------------------------------------------+
                                        |
                                        v (Salida de Producto Terminado o Reventa)
                      +---------------------------------------+
                      |            VENTAS & POS               |
                      |  - Presupuestos, Pedidos y Facturas   |
                      |  - Bimoneda, Tasa de Cambio y Margen  |
                      |  - Valida stock disponible            |
                      |  - Emite SaleCompletedEvent           |
                      +---------------------------------------+
```

---

## 3. Catálogo de Productos y Clasificación

### 3.1 Tipos de Producto (`ProductType`)
Cada producto registrado en el catálogo pertenece obligatoriamente a una de cuatro naturalezas operativas:

1. **`TRADITIONAL` (Comercial / Reventa Estándar)**:
   - Productos terminados comprados listos a proveedores para su reventa directa sin transformación.
   - Maneja stock físico en inventario.
   - Su costo de adquisición (`lastCost`) se actualiza automáticamente al completar una compra.
2. **`RAW_MATERIAL` (Materia Prima / Insumo)**:
   - Materiales, partes, piezas o ingredientes adquiridos para ser consumidos en procesos de producción o ensamble por recetas.
   - Maneja stock físico y requiere control estricto de unidades de medida (ej. Kilogramos, Gramos, Litros, Metros).
   - No está destinado a la venta directa al público consumidor tradicional (salvo excepciones o ventas de excedentes).
3. **`FINISHED_GOOD` (Producto Elaborado / Manufacturado)**:
   - Artículo final resultante de la ejecución de una **Receta / Estructura de Materiales (BOM)**.
   - Maneja stock físico de producto terminado disponible para la venta.
   - Su costo unitario (`lastCost`) no proviene directamente de facturas de compra, sino del **costo derivado de su receta activa** (`totalCost / yieldQuantity`), considerando insumos y mano de obra.
4. **`SERVICE` (Servicio / Intangible)**:
   - Horas de soporte técnico, mano de obra, corte, fletes, armado o instalación.
   - **No maneja stock físico**.
   - Puede facturarse directamente a clientes en ventas o incluirse dentro de una Receta como costo operativo directo del ensamble.

### 3.2 Atributos Principales de la Entidad `Product`
- `name`: Nombre descriptivo (hasta 150 caracteres, obligatorio y único por lógica).
- `type`: Valor del enum `ProductType`.
- `uomId`: Llave foránea hacia la Unidad de Medida base (obligatoria, relación restrictiva).
- `categoryId`: Llave foránea hacia la Categoría correspondiente (opcional, asignable a subcategorías).
- `profitMargin`: Margen de ganancia deseado en porcentaje (ej. `30` para 30%, no negativo).
- `lastCost`: Costo unitario de reposición o fabricación en moneda funcional (`USD`, con precisión de 4 decimales).
- `lastSalePrice`: Precio de venta sugerido al público calculado automáticamente o ajustado manualmente.
- `imageUrl`: URL opcional de imagen ilustrativa para el POS y las listas.
- `isActive`: Indicador de disponibilidad operativa (un producto inactivo no puede comprarse ni venderse).
- Auditoría: `createdAt`, `updatedAt`, `deletedAt` (soporte de borrado suave), `createdById`.

### 3.3 Reglas de Negocio y Fórmulas del Producto
- **Precio Sugerido**:
  $$\text{lastSalePrice} = \text{lastCost} \times \left(1 + \frac{\text{profitMargin}}{100}\right)$$
- **Margen Unitario Bruto**:
  $$\text{Ganancia Bruta} = \text{lastSalePrice} - \text{lastCost}$$
- **Sincronización Dinámica de Costos**:
  - Al completar una compra que incluya el producto, su `lastCost` se sobreescribe con el costo de la factura y su `lastSalePrice` se recalcula de inmediato si el margen está fijado.
  - Al actualizar o sincronizar una receta activa para un `FINISHED_GOOD`, el `lastCost` del producto absorbe el costo unitario de la receta.

---

## 4. Categorías y Unidades de Medida

### 4.1 Categorías Jerárquicas (`Category`)
- **Estructura en Árbol**: Admite jerarquías multinivel ilimitadas mediante la relación padre-hijo (`parentId`).
- **Materialized Path (`path`)**:
  - Cada categoría almacena una ruta plana desnormalizada (ej: `"Hogar y Muebles/Dormitorio/Camas"`).
  - Permite búsquedas, ordenamientos y filtrados inmediatos en frontend y backend sin consultas recursivas (`WITH RECURSIVE`) pesadas en base de datos.
- **Reglas de Integridad**:
  - Una categoría no puede ser su propio padre (`parentId !== id`).
  - Al renombrar o reubicar una categoría padre, se actualizan en cascada los paths de todos sus descendientes.

### 4.2 Unidades de Medida (`UnitOfMeasure`)
- **Estandarización**: Unidades normalizadas con código ISO/comercial breve (ej: `UND`, `KG`, `GR`, `LT`, `ML`, `M`, `PAQ`, `CAJA`).
- **Control de Decimales (`allowDecimals`)**:
  - Define si una unidad permite cantidades fraccionarias (ej: `KG`, `LT` admiten `1.750`), o si exige estrictamente cantidades enteras (ej: `UND`, `CAJA` no permiten números decimales).
  - Esta validación rige compras, recetas, movimientos de stock y ventas.

---

## 5. Recetas y Estructura de Materiales (BOM / Producción)

### 5.1 Propósito y Alcance
El módulo de Recetas modela la composición técnica y económica de los productos elaborados (`FINISHED_GOOD`). Define los materiales necesarios, proporciones, mermas y servicios directos (mano de obra) requeridos para producir un lote determinado.

### 5.2 Estructura del Agregado `Recipe`
- `code`: Código único correlativo o comercial (ej: `REC-0001`).
- `name`: Nombre de la receta o formulación técnica (ej: `"Ensamble Escritorio Ergonómico Roble 1.20m"`).
- `productId`: ID del producto terminado (`FINISHED_GOOD`) que se produce.
- `status`:
  - `DRAFT`: Borrador en fase de pruebas o formulación experimental (no afecta costos oficiales).
  - `ACTIVE`: Versión oficial activa para producción y costeo del producto terminado.
  - `INACTIVE`: Receta archivada, reemplazada o descontinuada.
- `yieldQuantity`: Rendimiento base de la receta (cantidad de unidades terminadas que se obtienen, $> 0$, por defecto 1).
- `totalCost`: Costo total acumulado de todos los ingredientes y servicios para producir el lote.
- `items` (`RecipeItem[]`):
  - `productId`: Referencia al ingrediente, insumo (`RAW_MATERIAL`) o servicio (`SERVICE`).
  - `quantity`: Cantidad requerida de dicho insumo para el lote base ($> 0$).
  - `unitCost`: Costo unitario tomado del catálogo al momento de la formulación o sincronizado.
  - `subtotalCost`: $\text{quantity} \times \text{unitCost}$.
  - `notes`: Instrucciones de dosificación, preparación o tolerancia técnica.
  - `sortOrder`: Posición secuencial de incorporación en el proceso.

### 5.3 Reglas de Negocio Críticas
1. **Unicidad de Receta Activa**:
   - Solo puede haber **una receta en estado `ACTIVE` por cada producto terminado**.
   - Si se activa una receta nueva para un producto terminado que ya tenía otra activa, el sistema conmuta automáticamente la anterior a estado `INACTIVE`.
2. **Prohibición de Auto-referencia**:
   - Un producto terminado **jamás** puede ser componente de su propia receta ($\text{item.productId} \neq \text{recipe.productId}$).
3. **Cálculo de Costo Unitario**:
   $$\text{unitCost} = \frac{\text{totalCost}}{\text{yieldQuantity}}$$
4. **Sincronización de Costos con el Catálogo (`SyncRecipeCost`)**:
   - Al marcar la opción de sincronización (o ejecutar el comando manual `POST /recipes/:id/sync-cost`), el sistema traslada el costo unitario de la receta al `lastCost` del producto terminado y actualiza su precio de venta sugerido.

---

## 6. Compras de Materiales e Insumos (Purchases)

### 6.1 Propósito y Motor Bimoneda
Permite registrar la adquisición formal de insumos, materias primas y mercadería a proveedores comerciales. Está concebido con soporte **bimoneda nativo en tiempo real**:
- **Moneda Funcional**: Dólares estadounidenses (`USD`, símbolo `$`).
- **Moneda Local**: Bolívares (`VES`, símbolo `Bs.`), Pesos u otra moneda soberana de operación local.
- **Moneda del Documento (`documentCurrency`)**: Moneda en la que el proveedor emitió la factura.
- **Tasa de Cambio (`exchangeRate`)**: Factor de conversión ($> 0$) para computar simultáneamente ambos montos.

### 6.2 Ciclo de Vida y Máquina de Estados
1. **`DRAFT` (Borrador)**:
   - Registro en preparación, proforma o cotización.
   - Permite modificación completa de encabezado e ítems.
   - **No afecta stock de inventario** ni modifica los costos de catálogo.
2. **`COMPLETED` (Completada / Liquidada)**:
   - Transacción en firme con recepción de materiales y factura validada.
   - **Es irreversible**: una compra completada no puede revertirse a borrador.
   - **Impacto automático**:
     - Actualiza el `lastCost` en el catálogo de todos los materiales incluidos.
     - Emite el evento de dominio desacoplado `MaterialPurchaseCompletedEvent`.
     - El módulo de Inventario escucha este evento para generar las entradas de stock correspondientes.
3. **`CANCELLED` (Anulada)**:
   - Anulación administrativa de la orden.
   - Es inmutable y no genera efectos en costos ni stock.

### 6.3 Reglas Fiscales y Financieras
- **Unicidad de Factura**: No se permite registrar dos compras con el mismo número de factura física (`invoiceNumber`) para el mismo proveedor.
- **Cálculo de Impuestos por Ítem**:
  - Cada ítem especifica si es gravable (`isTaxable`) y su alícuota de IVA (`taxRate`, ej. 16%).
  - Los totales de subtotal, IVA y total general se calculan y guardan con 4 decimales tanto en moneda funcional como en moneda local.

---

## 7. Inventario y Control de Stock (Alcance y Arquitectura)

### 7.1 Modelo y Arquitectura Desacoplada
El control de inventario opera de forma reactiva y desacoplada mediante **Domain Events** y trazabilidad de **Kardex**:

```
[ EVENTOS DE ENTRADA ]                                   [ EVENTOS DE SALIDA ]
- MaterialPurchaseCompletedEvent                          - SaleCompletedEvent (Ventas)
- ProductionOrderCompletedEvent (Recetas)                - ProductionMaterialConsumedEvent
- InventoryManualAdjustmentInEvent                       - InventoryManualAdjustmentOutEvent
                 |                                                        |
                 +-------------------> [ KARDEX ] <-----------------------+
                                          |
                                          v
                              [ STOCK POR PRODUCTO ]
                                 (Físico y Disponible)
```

### 7.2 Tipos de Movimientos en el Kardex
Cada registro del Kardex es inmutable y documenta:
1. `fecha_hora`: Timestamp exacto de la transacción.
2. `producto_id`: Ítem involucrado (solo productos con control de stock: `RAW_MATERIAL`, `TRADITIONAL`, `FINISHED_GOOD`).
3. `almacen_id`: Ubicación física o depósito.
4. `tipo_movimiento`:
   - `COMPRA_ENTRADA`: Entrada originada por una compra completada.
   - `VENTA_SALIDA`: Despacho por venta confirmada en POS o pedido.
   - `PRODUCCION_CONSUMO`: Salida de materias primas por ejecución de una receta.
   - `PRODUCCION_ENTRADA`: Entrada del producto terminado producido por la receta.
   - `AJUSTE_POSITIVO` / `AJUSTE_NEGATIVO`: Correcciones por inventario físico, mermas o roturas.
5. `cantidad`: Variación numérica en la unidad de medida del producto.
6. `costo_unitario`: Costo histórico de la transacción.
7. `saldo_cantidad`: Stock resultante tras aplicar el movimiento.
8. `referencia`: Identificador del documento fuente (número de compra, factura de venta, código de orden de producción).

### 7.3 Parámetros de Control y Alertas
- **Stock Mínimo (`minStock`)**: Umbral de alerta para reposición inmediata.
- **Stock Máximo (`maxStock`)**: Límite para evitar sobrecostos de almacenamiento.
- **Punto de Reorden**: Disparador sugerido de compras hacia proveedores.
- **Regla de Existencia en Venta**: No es posible completar una venta de un producto tangible si su stock disponible es menor a la cantidad solicitada (evita stocks negativos involuntarios).

---

## 8. Ventas y Facturación / POS (Alcance y Arquitectura)

### 8.1 Propósito y Flujo Comercial
El módulo de ventas canaliza los ingresos de la empresa y se conecta directamente con el catálogo, inventario y finanzas:
1. **Cotizaciones / Presupuestos (`QUOTATION`)**:
   - Documento previo valorado para el cliente con vigencia en días. No reserva ni descuenta stock.
2. **Pedidos / Órdenes de Venta (`ORDER`)**:
   - Compromiso de compra que puede apartar o reservar stock temporalmente.
3. **Facturación / Venta en Caja (`INVOICE` / POS)**:
   - Emisión de comprobante fiscal o ticket de venta.
   - Cobra mediante múltiples medios de pago (efectivo USD, efectivo VES a tasa del día, tarjeta, transferencia).
   - Genera la salida definitiva de inventario emitiendo `SaleCompletedEvent`.

### 8.2 Reglas de Negocio en Ventas
- **Productos Aptos para Venta**: Solo pueden venderse productos con `isActive: true` cuyo tipo sea `TRADITIONAL`, `FINISHED_GOOD` o `SERVICE`.
- **Validación de Margen Mínimo**: El sistema alerta si el precio aplicado se ubica por debajo del `lastCost` registrado, impidiendo pérdidas operativas desapercibidas.
- **Descuento de Stock**: Los productos de tipo `SERVICE` no restringen ni modifican el stock de inventario.

---

## 9. Módulos Transversales y de Soporte

### 9.1 Identidad y Accesos (IAM)
- **Autenticación**: JWT con claves asimétricas RSA.
- **Control de Acceso Basado en Roles (RBAC)**:
  - Roles base: `ADMIN_ROLE`, `USER_ROLE`.
  - Matriz de permisos granulares por recurso y acción:
    - `products:read`, `products:manage`
    - `recipes:read`, `recipes:manage`
    - `categories:read`, `categories:manage`
    - `uofm:read`, `uofm:manage`
    - `purchases:read`, `purchases:manage`
    - `company:manage`, `company:read`
    - `users:manage`, `roles:manage`, `audit:read`, `audit:manage`

### 9.2 Configuración de Empresa (`Company`)
Entidad singleton que parametriza el funcionamiento global de la tienda:
- Datos legales: Razón social, NIT/RIF, dirección física, logotipo (claro/oscuro), pie de página de facturas.
- Configuración monetaria y regional: Moneda por defecto, símbolo, posición (`left`/`right`), cantidad de decimales (`2` o `4`), zona horaria y formato de fechas.
- Configuración de correo: Parámetros del servidor SMTP para el despacho de presupuestos y comprobantes.

### 9.3 Auditoría de Operaciones (`AuditLog`)
- Todo cambio mutante (`POST`, `PUT`, `PATCH`, `DELETE`) es interceptado automáticamente por el `AuditInterceptor`.
- Se almacena: usuario emisor, dirección IP, endpoint, duración en ms, y los estados completos `previousState`, `newState` y el diccionario de diferencias `changes: { [campo]: { from, to } }`.

---

## 10. Estándares de Arquitectura y Desarrollo

Para mantener la integridad técnica del código, cualquier nuevo desarrollo o refactorización debe respetar las siguientes normas establecidas en [.agents/skills/starterkit-architecture-standards/SKILL.md](file:///c:/Projects/NODE/ministore/.agents/skills/starterkit-architecture-standards/SKILL.md):

### 10.1 Frontend (React)
- **Zero Prop Drilling**: Toda vista compleja o listado consume el estado directamente de su Provider local (`use<Feature>Context` o `use<Feature>FormContext`).
- **Formularios en Página Completa**: Todo formulario con más de 3 campos, clasificaciones o fórmulas financieras debe residir en su propia ruta (`/new`, `/:id/edit`), segmentado en secciones modulares dentro de `components/form/sections/`.
- **Aislamiento de Fórmulas Matemáticas**: La lógica financiera (márgenes, subtotales, totales bimoneda) se aísla en `use<Feature>Calculations.ts` de forma pura, sin acoplamiento con React Hook Form.
- **Renglones Dinámicos (Master-Detail)**: Manipulación de ítems dinámicos mediante `use<Feature>FormItems.ts` desacoplado del lifecycle general del formulario.

### 10.2 Backend (NestJS)
- **Arquitectura Hexagonal Estricta & DDD**:
  - `domain/`: Entidades de negocio ricas (`BaseEntity`, métodos de cálculo e invariantes), enums/máquinas de estado, eventos de dominio y contratos segregados de repositorio (`IPurchaseReadRepository`, `IPurchaseWriteRepository`, `IPurchaseRepository`).
  - `application/`: Casos de uso segregados en CQRS (`commands/` y `queries/`), servicios de aplicación compartidos (`services/`), mappers de comandos (`mappers/`) y listeners de eventos (`events/`).
  - `infrastructure/`: Entidades TypeORM (`*.orm-entity.ts`), mappers bidireccionales ORM-Dominio (`*.orm-mapper.ts`) y adaptadores transaccionales (`TypeOrmPurchaseRepository`).
  - `presentation/`: Controladores REST delgados con Swagger y DTOs categorizados en subcarpetas (`requests/`, `responses/`, `queries/`), más mappers de respuesta HTTP (`*-response.mapper.ts`).
- **Segregación de Interfaces (ISP) en Repositorios**: Tokens separados para lectura (`*_READ_REPOSITORY_TOKEN`) y escritura (`*_WRITE_REPOSITORY_TOKEN`). Los casos de uso de consulta solo inyectan el repositorio de lectura para prevenir mutaciones indeseadas.
- **Arquitectura de Mappers en 3 Capas (Zero Contaminación)**:
  1. *Persistencia*: `*.orm-mapper.ts` (bidireccional entre TypeORM y Dominio).
  2. *Aplicación*: `*-command.mapper.ts` (construcción del agregado desde Comandos y resolución monetaria).
  3. *Presentación*: `*-response.mapper.ts` (transformación del modelo de dominio a DTOs de salida HTTP).
- **Persistencia Transaccional (Unit of Work)**: Persistencia atómica de agregados maestro-detalle mediante `this.dataSource.transaction(...)`.
- **Desacoplamiento Orientado a Eventos**: Emisión reactiva de eventos de integración entre Bounded Contexts (ej. Compras -> Inventario/Costos) vía NestJS CQRS `EventBus`.

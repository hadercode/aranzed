# Módulo de Control de Inventario (Inventory) — Documentación

Este directorio contiene la documentación técnica y funcional del módulo de **Inventarios** de **Ministore ERP**.

El módulo controla el inventario multialmacén, existencias físicas y reservadas, motivos de movimiento parametrizados, transacciones kardex (Entradas, Salidas, Ajustes y Transferencias entre almacenes) y costos promedio ponderados.

---

## 🗂 Índice de Documentos

1. **[Diagrama de Base de Datos (ERD)](./erd-diagram.md):** Modelo de Almacenes, Existencias (Stocks), Motivos y Transacciones con renglones de lote/vencimiento.
2. **[Diagrama de Flujo](./flow-diagram.md):** Flujo de movimientos de inventario, transferencias y actualización atómica del stock disponible.
3. **[Casos de Uso Práctico](./use-cases.md):** Escenarios de recepción física, transferencias entre depósitos y ajustes por merma.
4. **[Colección de Postman](./inventory.postman_collection.json):** Endpoints completos para Almacenes, Motivos, Stocks y Movimientos.

---

## 🏛️ Conceptos y Reglas de Dominio

### 1. Tipos de Transacciones de Inventario (`TransactionType`)
- **`INPUT` (Entrada)**: Incrementa el stock en el almacén de destino (por compras o devoluciones).
- **`OUTPUT` (Salida)**: Reduce el stock físico en el almacén origen (por despacho de ventas o consumo de producción).
- **`TRANSFER` (Transferencia)**: Operación atómica de dos fases que descuenta unidades del almacén origen (`warehouseId`) e incrementa exactamente la misma cantidad en el almacén destino (`targetWarehouseId`).
- **`ADJUSTMENT` (Ajuste Físico)**: Cuadre de inventario tras conteos cíclicos o mermas operativas.

### 2. Multi-Almacén y Almacén por Defecto
- Soporta múltiples bodegas físicas (ej: Almacén Principal, Bodega Fría, Depósito de Tienda).
- Un almacén puede marcarse como `isDefault = true`, utilizándose de manera predeterminada al registrar compras o ventas si el usuario no especifica uno distinto.

### 3. Trazabilidad por Lotes y Fechas de Vencimiento
- Cada renglón de movimiento (`inventory_transaction_items`) permite registrar `batchNumber` (número de lote) y `expirationDate` (fecha de caducidad), garantizando cumplimiento FIFO/FEFO en materias primas y perecederos.

---

## 📡 Endpoints del Módulo

| Módulo | Método | Endpoint | Permiso Requerido | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| **Almacenes** | `GET` | `/inventory/warehouses` | `JwtAuthGuard` | Listado de almacenes activos y por defecto. |
| **Almacenes** | `POST` | `/inventory/warehouses` | `JwtAuthGuard` | Crea un nuevo almacén o depósito. |
| **Almacenes** | `PUT` | `/inventory/warehouses/:id` | `JwtAuthGuard` | Modifica código, nombre o dirección de almacén. |
| **Motivos** | `GET` | `/inventory/reasons` | `JwtAuthGuard` | Lista motivos de entrada, salida o ajuste. |
| **Motivos** | `POST` | `/inventory/reasons` | `JwtAuthGuard` | Registra motivo parametrizado (ej: Merma por daño). |
| **Stocks** | `GET` | `/inventory/stocks` | `JwtAuthGuard` | Resumen consolidado de existencias por producto. |
| **Stocks** | `GET` | `/inventory/stocks/low-stock` | `JwtAuthGuard` | Alertas de productos por debajo del stock mínimo. |
| **Transacciones** | `GET` | `/inventory/transactions` | `JwtAuthGuard` | Historial de movimientos kardex con filtros. |
| **Transacciones** | `GET` | `/inventory/transactions/:id` | `JwtAuthGuard` | Detalle de movimiento y sus renglones con costos. |
| **Transacciones** | `POST` | `/inventory/transactions` | `JwtAuthGuard` | Ejecuta movimiento físico atómico (Entrada/Salida/Transfer). |

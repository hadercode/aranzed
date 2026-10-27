# Diagrama de Base de Datos (ERD) — Módulo Inventory

Modelo entidad-relación del subsistema de inventarios multialmacén, control de stock por depósito y transacciones kardex.

```mermaid
erDiagram
    WAREHOUSES {
        uuid id PK "Identificador único"
        varchar code UK "Código de almacén (ej: ALM-01)"
        varchar name "Nombre (ej: Almacén Principal)"
        varchar address "Ubicación física"
        boolean isDefault "Es el almacén predeterminado"
        boolean isActive "Estado de operación"
        timestamp createdAt "Fecha de creación"
        timestamp updatedAt "Fecha de actualización"
    }

    INVENTORY_REASONS {
        uuid id PK "Identificador único"
        varchar code UK "Código nemotécnico (ej: MOT-COMPRA)"
        varchar name "Nombre visible (ej: Recepción de Compra)"
        varchar type "Tipo: INPUT | OUTPUT | ADJUSTMENT"
        varchar description "Descripción operativa"
        boolean isActive "Estado"
        timestamp createdAt "Fecha de creación"
        timestamp updatedAt "Fecha de actualización"
    }

    INVENTORY_STOCKS {
        uuid id PK "Identificador único"
        uuid warehouseId FK "Almacén donde reside el stock"
        uuid productId FK "Producto en existencia"
        decimal currentStock "Stock físico real disponible (12,4)"
        decimal reservedStock "Stock comprometido en pedidos (12,4)"
        decimal minAlert "Umbral mínimo de reorden"
        decimal maxAlert "Umbral máximo de capacidad"
        decimal lastCost "Último costo de adquisición"
        decimal avgCost "Costo promedio ponderado"
        timestamp updatedAt "Última actualización de stock"
    }

    INVENTORY_TRANSACTIONS {
        uuid id PK "Identificador único"
        varchar transactionNumber UK "Correlativo de movimiento (ej: MOV-2026-0001)"
        varchar type "Tipo: INPUT | OUTPUT | TRANSFER | ADJUSTMENT"
        uuid warehouseId FK "Almacén origen"
        uuid targetWarehouseId FK "Almacén destino (solo para TRANSFER)"
        uuid reasonId FK "Motivo de la transacción"
        varchar referenceDocument "Documento de soporte (ej: Fac-1029)"
        text notes "Observaciones de la operación"
        uuid performedBy "Usuario que ejecutó el movimiento"
        date date "Fecha efectiva del movimiento"
        timestamp createdAt "Timestamp de creación"
    }

    INVENTORY_TRANSACTION_ITEMS {
        uuid id PK "Identificador único de renglón"
        uuid transactionId FK "Movimiento al que pertenece"
        uuid productId FK "Producto afectado"
        decimal quantity "Cantidad movida (12,4)"
        decimal unitCost "Costo unitario del movimiento"
        decimal totalCost "Costo total (quantity * unitCost)"
        varchar batchNumber "Número de lote (Nullable)"
        date expirationDate "Fecha de vencimiento (Nullable)"
    }

    WAREHOUSES ||--o{ INVENTORY_STOCKS : "almacena"
    WAREHOUSES ||--o{ INVENTORY_TRANSACTIONS : "origen de"
    WAREHOUSES ||--o{ INVENTORY_TRANSACTIONS : "destino de"
    INVENTORY_REASONS ||--o{ INVENTORY_TRANSACTIONS : "justifica"
    INVENTORY_TRANSACTIONS ||--|{ INVENTORY_TRANSACTION_ITEMS : "contiene"
```

---

## 🔗 Relaciones y Reglas de Integridad

1. **`inventory_stocks` (Clave Única Compuesta `warehouseId` + `productId`)**: Cada par Almacén-Producto tiene exactamente un registro de stock que consolida el saldo actual y los costos promedio.
2. **`inventory_transactions` ↔ `inventory_transaction_items` (1:N)**: Estructura Cabecera-Detalle atómica. El recálculo de stock de todos los renglones se ejecuta dentro de una transacción de base de datos (`Unit of Work`).
3. **Transferencias (`TRANSFER`)**: La transacción vincula `warehouseId` (origen) y `targetWarehouseId` (destino).

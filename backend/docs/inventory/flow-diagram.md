# Diagramas de Flujo — Módulo Inventory

Diagramas de secuencia que describen la ejecución atómica de movimientos de inventario y transferencias entre depósitos.

---

## 1. Flujo de Transacción de Entrada (`INPUT`) y Actualización de Stock

```mermaid
sequenceDiagram
    actor Operador as Operador de Bodega
    participant Controller as InventoryTransactionsController
    participant Service as InventoryTransactionsService
    participant TypeOrm as TypeORM DataSource (Transaction)
    participant TxTable as inventory_transactions
    participant StockTable as inventory_stocks

    Operador->>Controller: POST /inventory/transactions { type: "INPUT", warehouseId, reasonId, items: [...] }
    Controller->>Service: createTransaction(dto, userId)
    Service->>TypeOrm: dataSource.transaction(...)
    
    TypeOrm->>TxTable: INSERT INTO inventory_transactions (correlativo, fecha, notas, ...)
    TypeOrm->>TxTable: INSERT INTO inventory_transaction_items (lote, vencimiento, cantidad, ...)
    
    loop Por cada producto en items
        TypeOrm->>StockTable: SELECT currentStock, avgCost FROM inventory_stocks WHERE warehouseId AND productId
        alt Stock Existe
            TypeOrm->>StockTable: UPDATE inventory_stocks SET currentStock = currentStock + quantity, lastCost = itemCost
        else Stock No Existe
            TypeOrm->>StockTable: INSERT INTO inventory_stocks (warehouseId, productId, currentStock = quantity, lastCost = itemCost)
        end
    end
    
    TypeOrm-->>Service: Commit de Transacción
    Service-->>Controller: Transacción Completada
    Controller-->>Operador: 201 Created { transactionNumber: "MOV-2026-0042", ... }
```

---

## 2. Flujo de Transferencia Entre Almacenes (`TRANSFER`)

```mermaid
sequenceDiagram
    actor Supervisor as Supervisor de Logística
    participant Controller as InventoryTransactionsController
    participant Service as InventoryTransactionsService
    participant TypeOrm as TypeORM (Atomic Transaction)
    participant StockTable as inventory_stocks

    Supervisor->>Controller: POST /inventory/transactions { type: "TRANSFER", warehouseId: "BODEGA-A", targetWarehouseId: "BODEGA-B", items: [ { productId: "HAR-01", quantity: 50 } ] }
    Controller->>Service: createTransaction(dto)
    
    Service->>TypeOrm: Iniciar Transacción SQL
    
    %% Fase 1: Validar y descontar del Almacén Origen
    TypeOrm->>StockTable: SELECT currentStock FROM inventory_stocks WHERE warehouseId = "BODEGA-A" AND productId = "HAR-01"
    alt Stock Insuficiente en Origen
        TypeOrm-->>Service: Error: "Stock insuficiente en almacén de origen para HAR-01"
        Service-->>Controller: 400 Bad Request
        Controller-->>Supervisor: 400 Bad Request
    else Stock Suficiente
        TypeOrm->>StockTable: UPDATE inventory_stocks SET currentStock = currentStock - 50 WHERE warehouseId = "BODEGA-A"
        
        %% Fase 2: Acreditar en Almacén Destino
        TypeOrm->>StockTable: UPDATE inventory_stocks SET currentStock = currentStock + 50 WHERE warehouseId = "BODEGA-B"
        
        TypeOrm-->>Service: Commit Transacción
        Service-->>Controller: Transferencia Exitosa
        Controller-->>Supervisor: 201 Created (Stock balanceado entre bodegas)
    end
```

# Diagramas de Flujo — Módulo Purchases

Diagramas de secuencia del ciclo de vida de una compra y la propagación desacoplada mediante eventos de dominio (`CQRS EventBus`).

---

## 1. Máquina de Estados del Documento de Compra

```mermaid
stateDiagram-v2
    [*] --> DRAFT : POST /purchases
    
    DRAFT --> CONFIRMED : PATCH /purchases/:id/status { status: 'CONFIRMED' }
    DRAFT --> CANCELLED : PATCH /purchases/:id/status { status: 'CANCELLED' }
    
    CONFIRMED --> RECEIVED : PATCH /purchases/:id/status { status: 'RECEIVED' }
    CONFIRMED --> CANCELLED : PATCH /purchases/:id/status { status: 'CANCELLED' }
    
    RECEIVED --> [*] : Inmutable (Stock ingresado y costos recalculados)
    CANCELLED --> [*] : Estado Terminal
```

---

## 2. Flujo de Recepción y Desacoplamiento Event-Driven (`RECEIVED`)

```mermaid
sequenceDiagram
    actor Supervisor as Supervisor de Almacén
    participant Controller as PurchasesController
    participant CommandBus as NestJS CommandBus
    participant Handler as UpdatePurchaseStatusHandler
    participant PurchaseRepo as PurchaseRepository
    participant EventBus as NestJS EventBus
    participant Listener as MaterialPurchaseCompletedListener
    participant InventoryService as InventoryTransactionsService
    participant ProductRepo as ProductRepository

    Supervisor->>Controller: PATCH /purchases/:id/status { status: "RECEIVED" }
    Controller->>CommandBus: execute(UpdatePurchaseStatusCommand)
    CommandBus->>Handler: handle(command)
    
    Handler->>PurchaseRepo: findById(id)
    PurchaseRepo-->>Handler: Purchase Aggregate
    
    Handler->>Handler: purchase.transitionTo(PurchaseStatus.RECEIVED)
    Handler->>PurchaseRepo: save(purchase)
    
    Handler->>EventBus: publish(new MaterialPurchaseCompletedEvent(purchaseId, warehouseId, items))
    Handler-->>Controller: Purchase Actualizada
    Controller-->>Supervisor: 200 OK (Compra Marcada como Recibida)
    
    %% Ejecución Asíncrona / Desacoplada
    critical Proceso de Evento de Dominio
        EventBus->>Listener: handle(MaterialPurchaseCompletedEvent)
        Listener->>InventoryService: createInputMovement(warehouseId, "Ingreso por Compra " + purchaseNumber, items)
        InventoryService-->>Listener: Kardex actualizado y stock incrementado
        
        loop Para cada producto en items
            Listener->>ProductRepo: Recalcular Costo Promedio Ponderado y lastCost
        end
    end
```

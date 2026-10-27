# Casos de Uso Práctico — Módulo Purchases

Escenarios paso a paso para la emisión de órdenes de compra, control multimoneda y recepción física de mercancía en bodega.

---

## 📌 Caso de Uso 1: Obtener Siguiente Correlativo y Crear Orden de Compra en Dólares (USD)

### Paso 1: Consultar Próximo Número Correlativo
- **Método y Ruta**: `GET /purchases/next-number`
- **Cabeceras**: `Authorization: Bearer {{token}}`
- **Respuesta (`200 OK`)**:
  ```json
  {
    "nextNumber": "CMP-2026-0005"
  }
  ```

### Paso 2: Registrar Compra con Tasa de Cambio
- **Método y Ruta**: `POST /purchases`
- **Cuerpo (Payload)**:
  ```json
  {
    "purchaseNumber": "CMP-2026-0005",
    "supplierName": "Molinos Internacionales S.A.",
    "supplierDocument": "J-99887766-1",
    "documentType": "FACTURA",
    "documentNumber": "FAC-001239",
    "currencyCode": "USD",
    "exchangeRate": 1.0,
    "warehouseId": "w-almacen-central-id",
    "notes": "Compra de materia prima con entrega en 3 días hábiles",
    "items": [
      {
        "productId": "ins-harina-id",
        "quantity": 200,
        "unitPrice": 1.25,
        "taxAmount": 0.00,
        "batchNumber": "LOTE-MOL-401",
        "expirationDate": "2027-06-30"
      },
      {
        "productId": "ins-azucar-id",
        "quantity": 50,
        "unitPrice": 0.90,
        "taxAmount": 0.00,
        "batchNumber": "LOTE-AZU-102",
        "expirationDate": "2027-12-31"
      }
    ]
  }
  ```
- **Respuesta Exitosa (`201 Created`)**:
  ```json
  {
    "id": "pur-uuid-5555",
    "purchaseNumber": "CMP-2026-0005",
    "status": "DRAFT",
    "subtotal": 295.00,
    "totalAmount": 295.00
  }
  ```

---

## 📌 Caso de Uso 2: Confirmar la Orden con el Proveedor

### Descripción
El proveedor confirma la disponibilidad de despacho. La orden pasa de `DRAFT` a `CONFIRMED`.

- **Método y Ruta**: `PATCH /purchases/:id/status`
- **Cuerpo (Payload)**:
  ```json
  {
    "status": "CONFIRMED"
  }
  ```
- **Respuesta (`200 OK`)**:
  ```json
  {
    "id": "pur-uuid-5555",
    "status": "CONFIRMED",
    "updatedAt": "2026-10-26T23:35:00.000Z"
  }
  ```

---

## 📌 Caso de Uso 3: Recepción Física y Disparo del Evento de Inventario

### Descripción
El camión del proveedor llega a la bodega. El almacenista verifica los sacos físicos y marca la orden como `RECEIVED`.

- **Método y Ruta**: `PATCH /purchases/:id/status`
- **Cuerpo (Payload)**:
  ```json
  {
    "status": "RECEIVED"
  }
  ```
- **Efectos Automáticos Desacoplados**:
  1. `material_purchases.receivedAt` se sella con el timestamp actual.
  2. Se emite `MaterialPurchaseCompletedEvent`.
  3. El listener de inventario crea una transacción `INPUT` en `inventory_transactions` por 200 kg de harina y 50 kg de azúcar.
  4. Los stocks físicos en `inventory_stocks` (`w-almacen-central-id`) aumentan automáticamente.
  5. En `products`, el `costPrice` se actualiza al nuevo costo promedio ponderado.

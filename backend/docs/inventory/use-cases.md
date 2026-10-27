# Casos de Uso Práctico — Módulo Inventory

Escenarios reales de almacenes, ingreso de mercadería, transferencias y control de alertas de existencias.

---

## 📌 Caso de Uso 1: Crear Almacén y Parametrizar Motivo de Entrada

### Paso 1: Crear Almacén Principal
- **Método y Ruta**: `POST /inventory/warehouses`
- **Cabeceras**: `Authorization: Bearer {{token}}`
- **Cuerpo (Payload)**:
  ```json
  {
    "code": "ALM-PPAL",
    "name": "Almacén Central y Despachos",
    "address": "Zona Industrial Calle 10 # 45-20",
    "isDefault": true
  }
  ```
- **Respuesta (`201 Created`)**:
  ```json
  {
    "id": "w1111111-2222-3333-4444-555555555555",
    "code": "ALM-PPAL",
    "isDefault": true,
    "isActive": true
  }
  ```

### Paso 2: Crear Motivo de Ajuste por Merma
- **Método y Ruta**: `POST /inventory/reasons`
- **Cuerpo (Payload)**:
  ```json
  {
    "code": "MERMA-DAN",
    "name": "Merma por Deterioro o Rotura",
    "type": "OUTPUT",
    "description": "Salida de productos por daño en manipulación física"
  }
  ```

---

## 📌 Caso de Uso 2: Entrada Inicial de Stock con Lote y Caducidad

### Descripción
Ingresar físicamente 100 kg de Harina de Trigo al almacén central asociando lote y vencimiento.

- **Método y Ruta**: `POST /inventory/transactions`
- **Cuerpo (Payload)**:
  ```json
  {
    "type": "INPUT",
    "warehouseId": "w1111111-2222-3333-4444-555555555555",
    "reasonId": "r0000000-0000-0000-0000-000000000001",
    "referenceDocument": "REM-PROV-9876",
    "notes": "Ingreso de carga proveniente de Molinos del Norte",
    "date": "2026-10-26",
    "items": [
      {
        "productId": "ins-har-uuid",
        "quantity": 100,
        "unitCost": 1.25,
        "totalCost": 125.00,
        "batchNumber": "LOTE-2026-OCT-01",
        "expirationDate": "2027-04-30"
      }
    ]
  }
  ```
- **Respuesta (`201 Created`)**:
  ```json
  {
    "id": "tx-uuid-12345",
    "transactionNumber": "MOV-2026-0001",
    "type": "INPUT",
    "status": "COMPLETED"
  }
  ```

---

## 📌 Caso de Uso 3: Transferencia Entre Almacenes

### Descripción
Mover 30 unidades de Harina desde el "Almacén Central" hacia la "Bodega de Tienda".

- **Método y Ruta**: `POST /inventory/transactions`
- **Cuerpo**:
  ```json
  {
    "type": "TRANSFER",
    "warehouseId": "w-almacen-central-id",
    "targetWarehouseId": "w-bodega-tienda-id",
    "referenceDocument": "TRF-INT-0012",
    "notes": "Reabastecimiento para punto de venta",
    "date": "2026-10-26",
    "items": [
      {
        "productId": "ins-har-uuid",
        "quantity": 30,
        "unitCost": 1.25,
        "totalCost": 37.50
      }
    ]
  }
  ```
- **Efecto Inmediato**:
  - `inventory_stocks` (Almacén Central): Pasa de 100 kg a **70 kg**.
  - `inventory_stocks` (Bodega Tienda): Pasa de 0 kg a **30 kg**.

---

## 📌 Caso de Uso 4: Consulta de Alertas de Stock Bajo (Bajo Mínimo)

### Descripción
El sistema o el dashboard ejecutivo verifica qué insumos han caído por debajo de su umbral mínimo de seguridad.

- **Método y Ruta**: `GET /inventory/stocks/low-stock`
- **Respuesta (`200 OK`)**:
  ```json
  [
    {
      "productId": "ins-har-uuid",
      "productName": "Harina de Trigo Especial",
      "sku": "INS-HAR-01",
      "warehouseName": "Bodega de Tienda",
      "currentStock": 30,
      "minAlert": 50,
      "deficit": 20,
      "unitSymbol": "kg"
    }
  ]
  ```

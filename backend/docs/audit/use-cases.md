# Casos de Uso Práctico — Módulo Audit

Escenarios de inspección forense, auditoría de precios y análisis de métricas de seguridad.

---

## 📌 Caso de Uso 1: Consulta Paginada de Eventos Críticos

### Descripción
El oficial de cumplimiento revisa todas las modificaciones (`UPDATE`) y eliminaciones (`DELETE`) ocurridas durante la jornada laboral.

- **Método y Ruta**: `GET /audit`
- **Cabeceras**: `Authorization: Bearer {{token}}`
- **Query Params**:
  - `action`: `UPDATE`
  - `model`: `Product`
  - `page`: `1`
  - `limit`: `10`
- **Respuesta (`200 OK`)**:
  ```json
  {
    "data": [
      {
        "id": "aud-1111-2222-3333",
        "action": "UPDATE",
        "model": "Product",
        "entityId": "prod-croiss-uuid",
        "userEmail": "admin@example.com",
        "userName": "Administrador Principal",
        "description": "Actualización de precio de venta",
        "ipAddress": "192.168.1.50",
        "method": "PUT",
        "endpoint": "/catalog/products/prod-croiss-uuid",
        "statusCode": 200,
        "durationMs": 42,
        "createdAt": "2026-10-26T21:15:30.000Z"
      }
    ],
    "meta": {
      "total": 1,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  }
  ```

---

## 📌 Caso de Uso 2: Inspección de Detalle Forense y Comparativa de Cambios (`diff`)

### Descripción
Un supervisor investiga por qué cambió el precio de venta de un producto y quién fue el responsable.

- **Método y Ruta**: `GET /audit/:id`
- **Respuesta (`200 OK`)**:
  ```json
  {
    "id": "aud-1111-2222-3333",
    "action": "UPDATE",
    "model": "Product",
    "entityId": "prod-croiss-uuid",
    "userEmail": "carlos.vendedor@empresa.com",
    "previousState": {
      "name": "Croissant Francés (Pack x6)",
      "salePrice": "8.50",
      "minStock": 10
    },
    "newState": {
      "name": "Croissant Francés (Pack x6)",
      "salePrice": "10.00",
      "minStock": 15
    },
    "changes": {
      "salePrice": {
        "old": "8.50",
        "new": "10.00"
      },
      "minStock": {
        "old": 10,
        "new": 15
      }
    },
    "ipAddress": "186.155.10.22",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130.0.0.0",
    "statusCode": 200,
    "durationMs": 35,
    "createdAt": "2026-10-26T21:15:30.000Z"
  }
  ```

---

## 📌 Caso de Uso 3: Dashboard de Métricas y Resumen de Auditoría

### Descripción
Generar los indicadores clave de desempeño (KPIs) de actividad del sistema para el panel de control.

- **Método y Ruta**: `GET /audit/stats/summary`
- **Respuesta (`200 OK`)**:
  ```json
  {
    "totalEvents": 1420,
    "todayEvents": 156,
    "eventsByAction": {
      "CREATE": 450,
      "UPDATE": 620,
      "DELETE": 15,
      "LOGIN": 335
    },
    "topModels": [
      { "model": "Sale", "count": 512 },
      { "model": "Product", "count": 310 },
      { "model": "InventoryTransaction", "count": 280 }
    ],
    "averageResponseTimeMs": 28.4,
    "errorRatePercentage": 0.45
  }
  ```

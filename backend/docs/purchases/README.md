# Módulo de Compras de Materia Prima (Purchases) — Documentación

Este directorio contiene la documentación técnica y funcional del módulo de **Compras** de **Ministore ERP**.

El módulo gestiona el aprovisionamiento de materias primas e insumos, órdenes de compra con proveedores, transacciones multimoneda con conversión de tipo de cambio, correlativos automáticos y la integración reactiva desacoplada hacia Inventario y Costos mediante Event-Driven Architecture.

---

## 🗂 Índice de Documentos

1. **[Diagrama de Base de Datos (ERD)](./erd-diagram.md):** Modelo de Compras y Renglones con soporte dual de monedas y lotes.
2. **[Diagrama de Flujo](./flow-diagram.md):** Máquina de estados (`DRAFT` -> `CONFIRMED` -> `RECEIVED`) y desacoplamiento con `EventBus`.
3. **[Casos de Uso Práctico](./use-cases.md):** Escenarios de emisión de orden de compra en dólares/moneda local y recepción en bodega.
4. **[Colección de Postman](./purchases.postman_collection.json):** Endpoints listos con correlativos, creación, consulta y transiciones de estado.

---

## 🏛️ Conceptos y Reglas de Dominio

### 1. Máquina de Estados del Documento (`PurchaseStatus`)
- **`DRAFT` (Borrador)**: La orden de compra está en edición. Permite modificar renglones, precios y cantidades. No afecta inventario.
- **`CONFIRMED` (Confirmada / Aprobada)**: Orden enviada al proveedor. Los precios y condiciones quedan congelados.
- **`RECEIVED` (Recibida en Bodega)**: Hito final de la compra. Transición inmutable que dispara eventos de dominio (`MaterialPurchaseCompletedEvent`), ingresa el stock físico y recalcula el costo promedio ponderado de los insumos.
- **`CANCELLED` (Anulada)**: La orden queda sin efecto. No se puede revertir a estados anteriores.

### 2. Soporte Dual de Monedas y Tasa de Cambio
- El documento soporta registrar compras en moneda extranjera (`documentCurrency`, ej: USD) manteniendo los importes convertidos en la moneda base del ERP (`currencyCode`, ej: COP o MXN) mediante el factor `exchangeRate`:
  $$\text{Total Base} = \text{Total Documento} \times \text{exchangeRate}$$
- Esto preserva los valores originales facturados por el proveedor internacional y los equivalentes contables locales.

### 3. Desacoplamiento Event-Driven
- Al marcarse como `RECEIVED`, el caso de uso no actualiza tablas de inventario en el mismo servicio; en su lugar, publica `MaterialPurchaseCompletedEvent`. El listener correspondiente asume la responsabilidad de registrar el Kardex y actualizar el costo del producto de forma desacoplada.

---

## 📡 Endpoints del Módulo

| Método | Endpoint | Permiso Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/purchases` | `purchases:read` | Listado paginado con filtros (`status`, `search`, `supplier`, fechas). |
| `GET` | `/purchases/next-number` | `purchases:read` | Obtiene el correlativo sugerido para la siguiente compra (ej: `CMP-2026-0001`). |
| `GET` | `/purchases/:id` | `purchases:read` | Consulta detalle completo de compra y sus renglones. |
| `POST` | `/purchases` | `purchases:manage` | Registra una nueva compra en estado inicial `DRAFT`. |
| `PUT` | `/purchases/:id` | `purchases:manage` | Actualiza una orden de compra en estado `DRAFT`. |
| `PATCH`| `/purchases/:id/status` | `purchases:manage` | Transiciona el estado (`CONFIRMED`, `RECEIVED`, `CANCELLED`). |
| `DELETE`| `/purchases/:id` | `purchases:manage` | Elimina una compra en borrador o cancelada. |

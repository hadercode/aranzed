# Módulo de Ventas y Cobranzas (Sales) — Documentación

Este directorio contiene la documentación técnica y funcional del módulo de **Ventas** de **Ministore ERP**.

El módulo gestiona todo el ciclo comercial: emisión de cotizaciones / presupuestos, conversión a ventas en firme, facturación, plazos de crédito, control de abonos/pagos con comprobantes digitales y exportación de reportes ejecutivos en PDF y Excel.

---

## 🗂 Índice de Documentos

1. **[Diagrama de Base de Datos (ERD)](./erd-diagram.md):** Modelo relacional de Ventas, Renglones y Registro de Pagos / Abonos.
2. **[Diagrama de Flujo](./flow-diagram.md):** Flujo de conversión de cotización a venta, gestión de cartera (abonos) y generación de reportes.
3. **[Casos de Uso Práctico](./use-cases.md):** Escenarios de cotización formal, venta a crédito con múltiples pagos y generación de PDF.
4. **[Colección de Postman](./sales.postman_collection.json):** Colección completa para Ventas, Pagos, Subida de Comprobantes y Descarga de Reportes.

---

## 🏛️ Conceptos y Reglas de Negocio

### 1. Tipos de Documento Comercial (`SaleType`)
- **`QUOTATION` (Cotización / Presupuesto)**: Propuesta económica para el cliente. No descuenta stock ni genera cuentas por cobrar exigibles.
- **`SALE` (Venta Directa)**: Factura o pedido formal. Compromete stock y genera balance deudor según las condiciones de pago.

### 2. Conversión de Cotización (`convertQuotation`)
- Una cotización en estado `DRAFT` o `CONFIRMED` puede convertirse en una `SALE` mediante un único endpoint (`POST /sales/:id/convert`), preservando los precios pactados, clientes y renglones.

### 3. Plazos de Pago y Gestión de Cartera
- **Condiciones (`PaymentTerm`)**: `CASH` (Contado), `CREDIT_15`, `CREDIT_30`, `CREDIT_60`.
- **Estados de Cobro (`PaidStatus`)**:
  - `PENDING` (Saldo pendiente total).
  - `PARTIAL` (Abonos parciales registrados, $\text{amountPaid} > 0$ pero $< \text{totalAmount}$).
  - `PAID` (Totalmente saldada, $\text{balanceDue} = 0$).
- **Recálculo Reactivo de Pagos**: Cada vez que se registra un abono en `POST /sales/payments`, el sistema recalcula en tiempo real el saldo deudor (`balanceDue = totalAmount - amountPaid`) y ajusta automáticamente el `paidStatus`.

### 4. Generación Dinámica de Documentos PDF y Excel
- Utiliza **pdfmake** y **exceljs** del lado del servidor para generar vouchers de cotización, recibos de caja y reportes consolidados sin depender de herramientas externas.

---

## 📡 Endpoints del Módulo

| Módulo | Método | Endpoint | Permiso Requerido | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| **Ventas** | `GET` | `/sales` | `sales:read` | Listado paginado y filtrado de ventas y cotizaciones. |
| **Ventas** | `GET` | `/sales/stats` | `sales:read` | Métricas consolidadas (ingresos, balance pendiente, cotizaciones). |
| **Ventas** | `GET` | `/sales/:id` | `sales:read` | Consulta detalle completo del documento comercial. |
| **Ventas** | `POST` | `/sales` | `sales:manage` | Registra una venta o presupuesto nuevo. |
| **Ventas** | `PUT` | `/sales/:id` | `sales:manage` | Actualiza un documento en borrador. |
| **Ventas** | `POST` | `/sales/:id/convert` | `sales:manage` | Convierte cotización en venta formal. |
| **Ventas** | `PATCH`| `/sales/:id/status` | `sales:manage` | Actualiza el estado (`CONFIRMED`, `DELIVERED`, `CANCELLED`). |
| **Ventas** | `PATCH`| `/sales/:id/paid-status` | `sales:manage` | Modifica manualmente el estado de pago. |
| **Pagos** | `GET` | `/sales/payments/sale/:saleId` | `sales:read` | Historial de abonos de una venta específica. |
| **Pagos** | `POST` | `/sales/payments` | `sales:manage` | Registra un abono/pago y recalcula saldos. |
| **Pagos** | `POST` | `/sales/payments/upload-receipt`| `sales:manage` | Sube imagen o PDF del comprobante de transferencia bancaria. |
| **Reportes**| `GET` | `/sales/:id/pdf` | `sales:read` | Genera y descarga el comprobante en PDF de la venta. |
| **Reportes**| `GET` | `/sales/export/excel` | `sales:read` | Exporta listado de ventas a archivo Excel (.xlsx). |
| **Reportes**| `GET` | `/sales/export/pdf` | `sales:read` | Exporta listado consolidado a PDF. |

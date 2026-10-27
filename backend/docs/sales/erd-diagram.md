# Diagrama de Base de Datos (ERD) — Módulo Sales

Modelo entidad-relación del subsistema de ventas, cotizaciones, ítems facturados y comprobantes de pago.

```mermaid
erDiagram
    SALES {
        uuid id PK "Identificador único"
        varchar saleNumber UK "Correlativo de venta (ej: VEN-2026-0001, COT-2026-0001)"
        varchar saleType "Tipo: SALE | QUOTATION"
        varchar customerName "Nombre o razón social del cliente"
        varchar customerDocument "Identificación / Cédula / NIT del cliente"
        varchar customerEmail "Correo electrónico"
        varchar customerPhone "Teléfono"
        varchar status "Estado: DRAFT | CONFIRMED | DELIVERED | CANCELLED"
        varchar paymentTerm "Condición: CASH | CREDIT_15 | CREDIT_30 | CREDIT_60"
        varchar paidStatus "Cobro: PENDING | PARTIAL | PAID"
        decimal subtotal "Subtotal de la venta (12,4)"
        decimal taxRate "Porcentaje de IVA / Impuesto (ej: 19.00)"
        decimal taxAmount "Valor del impuesto calculado"
        decimal discountAmount "Descuento comercial global"
        decimal totalAmount "Monto total facturado"
        decimal amountPaid "Monto total abonado a la fecha"
        decimal balanceDue "Saldo pendiente por cobrar"
        date dueDate "Fecha de vencimiento del crédito"
        text notes "Observaciones de entrega o comerciales"
        text cancelReason "Motivo de anulación (Nullable)"
        uuid createdBy "Usuario vendedor"
        timestamp createdAt "Fecha de creación"
        timestamp updatedAt "Fecha de actualización"
    }

    SALE_ITEMS {
        uuid id PK "Identificador único de renglón"
        uuid saleId FK "Venta a la que pertenece"
        uuid productId FK "Producto vendido"
        varchar productName "Nombre del producto al momento de venta"
        decimal quantity "Cantidad vendida (12,4)"
        decimal unitPrice "Precio unitario pactado"
        decimal discount "Descuento por ítem"
        decimal subtotal "Subtotal (quantity * unitPrice - discount)"
        decimal taxAmount "Impuesto del ítem"
        decimal totalAmount "Total del renglón"
    }

    SALE_PAYMENTS {
        uuid id PK "Identificador único de pago"
        uuid saleId FK "Venta a la que se abona"
        varchar paymentNumber UK "Número de recibo de caja (ej: REC-0001)"
        varchar paymentMethod "Método: CASH | TRANSFER | CARD | OTHER"
        decimal amount "Monto del abono (12,4)"
        date paymentDate "Fecha de pago"
        varchar referenceNumber "Número de aprobación bancaria / transacción"
        varchar receiptUrl "Ruta al comprobante adjunto (JPG, PNG, PDF)"
        text notes "Notas del cajero"
        uuid receivedBy "Usuario que recibió el pago"
        timestamp createdAt "Timestamp de creación"
    }

    SALES ||--|{ SALE_ITEMS : "incluye renglones"
    SALES ||--o{ SALE_PAYMENTS : "recibe pagos"
```

---

## 🔗 Relaciones y Reglas de Integridad Financiera

1. **`sales` ↔ `sale_items` (1:N Cascada)**: Los renglones totalizan la base imponible y el impuesto.
2. **`sales` ↔ `sale_payments` (1:N)**: Una venta puede recibir múltiples pagos a lo largo del tiempo.
3. **Invariante Financiera de Cartera**:
   $$\text{balanceDue} = \text{totalAmount} - \sum(\text{sale\_payments.amount})$$
   $$\text{paidStatus} = \begin{cases} \text{PAID} & \text{si } \text{balanceDue} \le 0 \\ \text{PARTIAL} & \text{si } 0 < \text{amountPaid} < \text{totalAmount} \\ \text{PENDING} & \text{si } \text{amountPaid} = 0 \end{cases}$$

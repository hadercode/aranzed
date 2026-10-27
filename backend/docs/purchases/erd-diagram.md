# Diagrama de Base de Datos (ERD) — Módulo Purchases

Modelo relacional de cabecera y detalle de compras de materias primas con soporte de conversión multimoneda y almacén de destino.

```mermaid
erDiagram
    MATERIAL_PURCHASES {
        uuid id PK "Identificador único"
        varchar purchaseNumber UK "Correlativo fiscal (ej: CMP-2026-0001)"
        varchar supplierName "Nombre o razón social del proveedor"
        varchar supplierDocument "RUT / NIT / Identificación fiscal del proveedor"
        varchar documentType "Tipo de comprobante proveedor (FACTURA, REMISION)"
        varchar documentNumber "Número de factura emitida por proveedor"
        varchar currencyCode "Moneda base de la empresa (ej: USD, COP)"
        decimal exchangeRate "Tasa de cambio aplicada (10,4)"
        varchar status "Estado: DRAFT | CONFIRMED | RECEIVED | CANCELLED"
        decimal subtotal "Subtotal en moneda base"
        decimal taxAmount "Impuestos en moneda base"
        decimal totalAmount "Total neto en moneda base"
        decimal documentSubtotal "Subtotal en moneda del proveedor"
        decimal documentTaxAmount "Impuestos en moneda del proveedor"
        decimal documentTotalAmount "Total neto en moneda del proveedor"
        uuid warehouseId FK "Almacén de recepción de mercadería"
        text notes "Observaciones de la orden"
        uuid createdBy "Usuario que registró la orden"
        timestamp receivedAt "Fecha de recepción física"
        timestamp createdAt "Fecha de creación"
        timestamp updatedAt "Fecha de actualización"
    }

    MATERIAL_PURCHASE_ITEMS {
        uuid id PK "Identificador único de renglón"
        uuid purchaseId FK "Compra a la que pertenece"
        uuid productId FK "Producto / Insumo adquirido"
        decimal quantity "Cantidad comprada (12,4)"
        decimal unitPrice "Precio unitario en moneda base"
        decimal subtotal "Subtotal en moneda base (quantity * unitPrice)"
        decimal taxAmount "Impuesto del ítem en moneda base"
        decimal totalAmount "Total del ítem en moneda base"
        decimal documentUnitPrice "Precio unitario en moneda de compra"
        decimal documentSubtotal "Subtotal en moneda de compra"
        varchar batchNumber "Número de lote asignado por proveedor (Nullable)"
        date expirationDate "Fecha de caducidad del lote (Nullable)"
    }

    MATERIAL_PURCHASES ||--|{ MATERIAL_PURCHASE_ITEMS : "contiene renglones"
```

---

## 🔗 Relaciones y Reglas de Integridad

1. **`material_purchases` ↔ `material_purchase_items` (1:N Cascada)**:
   - Los ítems están subordinados al agregado raíz. Si la orden está en `DRAFT`, el guardado sincroniza atómicamente la lista de renglones.
2. **`warehouseId` (Almacén Receptor)**:
   - Almacena el destino final de los insumos. Cuando el estatus pasa a `RECEIVED`, el `MaterialPurchaseCompletedListener` utiliza este ID para alimentar el Kardex físico del almacén correspondiente.
3. **Dual Currency (`documentTotalAmount` vs `totalAmount`)**:
   - Garantiza consistencia en auditorías contables frente a fluctuaciones cambiarias.

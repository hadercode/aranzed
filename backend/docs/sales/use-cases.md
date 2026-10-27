# Casos de Uso Práctico — Módulo Sales

Escenarios de cotización comercial, facturación a crédito, recepción de pagos y exportación de reportes ejecutivos.

---

## 📌 Caso de Uso 1: Crear Presupuesto / Cotización Comercial

### Descripción
Un cliente solicita cotización por 20 packs de croissants y 5 pasteles. Se emite un presupuesto que no compromete inventario.

- **Método y Ruta**: `POST /sales`
- **Cabeceras**: `Authorization: Bearer {{token}}`
- **Cuerpo (Payload)**:
  ```json
  {
    "saleType": "QUOTATION",
    "customerName": "Cafetería La Esmeralda",
    "customerDocument": "NIT-901234567-8",
    "customerEmail": "compras@laesmeralda.com",
    "customerPhone": "+57 311 9876543",
    "paymentTerm": "CREDIT_30",
    "taxRate": 19.0,
    "discountAmount": 10.0,
    "notes": "Validez de la oferta: 15 días calendario",
    "items": [
      {
        "productId": "p-croissant-pack-id",
        "productName": "Croissant de Mantequilla (Pack x10)",
        "quantity": 20,
        "unitPrice": 12.50,
        "discount": 0.00
      }
    ]
  }
  ```
- **Cálculo de Totales**:
  - Subtotal: $20 \times 12.50 = \$250.00$
  - Descuento: $-\$10.00$ $\rightarrow$ Base Gravable: $\$240.00$
  - IVA (19%): $\$45.60$
  - Total Neto: $\$285.60$
- **Respuesta (`201 Created`)**:
  ```json
  {
    "id": "sale-uuid-7777",
    "saleNumber": "COT-2026-0001",
    "saleType": "QUOTATION",
    "status": "DRAFT",
    "totalAmount": 285.60,
    "balanceDue": 285.60,
    "paidStatus": "PENDING"
  }
  ```

---

## 📌 Caso de Uso 2: Conversión de Cotización a Venta Directa

### Descripción
El cliente acepta el presupuesto. Se convierte la cotización a venta formal con un solo clic.

- **Método y Ruta**: `POST /sales/:id/convert`
- **Respuesta (`200 OK`)**:
  ```json
  {
    "id": "sale-uuid-7777",
    "saleNumber": "VEN-2026-0001",
    "saleType": "SALE",
    "status": "CONFIRMED",
    "totalAmount": 285.60,
    "dueDate": "2026-11-25"
  }
  ```

---

## 📌 Caso de Uso 3: Registro de Abono con Comprobante Adjunto

### Paso 1: Subir Comprobante de Transferencia Bancaria
- **Método y Ruta**: `POST /sales/payments/upload-receipt`
- **Cabeceras**: `Content-Type: multipart/form-data`
- **Form Data**:
  - `file`: `comprobante_bancolombia_100k.jpg`
- **Respuesta (`201 Created`)**:
  ```json
  {
    "message": "Comprobante subido exitosamente",
    "url": "/uploads/payments/payment-receipt-1791746192689-a1b2c3d4.jpg"
  }
  ```

### Paso 2: Asentar el Abono Financiero
- **Método y Ruta**: `POST /sales/payments`
- **Cuerpo (Payload)**:
  ```json
  {
    "saleId": "sale-uuid-7777",
    "amount": 150.00,
    "paymentMethod": "TRANSFER",
    "paymentDate": "2026-10-26",
    "referenceNumber": "TRF-BANCO-998811",
    "receiptUrl": "/uploads/payments/payment-receipt-1791746192689-a1b2c3d4.jpg",
    "notes": "Abono inicial del 50%"
  }
  ```
- **Resultado en la Venta**:
  - `amountPaid`: Se actualiza a **$150.00**.
  - `balanceDue`: Se reduce a **$135.60** ($285.60 - 150.00).
  - `paidStatus`: Pasa automáticamente a **`PARTIAL`**.

---

## 📌 Caso de Uso 4: Generación y Descarga de Factura en PDF

### Descripción
Descargar el comprobante formal con membrete y código de barras.

- **Método y Ruta**: `GET /sales/:id/pdf`
- **Cabeceras**: `Authorization: Bearer {{token}}`
- **Respuesta (`200 OK`)**: Archivo binario con encabezado:
  ```http
  Content-Type: application/pdf
  Content-Disposition: inline; filename="venta-VEN-2026-0001.pdf"
  ```

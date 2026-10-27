# Diagramas de Flujo — Módulo Sales

Diagramas de secuencia del ciclo comercial: desde la cotización hasta el cobro y generación de reportes.

---

## 1. Ciclo de Vida Comercial: Cotización ➔ Venta ➔ Cobro

```mermaid
sequenceDiagram
    actor Vendedor as Ejecutivo de Ventas
    actor Cliente as Cliente Final
    participant Controller as SalesController
    participant CommandBus as NestJS CommandBus
    participant Handler as SalesHandlers
    participant PaymentController as SalesPaymentsController
    participant DB as PostgreSQL

    %% 1. Emitir Cotización
    Vendedor->>Controller: POST /sales { saleType: "QUOTATION", customerName, items: [...] }
    Controller->>CommandBus: execute(CreateSaleCommand)
    CommandBus->>Handler: Guardar Cotización (COT-2026-0001)
    Handler->>DB: INSERT INTO sales ...
    DB-->>Controller: Cotización Creada (Total: $1,200.00)
    Controller-->>Vendedor: 201 Created (COT-2026-0001)

    %% 2. Aprobación y Conversión
    Cliente->>Vendedor: "Apruebo el presupuesto"
    Vendedor->>Controller: POST /sales/:id/convert
    Controller->>CommandBus: execute(ConvertQuotationCommand)
    CommandBus->>Handler: Cambiar saleType = "SALE", generar saleNumber = "VEN-2026-0001"
    Handler->>DB: UPDATE sales SET saleType = 'SALE', status = 'CONFIRMED' ...
    DB-->>Controller: Venta Confirmada
    Controller-->>Vendedor: 200 OK (Venta generada a crédito 30 días)

    %% 3. Abono Parcial
    Cliente->>Vendedor: Transferencia de $500.00 (Abono 1)
    Vendedor->>PaymentController: POST /sales/payments { saleId, amount: 500, paymentMethod: "TRANSFER", referenceNumber: "TRF-8812" }
    PaymentController->>DB: INSERT INTO sale_payments (amount: 500)
    PaymentController->>DB: UPDATE sales SET amountPaid = 500, balanceDue = 700, paidStatus = 'PARTIAL'
    DB-->>PaymentController: OK
    PaymentController-->>Vendedor: 201 Created (Abono asentado, Saldo: $700.00)

    %% 4. Pago Final
    Cliente->>Vendedor: Pago restante de $700.00 (Abono 2)
    Vendedor->>PaymentController: POST /sales/payments { saleId, amount: 700, paymentMethod: "TRANSFER" }
    PaymentController->>DB: UPDATE sales SET amountPaid = 1200, balanceDue = 0, paidStatus = 'PAID'
    DB-->>PaymentController: OK
    PaymentController-->>Vendedor: 201 Created (Venta Totalmente Pagada)
```

---

## 2. Flujo de Generación de Comprobante PDF (`GET /sales/:id/pdf`)

```mermaid
sequenceDiagram
    actor Client as Cliente / Vendedor
    participant Controller as SalesReportsController
    participant Service as SalesReportsService
    participant CompanyRepo as CompanyRepository
    participant SaleRepo as SaleRepository
    participant PdfMake as pdfmake Engine

    Client->>Controller: GET /sales/:id/pdf
    Controller->>Service: generateSalePdf(id)
    Service->>SaleRepo: findById(id) with items & payments
    SaleRepo-->>Service: Sale Data
    Service->>CompanyRepo: get()
    CompanyRepo-->>Service: Company (Logo, Moneda, Nombre Legal, NIT)
    
    Service->>PdfMake: Construir Document Definition (Header con logo, tabla de items, subtotales, pie fiscal)
    PdfMake-->>Service: Buffer de documento PDF compilado
    
    Service-->>Controller: Buffer binario application/pdf
    Controller-->>Client: 200 OK (Content-Type: application/pdf; inline/attachment)
```

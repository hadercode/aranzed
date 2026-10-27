# Diagrama de Base de Datos (ERD) — Módulo Company

A continuación se detalla la estructura relacional de la tabla `companies` gestionada por TypeORM en PostgreSQL.

```mermaid
erDiagram
    COMPANIES {
        uuid id PK "Identificador único (UUID v4)"
        varchar identificationNumber "Número de identificación fiscal (RUT, NIT, CIF, RIF)"
        varchar legalName "Razón social de la empresa"
        varchar tradeName "Nombre comercial visible"
        varchar slogan "Lema o eslogan corporativo"
        varchar phone "Teléfono principal de contacto"
        varchar secondaryPhone "Teléfono secundario"
        varchar email "Correo corporativo general"
        varchar website "Sitio web oficial"
        varchar address "Dirección fiscal principal"
        varchar addressLine2 "Detalle adicional de dirección (Piso/Oficina)"
        varchar city "Ciudad"
        varchar state "Estado / Departamento / Provincia"
        varchar zipCode "Código postal"
        varchar country "País"
        varchar currencyCode "Código ISO de moneda base (USD, EUR, COP, MXN)"
        varchar currencySymbol "Símbolo de moneda ($, €, S/.)"
        varchar currencyPosition "Posición del símbolo (left | right)"
        integer decimalPlaces "Número de decimales (0, 2)"
        varchar timezone "Zona horaria IANA (ej: America/Bogota)"
        varchar dateFormat "Formato de fecha (YYYY-MM-DD, DD/MM/YYYY)"
        varchar smtpHost "Servidor SMTP saliente"
        integer smtpPort "Puerto SMTP (587, 465, 25)"
        varchar smtpUser "Usuario / Cuenta SMTP"
        varchar smtpPassword "Contraseña SMTP (Enmascarada en API)"
        boolean smtpSecure "Uso de SSL/TLS"
        varchar smtpFromName "Nombre de remitente en notificaciones"
        varchar smtpFromEmail "Correo de remitente"
        varchar logoUrl "Ruta pública al logotipo claro"
        varchar logoDarkUrl "Ruta pública al logotipo oscuro"
        varchar faviconUrl "Ruta pública al icono favicon"
        varchar taxRegime "Régimen fiscal del contribuyente"
        text footerNotes "Pie de página en facturas y cotizaciones"
        timestamp createdAt "Fecha de registro"
        timestamp updatedAt "Fecha de última modificación"
    }
```

---

## 📌 Campos Críticos y Reglas de Integridad

- **Moneda Base (`currencyCode`, `currencySymbol`, `currencyPosition`, `decimalPlaces`)**: Gobierna el formateo financiero en todo el ERP (compras, ventas, cotizaciones, listas de precios y reportes contables).
- **Parámetros Regionales (`timezone`, `dateFormat`)**: Controlan el timestamping en auditorías y la emisión de documentos legales.
- **Configuración de Correo (`smtp*`)**: Utilizado por el subsistema de envíos de cotizaciones a clientes, reseteo de contraseñas y alertas de stock bajo.

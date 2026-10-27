# Casos de Uso Práctico — Módulo Company

A continuación se presentan los casos de uso más comunes para la administración y configuración de la empresa.

---

## 📌 Caso de Uso 1: Consulta Inicial de Configuración Empresarial

### Descripción
Al iniciar sesión el usuario o cargar la pantalla de bienvenida del frontend, la aplicación consulta los parámetros de moneda, nombre comercial y logotipo para personalizar la barra de navegación y las tablas de datos.

- **Método y Ruta**: `GET /company`
- **Cabeceras**:
  ```http
  Authorization: Bearer {{token}}
  ```
- **Respuesta Exitosa (`200 OK`)**:
  ```json
  {
    "id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    "identificationNumber": "J-12345678-0",
    "legalName": "Nexus Global S.A.S.",
    "tradeName": "Nexus ERP",
    "slogan": "Innovación y eficiencia empresarial",
    "phone": "+1 (555) 019-2834",
    "email": "contacto@nexus.com",
    "website": "https://nexus.com",
    "address": "Avenida Empresarial # 45-67, Torre Nexus, Piso 10",
    "currencyCode": "USD",
    "currencySymbol": "$",
    "currencyPosition": "left",
    "decimalPlaces": 2,
    "timezone": "America/Bogota",
    "dateFormat": "YYYY-MM-DD",
    "smtpHost": "smtp.nexus.com",
    "smtpPort": 587,
    "smtpUser": "no-reply@nexus.com",
    "smtpPassword": "",
    "smtpSecure": false,
    "logoUrl": "/uploads/company/company-logo-1791744351368-9da7fa69.jpg"
  }
  ```

---

## 📌 Caso de Uso 2: Actualización de Parámetros Fiscales y Moneda

### Descripción
La gerencia decide operar en Pesos Mexicanos (MXN) con formato de moneda derecha (`1,500.00 MXN`) y actualizar los datos fiscales para las facturas electrónicas.

- **Método y Ruta**: `PUT /company`
- **Cabeceras**:
  ```http
  Authorization: Bearer {{token}}
  Content-Type: application/json
  ```
- **Cuerpo (Payload)**:
  ```json
  {
    "identificationNumber": "RFC-ABC123456T1A",
    "legalName": "Nexus Soluciones México S.A. de C.V.",
    "tradeName": "Nexus Store MX",
    "currencyCode": "MXN",
    "currencySymbol": "MXN",
    "currencyPosition": "right",
    "decimalPlaces": 2,
    "taxRegime": "Régimen General de Ley Personas Morales",
    "footerNotes": "Comprobante fiscal digital por internet. Pago en una sola exhibición."
  }
  ```
- **Respuesta Esperada (`200 OK`)**:
  ```json
  {
    "id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    "legalName": "Nexus Soluciones México S.A. de C.V.",
    "currencyCode": "MXN",
    "currencyPosition": "right",
    "updatedAt": "2026-10-26T23:30:00.000Z"
  }
  ```

---

## 📌 Caso de Uso 3: Configuración Segura de Servidor SMTP

### Descripción
El departamento de TI configura las credenciales de correo electrónico para el envío automático de cotizaciones en PDF a los clientes.

- **Método y Ruta**: `PUT /company`
- **Cuerpo (Payload)**:
  ```json
  {
    "smtpHost": "smtp.sendgrid.net",
    "smtpPort": 587,
    "smtpUser": "apikey",
    "smtpPassword": "SG.claveSuperSecretaDeApiDeTercero",
    "smtpSecure": false,
    "smtpFromName": "Notificaciones Nexus",
    "smtpFromEmail": "facturacion@nexus.com"
  }
  ```
- **Respuesta de la API**:
  ```json
  {
    "smtpHost": "smtp.sendgrid.net",
    "smtpUser": "apikey",
    "smtpPassword": "********",
    "smtpFromEmail": "facturacion@nexus.com"
  }
  ```
  *(Nótese que la contraseña es enmascarada inmediatamente como `********` para protegerla de ojos curiosos).*

---

## 📌 Caso de Uso 4: Carga de Logotipo Corporativo

### Descripción
El usuario sube un archivo PNG con el nuevo imagotipo de la empresa.

- **Método y Ruta**: `POST /company/logo`
- **Cabeceras**: `Content-Type: multipart/form-data`
- **Form Data**:
  - `file`: Archivo binario `logo_principal.png` (Máx: 5MB).
- **Respuesta Esperada (`200 OK`)**:
  ```json
  {
    "message": "Logo actualizado con éxito",
    "logoUrl": "/uploads/company/company-logo-1791744351368-9da7fa69.png",
    "company": {
      "id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
      "logoUrl": "/uploads/company/company-logo-1791744351368-9da7fa69.png"
    }
  }
  ```

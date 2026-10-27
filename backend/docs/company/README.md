# Módulo de Configuración de Empresa (Company) — Documentación

Este directorio contiene la documentación técnica y funcional del módulo **Company** del backend de **Ministore ERP**. 

El módulo centraliza la identidad corporativa, datos de facturación legal, moneda base del sistema, zonas horarias, credenciales de correo saliente (SMTP) y elementos gráficos de la organización (logos y favicon).

---

## 🗂 Índice de Documentos

1. **[Diagrama de Base de Datos (ERD)](./erd-diagram.md):** Estructura de la tabla `companies` y sus atributos.
2. **[Diagrama de Flujo](./flow-diagram.md):** Ciclo de vida y secuencias de lectura, actualización y carga de multimedia.
3. **[Casos de Uso Práctico](./use-cases.md):** Escenarios reales paso a paso con payloads y respuestas HTTP.
4. **[Colección de Postman](./company.postman_collection.json):** Endpoints listos para importar y probar.

---

## 🏛️ Patrón de Diseño y Arquitectura

- **Singleton Aggregate Pattern**: Aunque la base de datos almacena una tabla relacional, el sistema opera bajo un modelo de empresa única (Tenant Maestro). Si no existe un registro inicial, el Query Handler `GetCompanyHandler` inicializa automáticamente una configuración por defecto.
- **Seguridad y Privacidad**:
  - **Enmascaramiento de Contraseñas**: La contraseña `smtpPassword` se almacena cifrada/protegida y la API siempre la devuelve como `'********'` en las respuestas públicas/JSON, impidiendo la exposición de credenciales del servidor de correos.
  - **Validación de Archivos**: La subida de logotipos valida estrictamente formatos rasterizados seguros (JPEG, PNG, GIF, WEBP) restringiendo archivos SVG para neutralizar vectores de ataque Stored XSS.
  - **Control de Acceso**: Operaciones de escritura (`PUT`, `POST`) protegidas por `@RequirePermissions('company:manage')`.

---

## 📡 Endpoints del Módulo

| Método | Endpoint | Permiso Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/company` | `JwtAuthGuard` | Obtiene los parámetros generales de la empresa (moneda, branding, dirección). |
| `PUT` | `/company` | `company:manage` | Actualiza la información fiscal, contacto, moneda y credenciales SMTP. |
| `POST` | `/company/logo` | `company:manage` | Sube y actualiza el logotipo corporativo (Multipart/Form-Data hasta 5MB). |

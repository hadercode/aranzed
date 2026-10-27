# Módulo de Auditoría y Trazabilidad (Audit) — Documentación

Este directorio contiene la documentación técnica y funcional del módulo de **Auditoría** de **Ministore ERP**.

El módulo provee observabilidad forense y cumplimiento normativo registrando cada mutación relevante del sistema: usuario autor, IP, duración de la petición HTTP, acción realizada y snapshots de estado previo, posterior y diferencial (`diff`).

---

## 🗂 Índice de Documentos

1. **[Diagrama de Base de Datos (ERD)](./erd-diagram.md):** Modelo de la tabla `audit_logs` optimizada con índices y columnas JSONB.
2. **[Diagrama de Flujo](./flow-diagram.md):** Intercepción HTTP, sanitización de datos confidenciales y generación de diferencias.
3. **[Casos de Uso Práctico](./use-cases.md):** Consultas forenses, inspección de cambios en precios y métricas de seguridad.
4. **[Colección de Postman](./audit.postman_collection.json):** Endpoints de consulta paginada, detalle de traza y métricas estadísticas.

---

## 🏛️ Conceptos y Reglas de Seguridad

### 1. Sanitización Automática de Datos Sensibles (`[PROTEGIDO]`)
- El servicio de auditoría inspecciona recursivamente los payloads antes de almacenarlos.
- Cualquier propiedad que coincida con claves confidenciales (`password`, `passwordHash`, `passwordRecoveryToken`, `smtpPassword`, `token`, `refreshToken`, `secret`, `authorization`, `jwt`) es enmascarada irrevocablemente como `[PROTEGIDO]`.
- Esto garantiza que contraseñas o tokens jamás queden almacenados en texto legible en los registros de auditoría.

### 2. Snapshots Diferenciales (`previousState` vs `newState`)
- Para operaciones de actualización (`UPDATE`), se almacena el estado completo anterior y el nuevo, y se genera un objeto `changes` que contiene exclusivamente los campos que cambiaron con su valor anterior y nuevo.

### 3. Métricas y KPIs de Auditoría (`/audit/stats/summary`)
- Consolida dinámicamente el volumen de operaciones por tipo de acción (`CREATE`, `UPDATE`, `DELETE`, `LOGIN`), modelos más modificados y distribución de códigos de estado HTTP.

---

## 📡 Endpoints del Módulo

| Método | Endpoint | Permiso Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/audit` | `audit:read` o `audit:manage` | Listado paginado de trazas con filtros por modelo, acción, usuario y fechas. |
| `GET` | `/audit/stats/summary` | `audit:read` o `audit:manage` | Métricas consolidadas de actividad, acciones más frecuentes y códigos HTTP. |
| `GET` | `/audit/:id` | `audit:read` o `audit:manage` | Detalle forense completo de una traza con su snapshot diferencial. |

# Diagrama de Base de Datos (ERD) — Módulo Audit

Estructura de persistencia en PostgreSQL con soporte para estructuras JSONB indexadas de trazas forenses.

```mermaid
erDiagram
    AUDIT_LOGS {
        uuid id PK "Identificador único de la traza"
        uuid userId FK "Usuario autor de la acción (Nullable)"
        varchar userEmail "Correo del usuario"
        varchar userName "Nombre completo del usuario"
        varchar action "Acción: CREATE | UPDATE | DELETE | LOGIN | VIEW"
        varchar model "Modelo afectado (Product, Sale, Company, User)"
        varchar entityId "ID del registro afectado"
        varchar description "Descripción legible del evento"
        jsonb previousState "Snapshot del estado antes de la mutación"
        jsonb newState "Snapshot del estado posterior a la mutación"
        jsonb changes "Diferencial puntual de campos modificados"
        varchar ipAddress "Dirección IP del cliente"
        text userAgent "Navegador y sistema operativo del cliente"
        varchar method "Método HTTP: GET | POST | PUT | DELETE | PATCH"
        varchar endpoint "Ruta ejecutada (ej: /sales/payments)"
        integer statusCode "Código de respuesta HTTP devuelto"
        integer durationMs "Tiempo de respuesta en milisegundos"
        timestamp createdAt "Timestamp exacto de la operación"
    }
```

---

## 📌 Índices y Optimización para Alto Volumen

- **Índice B-Tree en `action`**: Acelera consultas de filtrado por tipos de evento (`UPDATE`, `LOGIN`).
- **Índice B-Tree en `model`**: Permite auditar el historial completo de una entidad específica (ej: todas las modificaciones al modelo `Sale`).
- **Índice B-Tree en `userId`**: Facilita reportes de actividad por operador o cajero.
- **Índice en `createdAt`**: Optimiza ordenamiento descendente y ventanas de tiempo en dashboards.
- **Columnas JSONB (`previousState`, `newState`, `changes`)**: Almacenan estructuras semiestructuradas sin esquema rígido, permitiendo comparar cualquier agregado de la aplicación.

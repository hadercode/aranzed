# Diagramas de Flujo — Módulo Audit

Diagramas de secuencia del proceso de captura de eventos, sanitización y consulta forense.

---

## 1. Flujo de Captura y Sanitización de Trazas (Interceptor / Servicio)

```mermaid
sequenceDiagram
    actor Client as Usuario / Cliente
    participant NestController as Cualquier Controlador (ej: ProductController)
    participant Interceptor as AuditInterceptor / Service
    participant SanitizeHelper as Sanitizer de Secretos
    participant AuditRepo as AuditRepository
    participant DB as PostgreSQL (audit_logs)

    Client->>NestController: PUT /catalog/products/:id { salePrice: 15.00, password: "..." }
    NestController->>Interceptor: Iniciar cronómetro de duración (t0)
    
    NestController->>NestController: Ejecutar Use Case y actualizar en BD
    NestController-->>Interceptor: Respuesta lista (200 OK) + previousState & newState
    
    Interceptor->>SanitizeHelper: sanitizeData(payload & snapshots)
    note over SanitizeHelper: Reemplazar password, tokens y secretos por '[PROTEGIDO]'
    SanitizeHelper-->>Interceptor: Snapshots Sanitizados
    
    Interceptor->>Interceptor: computeDiff(previousState, newState) -> changes
    
    Interceptor->>AuditRepo: create({ action: 'UPDATE', model: 'Product', durationMs, changes, ... })
    AuditRepo->>DB: INSERT INTO audit_logs (...)
    DB-->>AuditRepo: OK
    
    NestController-->>Client: 200 OK (Respuesta HTTP)
```

---

## 2. Flujo de Consulta Forense y Verificación de Permisos (`GET /audit/:id`)

```mermaid
sequenceDiagram
    actor Auditor as Auditor / Administrador
    participant Controller as AuditController
    participant Guard as JwtAuthGuard & RBAC Check
    participant Service as AuditService
    participant DB as PostgreSQL

    Auditor->>Controller: GET /audit/:id (Bearer Token)
    Controller->>Guard: checkPermission(req.user)
    
    alt Usuario Sin Permiso
        Guard-->>Controller: ForbiddenException
        Controller-->>Auditor: 403 Forbidden ("No tienes permisos suficientes para ver las auditorías")
    else Usuario Autorizado (audit:read | ADMIN_ROLE)
        Guard-->>Controller: OK
        Controller->>Service: findById(id)
        Service->>DB: SELECT * FROM audit_logs WHERE id = :id
        DB-->>Service: Registro con Snapshots y Changes
        Service-->>Controller: AuditLog
        Controller-->>Auditor: 200 OK (Detalle forense completo)
    end
```

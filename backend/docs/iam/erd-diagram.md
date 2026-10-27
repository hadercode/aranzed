# Diagrama de Base de Datos (ERD) - Módulo IAM

A continuación se muestra el modelo relacional del módulo IAM (Identity and Access Management), que soporta autenticación JWT asimétrica (RS256), perfiles de usuario enriquecidos y control de acceso basado en roles (RBAC) con permisos granulares.

```mermaid
erDiagram
    USERS {
        uuid id PK "Identificador único"
        varchar email UK "Correo electrónico único"
        varchar passwordHash "Hash Bcrypt de la contraseña"
        varchar passwordRecoveryToken "Token de recuperación (Nullable)"
        varchar firstName "Nombre (Nullable)"
        varchar lastName "Apellido (Nullable)"
        varchar phone "Teléfono de contacto (Nullable)"
        varchar avatarUrl "Ruta del avatar subido (Nullable)"
        varchar jobTitle "Cargo / Puesto laboral (Nullable)"
        text bio "Biografía personal (Nullable)"
        timestamp createdAt "Fecha de creación"
        timestamp updatedAt "Fecha de última modificación"
    }

    ROLES {
        uuid id PK "Identificador único"
        varchar name UK "Nombre del rol (ej: ADMIN, SELLER)"
        varchar description "Descripción de responsabilidades"
        timestamp createdAt "Fecha de creación"
        timestamp updatedAt "Fecha de actualización"
    }

    PERMISSIONS {
        uuid id PK "Identificador único"
        varchar resource "Recurso protegido (ej: users, sales)"
        varchar action "Acción permitida (ej: read, manage)"
        timestamp createdAt "Fecha de creación"
        timestamp updatedAt "Fecha de actualización"
    }

    USER_ROLES {
        uuid userId FK "Referencia a USERS"
        uuid roleId FK "Referencia a ROLES"
    }

    ROLE_PERMISSIONS {
        uuid roleId FK "Referencia a ROLES"
        uuid permissionId FK "Referencia a PERMISSIONS"
    }

    USER_PERMISSIONS {
        uuid userId FK "Referencia a USERS"
        uuid permissionId FK "Referencia a PERMISSIONS"
    }

    USERS ||--o{ USER_ROLES : "posee"
    ROLES ||--o{ USER_ROLES : "asignado a"

    ROLES ||--o{ ROLE_PERMISSIONS : "contiene"
    PERMISSIONS ||--o{ ROLE_PERMISSIONS : "agrupado en"

    USERS ||--o{ USER_PERMISSIONS : "permiso directo"
    PERMISSIONS ||--o{ USER_PERMISSIONS : "asignado directo a"
```

---

## 🔑 Diccionario Relacional y Cardinalidad

1. **`users` ↔ `roles` (Muchos a Muchos - N:M)**:
   - Tabla pivote: `user_roles`.
   - Permite que un usuario tenga múltiples roles funcionales simultáneos (ej: Operador y Auditor).
2. **`roles` ↔ `permissions` (Muchos a Muchos - N:M)**:
   - Tabla pivote: `role_permissions`.
   - Agrupa permisos estructurados bajo la convención `<resource>:<action>` (ej: `sales:manage`, `purchases:read`).
3. **`users` ↔ `permissions` (Muchos a Muchos - N:M)**:
   - Tabla pivote: `user_permissions`.
   - Permite excepciones o privilegios temporales asignados directamente al usuario sin necesidad de crear un nuevo rol.

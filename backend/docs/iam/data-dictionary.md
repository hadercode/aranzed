# Diccionario de Datos - IAM

A continuación se detalla la estructura física de las tablas correspondientes al módulo IAM en la base de datos PostgreSQL.

## Tabla: `users`
Almacena la información principal de los usuarios registrados.

| Columna | Tipo de Dato | Llave | Modificadores | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | PK | Not Null | Identificador único del usuario. |
| `email` | `varchar` | UK | Not Null | Correo electrónico del usuario (Único). |
| `passwordHash` | `varchar` | - | Not Null | Contraseña encriptada utilizando Bcrypt (Factor 10). |
| `passwordRecoveryToken` | `varchar` | - | Nullable | Token temporal generado para la recuperación de contraseña. |
| `createdAt` | `timestamp` | - | Default (now()) | Fecha y hora de creación del registro. |
| `updatedAt` | `timestamp` | - | Default (now()) | Fecha y hora de la última modificación del registro. |

---

## Tabla: `roles`
Almacena los roles disponibles dentro del sistema.

| Columna | Tipo de Dato | Llave | Modificadores | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | PK | Not Null | Identificador único del rol. |
| `name` | `varchar` | - | Not Null | Nombre descriptivo del rol (ej. 'ADMIN', 'USER'). |
| `description` | `varchar` | - | Not Null | Descripción larga sobre las funciones del rol. |
| `createdAt` | `timestamp` | - | Default (now()) | Fecha y hora de creación. |
| `updatedAt` | `timestamp` | - | Default (now()) | Fecha y hora de última modificación. |

---

## Tabla: `permissions`
Almacena los permisos atómicos que pueden ser aplicados a roles o usuarios.

| Columna | Tipo de Dato | Llave | Modificadores | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | PK | Not Null | Identificador único del permiso. |
| `action` | `varchar` | - | Not Null | Acción permitida (ej. `read`, `write`, `delete`). |
| `resource` | `varchar` | - | Not Null | Recurso al cual aplica la acción (ej. `users`, `invoices`). |
| `createdAt` | `timestamp` | - | Default (now()) | Fecha y hora de creación. |
| `updatedAt` | `timestamp` | - | Default (now()) | Fecha y hora de última modificación. |

> **Nota:** La combinación canónica de un permiso se evalúa como `resource:action` (Ejemplo: `users:read`).

---

## Tabla de Unión: `user_roles`
Mapea la relación de Muchos a Muchos entre `users` y `roles`.

| Columna | Tipo de Dato | Llave | Modificadores | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `userId` | `uuid` | PK/FK | Not Null | Referencia a `users.id`. |
| `roleId` | `uuid` | PK/FK | Not Null | Referencia a `roles.id`. |

---

## Tabla de Unión: `role_permissions`
Mapea la relación de Muchos a Muchos entre `roles` y `permissions`. Todos los usuarios que posean este rol heredarán automáticamente estos permisos.

| Columna | Tipo de Dato | Llave | Modificadores | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `roleId` | `uuid` | PK/FK | Not Null | Referencia a `roles.id`. |
| `permissionId` | `uuid` | PK/FK | Not Null | Referencia a `permissions.id`. |

---

## Tabla de Unión: `user_permissions`
Mapea la relación de Muchos a Muchos directa entre `users` y `permissions`. Permite escalar o remover permisos específicos a usuarios individuales sin afectar los roles generales.

| Columna | Tipo de Dato | Llave | Modificadores | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `userId` | `uuid` | PK/FK | Not Null | Referencia a `users.id`. |
| `permissionId` | `uuid` | PK/FK | Not Null | Referencia a `permissions.id`. |

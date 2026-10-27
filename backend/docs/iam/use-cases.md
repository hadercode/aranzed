# Casos de Uso Práctico — Módulo IAM

Este documento detalla los escenarios reales y flujos de negocio del módulo de Identidad y Control de Acceso (IAM).

---

## 📌 Caso de Uso 1: Registro e Inicio de Sesión de Usuario

### Descripción
Un nuevo empleado se registra en la plataforma y procede a autenticarse para recibir su token de sesión.

### Paso 1: Registro de Cuenta
- **Método y Ruta**: `POST /auth/register`
- **Cabeceras**: `Content-Type: application/json`
- **Cuerpo (Payload)**:
  ```json
  {
    "email": "carlos.mendoza@empresa.com",
    "password": "PasswordSeguro2026!"
  }
  ```
- **Respuesta Esperada (`201 Created`)**:
  ```json
  {
    "message": "User registered successfully"
  }
  ```
- **Efecto de Dominio**: Se emite el evento asíncrono `UserRegisteredEvent`.

### Paso 2: Autenticación (Login)
- **Método y Ruta**: `POST /auth/login`
- **Cuerpo (Payload)**:
  ```json
  {
    "email": "carlos.mendoza@empresa.com",
    "password": "PasswordSeguro2026!"
  }
  ```
- **Respuesta Esperada (`200 OK`)**:
  ```json
  {
    "accessToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Claims del Token**:
  - `sub`: ID del usuario en UUID.
  - `email`: Correo verificado.
  - `permissions`: Lista calculada de permisos agregados (`roles` + directos).

---

## 📌 Caso de Uso 2: Asignación de Rol y Permisos Granulares

### Descripción
El Administrador asigna el rol `VENTAS_ROLE` al usuario creado y le concede un permiso directo adicional para consultar auditorías (`audit:read`).

### Paso 1: Asignar Rol al Usuario
- **Método y Ruta**: `PUT /users/:id`
- **Cabeceras**: `Authorization: Bearer <ADMIN_TOKEN>`
- **Cuerpo**:
  ```json
  {
    "roles": ["VENTAS_ROLE"]
  }
  ```
- **Respuesta Esperada (`200 OK`)**: Estado actualizado del usuario.

### Paso 2: Validación en Endpoint Protegido
Cuando el usuario intenta acceder a `POST /sales`:
1. `JwtAuthGuard` valida la firma del token mediante la clave pública RSA.
2. `PermissionsGuard` verifica que el usuario cuente con `sales:manage`. Si el rol `VENTAS_ROLE` lo incluye, la petición continúa con `200 OK`. De lo contrario, se rechaza con `403 Forbidden`.

---

## 📌 Caso de Uso 3: Actualización de Perfil y Cambio de Contraseña

### Descripción
El usuario autenticado personaliza su información de perfil y actualiza su contraseña de acceso.

### Paso 1: Actualizar Información Personal
- **Método y Ruta**: `PUT /profile`
- **Cabeceras**: `Authorization: Bearer <TOKEN>`
- **Cuerpo**:
  ```json
  {
    "firstName": "Carlos",
    "lastName": "Mendoza",
    "phone": "+57 300 1234567",
    "jobTitle": "Ejecutivo de Cuentas Senior",
    "bio": "Especialista en gestión comercial y cuentas corporativas."
  }
  ```
- **Respuesta (`200 OK`)**:
  ```json
  {
    "message": "Perfil actualizado con éxito",
    "user": { ... }
  }
  ```

### Paso 2: Cambio de Contraseña
- **Método y Ruta**: `PUT /profile/password`
- **Cuerpo**:
  ```json
  {
    "currentPassword": "PasswordSeguro2026!",
    "newPassword": "NuevaPasswordUltraSegura2026!"
  }
  ```
- **Regla de Negocio**: Se valida mediante Bcrypt que `currentPassword` coincida con el hash almacenado antes de aplicar el nuevo hash.

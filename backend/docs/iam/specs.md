# Especificaciones del Módulo IAM (Identity and Access Management)

Este documento describe los requerimientos funcionales y reglas de negocio del módulo IAM implementadas en el proyecto semilla.

## 1. Gestión de Usuarios
- **Registro de Usuarios:** Los nuevos usuarios pueden registrarse proporcionando un `email` válido y un `password` de al menos 6 caracteres. No puede haber dos usuarios con el mismo correo electrónico.
- **Autenticación (Login):** Los usuarios pueden iniciar sesión con credenciales válidas y recibir un JWT firmado mediante un algoritmo RSA (RS256) con clave privada/pública, lo que incrementa la seguridad sobre la encriptación simétrica.
- **Event-Driven (Registro):** Al registrarse un usuario, se emite un Evento de Dominio (`UserRegisteredEvent`) que puede ser escuchado de manera asíncrona por otros módulos (por ejemplo, para enviar correos de bienvenida o rastrear analíticas).

## 2. Control de Acceso Basado en Roles (RBAC) Mixto
El sistema implementa un RBAC avanzado y granular compuesto por tres entidades principales: **User**, **Role** y **Permission**.

### Reglas de Dominio:
- **Roles:** Agrupan un set de Permisos lógicos (Ej. Administrador, Editor, Lector).
- **Herencia de Permisos:** Al asignarse un Rol a un Usuario, el usuario obtiene automáticamente todos los permisos asociados a ese Rol.
- **Permisos Directos (Granularidad):** Los Permisos pueden ser asignados de manera *directa* a un Usuario sin necesidad de crear un nuevo Rol, esto es útil para excepciones de seguridad temporales o usuarios especiales.
- **Evaluación Final:** Para determinar si un usuario está autorizado, la lógica de dominio consolida los permisos de todos sus Roles + sus Permisos Directos en la función `getAllPermissions()`.
- **Estructura de Permiso:** Sigue el estándar de pares `<resource>:<action>` (ej. `users:read`, `users:write`).

### Autorización (Guards):
- Los endpoints protegidos deben estar marcados con el Decorador `@RequirePermissions('recurso:accion')`.
- El guard `PermissionsGuard` evalúa si el usuario autenticado tiene dentro del JWT el claim correspondiente para acceder al endpoint.

## 3. Recuperación de Contraseñas
- **Solicitud Segura:** Si un usuario olvida su contraseña, puede enviar una solicitud a `/auth/recover-password`. 
- **Prevención de Enumeración:** Si el correo no existe, el API retorna un `200 OK` de todas formas, para evitar que atacantes adivinen qué correos están registrados.
- **Token de Único Uso:** Se genera y almacena un `passwordRecoveryToken` en el usuario y se envía mediante un puerto `IEmailService`.
- **Restablecimiento:** Mediante el token recibido en un enlace seguro, el usuario envía su nueva contraseña al endpoint de reseteo (`/auth/reset-password`). Una vez validada, el token se destruye para prevenir un segundo uso.

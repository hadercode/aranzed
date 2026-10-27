# Diagramas de Flujo (Secuencia)

A continuación se exponen los flujos principales del módulo IAM utilizando diagramas de secuencia para entender la interacción entre los puertos, los casos de uso (Commands) y la infraestructura.

## 1. Flujo de Login (Autenticación)

```mermaid
sequenceDiagram
    actor Client
    participant AuthController
    participant CommandBus
    participant LoginHandler
    participant UserRepository
    participant HashingService
    participant JwtService

    Client->>AuthController: POST /auth/login { email, password }
    AuthController->>CommandBus: execute(LoginCommand)
    CommandBus->>LoginHandler: handle(LoginCommand)
    
    LoginHandler->>UserRepository: findByEmail(email)
    UserRepository-->>LoginHandler: User Domain Entity
    
    LoginHandler->>HashingService: compare(password, hash)
    HashingService-->>LoginHandler: boolean (true)
    
    LoginHandler->>LoginHandler: user.getAllPermissions()
    LoginHandler->>JwtService: sign({ sub: id, email, permissions })
    JwtService-->>LoginHandler: JWT Token (Signed with RSA Private Key)
    
    LoginHandler-->>CommandBus: { accessToken }
    CommandBus-->>AuthController: { accessToken }
    AuthController-->>Client: 200 OK { accessToken }
```

## 2. Flujo de Recuperación de Contraseña

```mermaid
sequenceDiagram
    actor User
    participant AuthController
    participant CommandBus
    participant RecoverPasswordHandler
    participant UserRepository
    participant EmailService

    User->>AuthController: POST /auth/recover-password { email }
    AuthController->>CommandBus: execute(RecoverPasswordCommand)
    CommandBus->>RecoverPasswordHandler: handle(RecoverPasswordCommand)
    
    RecoverPasswordHandler->>UserRepository: findByEmail(email)
    UserRepository-->>RecoverPasswordHandler: User Domain Entity
    
    RecoverPasswordHandler->>RecoverPasswordHandler: Generate random token
    RecoverPasswordHandler->>UserRepository: save(user + token)
    
    RecoverPasswordHandler->>EmailService: sendPasswordRecoveryEmail(email, token)
    EmailService-->>RecoverPasswordHandler: Promise<void> (External API call)
    
    RecoverPasswordHandler-->>AuthController: void
    AuthController-->>User: 200 OK (Revisa tu correo)
```

## 3. Flujo de Autorización en Endpoints Protegidos (RBAC)

```mermaid
sequenceDiagram
    actor Client
    participant UserController (Endpoint)
    participant JwtAuthGuard
    participant PermissionsGuard
    participant Reflector

    Client->>UserController: GET /users/secure-data (Header: Bearer Token)
    
    %% Fase 1: Autenticación
    UserController->>JwtAuthGuard: canActivate()
    JwtAuthGuard->>JwtAuthGuard: Validate Token (RSA Public Key)
    JwtAuthGuard-->>UserController: Payload Inyectado en Request.user
    
    %% Fase 2: Autorización
    UserController->>PermissionsGuard: canActivate()
    PermissionsGuard->>Reflector: getAllAndOverride(PERMISSIONS_KEY)
    Reflector-->>PermissionsGuard: ['users:read'] (Permisos requeridos)
    
    PermissionsGuard->>PermissionsGuard: Check if Request.user.permissions includes 'users:read'
    
    alt User Has Permission
        PermissionsGuard-->>UserController: true
        UserController-->>Client: 200 OK (Datos sensibles)
    else User Lacks Permission
        PermissionsGuard-->>UserController: false
        UserController-->>Client: 403 Forbidden
    end
```

# Diagramas de Flujo — Módulo Company

A continuación se exponen las secuencias de interacción CQRS y de infraestructura del módulo de configuración empresarial.

---

## 1. Flujo de Consulta de Empresa (`GET /company`)

```mermaid
sequenceDiagram
    actor Client as Frontend / API Client
    participant Controller as CompanyController
    participant QueryBus as NestJS QueryBus
    participant Handler as GetCompanyHandler
    participant Repository as CompanyRepository
    participant DB as PostgreSQL (companies)

    Client->>Controller: GET /company (Bearer Token)
    Controller->>QueryBus: execute(GetCompanyQuery)
    QueryBus->>Handler: handle(GetCompanyQuery)
    Handler->>Repository: get()
    Repository->>DB: SELECT * FROM companies LIMIT 1
    
    alt Registro Existe
        DB-->>Repository: CompanyOrmEntity
        Repository-->>Handler: Company Domain Entity
    else Tabla Vacía (Primer Inicio)
        Handler->>Handler: Instanciar Company con valores por defecto
        Handler->>Repository: save(defaultCompany)
        Repository->>DB: INSERT INTO companies (...)
        DB-->>Repository: Guardado
        Repository-->>Handler: Company Domain Entity
    end

    Handler-->>QueryBus: Company
    QueryBus-->>Controller: Company
    Controller->>Controller: sanitizeCompany(company) [Mascara: smtpPassword = '********']
    Controller-->>Client: 200 OK (JSON sanitizado)
```

---

## 2. Flujo de Actualización de Configuración (`PUT /company`)

```mermaid
sequenceDiagram
    actor Admin as Administrador
    participant Controller as CompanyController
    participant Guard as PermissionsGuard
    participant CommandBus as NestJS CommandBus
    participant Handler as UpdateCompanyHandler
    participant Repository as CompanyRepository
    participant DB as PostgreSQL

    Admin->>Controller: PUT /company { identificationNumber, currencyCode, ... }
    Controller->>Guard: canActivate() -> Require 'company:manage'
    Guard-->>Controller: Autorizado
    Controller->>CommandBus: execute(UpdateCompanyCommand)
    CommandBus->>Handler: handle(UpdateCompanyCommand)
    
    Handler->>Repository: get()
    Repository-->>Handler: Company actual
    
    Handler->>Handler: Mutar propiedades recibidas
    note over Handler: Si smtpPassword == '********' o vacía, NO se sobrescribe la contraseña existente.
    
    Handler->>Repository: save(company)
    Repository->>DB: UPDATE companies SET ... WHERE id = ...
    DB-->>Repository: OK
    Repository-->>Handler: Company actualizado
    Handler-->>CommandBus: Company
    CommandBus-->>Controller: Company
    Controller->>Controller: sanitizeCompany(company)
    Controller-->>Admin: 200 OK { id, legalName, currencyCode, ... }
```

---

## 3. Flujo de Subida de Logotipo (`POST /company/logo`)

```mermaid
sequenceDiagram
    actor Admin as Administrador
    participant Controller as CompanyController
    participant Multer as FileInterceptor (Multer diskStorage)
    participant Disk as File System (/uploads/company)
    participant CommandBus as NestJS CommandBus
    participant Handler as UpdateCompanyHandler
    participant DB as PostgreSQL

    Admin->>Controller: POST /company/logo (Multipart file: image.png)
    Controller->>Multer: Validar Mimetype (JPG, PNG, GIF, WEBP) y límite (5MB)
    
    alt Formato Inválido (ej: SVG o EXE)
        Multer-->>Controller: BadRequestException
        Controller-->>Admin: 400 Bad Request
    else Formato Válido
        Multer->>Disk: Guardar archivo: company-logo-[timestamp]-[uuid].png
        Multer-->>Controller: file.filename
        Controller->>CommandBus: execute(UpdateCompanyCommand with logoUrl: /uploads/company/...)
        CommandBus->>Handler: Actualizar logoUrl
        Handler->>DB: UPDATE companies SET "logoUrl" = ...
        DB-->>Handler: OK
        Handler-->>Controller: Company actualizado
        Controller-->>Admin: 200 OK { message: "Logo actualizado con éxito", logoUrl: "..." }
    end
```

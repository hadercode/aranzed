# Diagramas de Flujo — Módulo de Almacenamiento (Storage)

Este documento detalla la interacción entre el cliente (Frontend/Consumidor API), el controlador NestJS, los casos de uso CQRS, el servicio adaptador S3 y el bucket en la nube de Neon.

---

## 1. Flujo de Subida Multipart hacia Neon S3 (`POST /storage/upload`)

En este flujo el archivo se recibe en la memoria RAM del servidor sin tocar disco local (`memoryStorage()`) y se transfiere de inmediato a Neon S3 mediante un comando `PutObjectCommand`. Seguidamente, se genera una URL temporal firmada para retornar una respuesta completa.

```mermaid
sequenceDiagram
    autonumber
    actor Cliente as Frontend / Usuario
    participant Guard as JwtAuth & PermissionsGuard
    participant Ctrl as StorageController
    participant UseCase as UploadFileUseCase
    participant S3Service as S3StorageService
    participant NeonS3 as Bucket Neon S3 (AWS SDK v3)

    Cliente->>Guard: POST /storage/upload (multipart/form-data: file, folder)
    Note over Cliente,Guard: Header: Authorization Bearer JWT
    Guard->>Guard: Valida JWT y permiso storage:upload
    Guard->>Ctrl: Petición autorizada

    Ctrl->>Ctrl: Multer procesa archivo en Buffer de memoria
    Ctrl->>UseCase: execute(UploadFileCommand)
    UseCase->>UseCase: Valida tamaño y contenido del archivo
    UseCase->>S3Service: uploadFile({ buffer, originalName, folder, ... })

    S3Service->>S3Service: Sanitiza carpeta (ej: "products")
    S3Service->>S3Service: Genera Key única: "folder/timestamp-uuid-name.ext"
    
    S3Service->>NeonS3: PutObjectCommand({ Bucket, Key, Body: buffer, ContentType })
    NeonS3-->>S3Service: Objeto almacenado exitosamente (HTTP 200)

    S3Service->>NeonS3: getSignedUrl(GetObjectCommand) [expira en 3600s]
    NeonS3-->>S3Service: Retorna URL firmada temporal

    S3Service-->>UseCase: Retorna entidad StoredFile
    UseCase-->>Ctrl: StoredFile
    Ctrl->>Ctrl: StorageResponseMapper.toUploadDto()
    Ctrl-->>Cliente: HTTP 201 Created (Key, Bucket, Folder, Presigned URL)
```

---

## 2. Flujo de Consulta de URL Firmada (`GET /storage/url`)

Cuando el cliente necesita mostrar o descargar un archivo privado previamente subido (por ejemplo, al renderizar una ficha de producto o una factura), solicita una URL firmada de duración limitada.

```mermaid
sequenceDiagram
    autonumber
    actor Cliente as Frontend / App Móvil
    participant Ctrl as StorageController
    participant UseCase as GetFileUrlUseCase
    participant S3Service as S3StorageService
    participant NeonS3 as Bucket Neon S3 (S3 Presigner)

    Cliente->>Ctrl: GET /storage/url?key=products/...&expiresIn=3600
    Note over Cliente,Ctrl: Header: Authorization Bearer JWT
    Ctrl->>UseCase: execute(GetFileUrlQuery)
    UseCase->>S3Service: getSignedUrl(key, expiresIn)

    S3Service->>NeonS3: getSignedUrl(GetObjectCommand({ Bucket, Key }))
    NeonS3-->>S3Service: Genera URL con firma HMAC-SHA256
    
    S3Service-->>UseCase: Retorna URL firmada
    UseCase-->>Ctrl: FileUrlResult
    Ctrl-->>Cliente: HTTP 200 OK { key, url, expiresIn }

    Note over Cliente,NeonS3: Acceso directo seguro sin consumir ancho de banda del backend:
    Cliente->>NeonS3: GET {url firmada}
    NeonS3-->>Cliente: 200 OK con el contenido binario del archivo
```

---

## 3. Flujo de Redirección Directa para Previsualización (`GET /storage/view`)

Este flujo optimiza la integración con elementos HTML como `<img src="/api/storage/view?key=..." />`. El backend resuelve la URL firmada en milisegundos y responde con una redirección HTTP 302 hacia Neon S3.

```mermaid
sequenceDiagram
    autonumber
    actor Navegador as Navegador Web (<img src="...">)
    participant Ctrl as StorageController (GET /storage/view)
    participant S3Service as S3StorageService
    participant NeonS3 as Bucket Neon S3

    Navegador->>Ctrl: GET /storage/view?key=company/logo.png
    Ctrl->>S3Service: getSignedUrl("company/logo.png", 3600)
    S3Service-->>Ctrl: URL firmada de S3
    Ctrl-->>Navegador: HTTP 302 Found (Location: https://...storage.neon.tech/...)
    Navegador->>NeonS3: GET /uploads/company/logo.png?X-Amz-...
    NeonS3-->>Navegador: Renderiza la imagen binaria en pantalla
```

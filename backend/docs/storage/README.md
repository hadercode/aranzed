# Módulo de Almacenamiento en la Nube (Storage) — Documentación

Este directorio contiene la documentación técnica, arquitectónica y funcional del módulo de **Storage** de **Ministore ERP**.

El módulo proporciona un servicio desacoplado y seguro para la subida, gestión y visualización de archivos binarios (imágenes, PDFs, comprobantes, hojas de cálculo) en almacenamiento en la nube compatible con S3 (Bucket en **Neon**), sin almacenar archivos en el sistema de archivos local del servidor.

---

## 🗂 Índice de Documentos

1. **[Diagrama de Flujo (Flow Diagrams)](./flow-diagram.md):** Diagramas secuenciales Mermaid del flujo de subida multipart a S3 y consulta segura con URLs firmadas temporales.
2. **[Casos de Uso Prácticos](./use-cases.md):** Ejemplos de uso reales organizados por carpetas (`products`, `company`, `invoices`, `avatars`).
3. **[Colección de Postman](./storage.postman_collection.json):** Colección con todos los endpoints listos para pruebas con autenticación Bearer Token y variables de entorno.

---

## 🏛️ Arquitectura y Principios de Diseño

El módulo sigue estrictamente la arquitectura hexagonal y Clean Architecture del proyecto:

```text
backend/src/storage/
├── domain/                         # Reglas de negocio puras
│   ├── entities/
│   │   └── stored-file.entity.ts   # Entidad de dominio StoredFile
│   └── services/
│       └── storage.service.interface.ts # Puerto IStorageService y Token de DI
├── infrastructure/                 # Adaptadores técnicos externos
│   └── s3/
│       └── s3-storage.service.ts   # Adaptador AWS SDK v3 con soporte Neon S3
├── application/                    # Casos de uso de aplicación (CQRS)
│   ├── commands/
│   │   ├── upload-file/            # Caso de uso: Subida a bucket por carpetas
│   │   └── delete-file/            # Caso de uso: Eliminación de objetos
│   └── queries/
│       └── get-file-url/           # Caso de uso: Generación de Presigned URLs
├── presentation/                   # Capa HTTP / REST
│   └── http/
│       ├── controllers/
│       │   └── storage.controller.ts # Controlador Swagger & Guards
│       ├── dto/                    # Request y Response DTOs
│       └── mappers/                # Mapper puro Domain -> Response DTO
└── storage.module.ts               # Registro e inyección de dependencias NestJS
```

### Características Técnicas Clave:
1. **Zero Disk Storage**: Los archivos se reciben en memoria mediante `memoryStorage()` de Multer y se transfieren por streaming al bucket de Neon con `PutObjectCommand`, manteniendo los contenedores y servidores 100% efímeros y stateless.
2. **Organización por Carpetas Dinámicas (`folder` / `type`)**: El cliente define la carpeta de destino (`products`, `company`, `invoices`, `avatars`). El servicio normaliza y sanitiza la ruta para prevenir ataques de **Path Traversal**.
3. **Nombres de Archivo Únicos y Seguros**: Cada archivo recibe un prefijo de timestamp más UUID corto aleatorio preservando su extensión original para garantizar colisiones nulas:
   $$\text{Key} = \text{folder} + \text{"/"} + \text{timestamp} + \text{"-"} + \text{uuidShort} + \text{"-"} + \text{slug(originalName)} + \text{ext}$$
4. **Acceso Seguro mediante URLs Firmadas (S3 Presigner)**: Los archivos del bucket permanecen privados. Se utiliza `@aws-sdk/s3-request-presigner` con `GetObjectCommand` para generar URLs con tiempo de expiración configurable (por defecto 3600 segundos = 1 hora).
5. **Redirección Transparente (`GET /storage/view`)**: Permite que etiquetas HTML como `<img src="/api/storage/view?key=..." />` o enlaces directos carguen el contenido de forma segura con un `HTTP 302 Found` directo al storage.

---

## ⚙️ Configuración de Variables de Entorno

En el archivo `.env` del backend se configuran las credenciales del bucket S3 en Neon:

```env
# Configuración S3 Storage en Neon
AWS_ENDPOINT_URL_S3="https://<tu-id>.storage.c-6.us-east-2.aws.neon.tech"
AWS_ACCESS_KEY_ID="nak_live_xxxxxxxxxxxxxxxxxxxxxxxx"
AWS_SECRET_ACCESS_KEY="nsk_live_xxxxxxxxxxxxxxxxxxxxxxxx"
AWS_REGION="us-east-2"
AWS_S3_BUCKET="uploads"
```

---

## 📡 Endpoints del Módulo

Todos los endpoints requieren autenticación mediante JWT (`Bearer {{token}}`) y validación de permisos en el rol del usuario.

| Método | Endpoint | Permiso Requerido | Content-Type | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/storage/upload` | `storage:upload` | `multipart/form-data` | Sube un archivo binario y lo almacena en la carpeta indicada del bucket. |
| `GET` | `/storage/url` | `storage:read` | `application/json` | Obtiene una URL firmada temporal de acceso seguro para una clave (Key). |
| `GET` | `/storage/view` | `storage:read` | `application/json` | Redirige (HTTP 302) a la URL firmada del archivo para previsualización inmediata. |
| `DELETE` | `/storage` | `storage:manage` | `application/json` | Elimina permanentemente el archivo del bucket S3. |

---

## 📝 Ejemplos de Petición y Respuesta

### 1. Subir Archivo (`POST /storage/upload`)

**Petición multipart:**
- `file`: `<archivo_binario>` (ej: `zapato-deportivo.png`)
- `folder`: `products`

**Respuesta exitosa (`201 Created`):**
```json
{
  "id": "7f8c12a4-56b3-4f91-88bc-4672e39c0112",
  "key": "products/1729900000000-abcd1234-zapato-deportivo.png",
  "bucket": "uploads",
  "folder": "products",
  "originalName": "zapato-deportivo.png",
  "fileName": "1729900000000-abcd1234-zapato-deportivo.png",
  "mimeType": "image/png",
  "size": 45120,
  "url": "https://br-restless-thunder-b42qdkhg.storage.c-6.us-east-2.aws.neon.tech/uploads/products/1729900000000-abcd1234-zapato-deportivo.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=...&X-Amz-Expires=3600&...",
  "createdAt": "2026-10-27T19:45:00.000Z"
}
```

### 2. Obtener URL Firmada (`GET /storage/url?key=...&expiresIn=3600`)

**Petición:**
```http
GET /storage/url?key=products/1729900000000-abcd1234-zapato-deportivo.png&expiresIn=7200 HTTP/1.1
Authorization: Bearer {{token}}
```

**Respuesta exitosa (`200 OK`):**
```json
{
  "key": "products/1729900000000-abcd1234-zapato-deportivo.png",
  "url": "https://br-restless-thunder-b42qdkhg.storage.c-6.us-east-2.aws.neon.tech/uploads/products/1729900000000-abcd1234-zapato-deportivo.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&...",
  "expiresIn": 7200
}
```

### 3. Redirección Directa para Etiquetas HTML (`GET /storage/view?key=...`)

**Petición:**
```http
GET /storage/view?key=products/1729900000000-abcd1234-zapato-deportivo.png HTTP/1.1
Authorization: Bearer {{token}}
```

**Respuesta HTTP:**
```http
HTTP/1.1 302 Found
Location: https://br-restless-thunder-b42qdkhg.storage.c-6.us-east-2.aws.neon.tech/uploads/products/1729900000000-abcd1234-zapato-deportivo.png?X-Amz-Algorithm=...
```

---

## 🔐 Permisos y Roles (IAM)

Las siguientes acciones quedan controladas por el sistema RBAC del seeder:

| Recurso | Acción | Descripción | Rol Asignado |
| :--- | :--- | :--- | :--- |
| `storage` | `read` | Generar URLs firmadas y visualizar archivos | `ADMIN_ROLE`, `USER_ROLE` |
| `storage` | `upload` | Subir archivos a cualquier carpeta del bucket | `ADMIN_ROLE` |
| `storage` | `manage` | Eliminar objetos del bucket de Neon | `ADMIN_ROLE` |

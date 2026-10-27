# Ministore ERP — Full-Stack Monorepo

Sistema integral de gestión empresarial (**ERP**) moderno, modular y seguro, construido bajo estándares de arquitectura limpia (**Clean Architecture / Hexagonal DDD**) en el backend y diseño modular por dominios (**Feature-Sliced Design**) en el frontend.

---

## 🏛️ 1. Arquitectura General del Monorepo

```
ministore/
├── backend/                  # API REST con NestJS y TypeORM
│   ├── src/                  # Código fuente modular por dominios (IAM, Catalog, Sales, etc.)
│   ├── docs/                 # Documentación técnica completa (ERD, flujos, Postman)
│   ├── uploads/              # Almacenamiento local de adjuntos, avatares y logos
│   ├── Dockerfile            # Construcción multi-stage de producción
│   └── .env.example          # Plantilla de variables de entorno del backend
│
├── frontend/                 # Aplicación SPA con React 19, Vite y Tailwind CSS v4
│   ├── src/
│   │   ├── features/         # Módulos de negocio aislados (Feature-Sliced Design)
│   │   ├── shared/           # Design System (@/shared/components/ui) y stores globales
│   │   └── lib/              # ApiClient centralizado con manejo 401/403
│   ├── docs/                 # Documentación técnica de arquitectura y diseño frontend
│   ├── Dockerfile            # Construcción estática y servidor Nginx alpine
│   ├── nginx.conf            # Configuración Nginx con fallback SPA y compresión gzip
│   └── .env.example          # Plantilla de variables de entorno del frontend
│
├── docker-compose.yml        # Orquestación de contenedores (Postgres 16, API y Web)
├── package.json              # Scripts orquestadores del monorepo
├── .gitignore                # Reglas estrictas contra filtrado de credenciales y builds
└── .env.example              # Plantilla de variables para Docker Compose
```

---

## 💻 2. Stack Tecnológico

| Capa | Tecnologías Principales |
| :--- | :--- |
| **Backend** | NestJS 11, TypeScript, TypeORM, PostgreSQL 16, CQRS, Passport JWT (RS256 Asimétrico), Helmet, Swagger UI, Class-Validator |
| **Frontend** | React 19, TypeScript, Vite 8, Tailwind CSS v4, TanStack React Query v5, Zustand, React Hook Form, Zod, Lucide Icons |
| **Infraestructura** | Docker, Docker Compose, Nginx Alpine, Multi-stage builds |

---

## 🚀 3. Guía de Inicio Rápido

### Prerrequisitos
* **Node.js**: v20.x o superior
* **npm**: v10.x o superior
* **PostgreSQL**: v15 o v16 (o **Docker** / **Docker Desktop**)

---

### Opción A: Ejecución Local (Desarrollo)

1. **Clonar e instalar dependencias:**
   ```bash
   # Instala dependencias en backend y frontend
   npm run install:all
   ```

2. **Configurar variables de entorno:**
   * **Backend:** Copia [`backend/.env.example`](file:///c:/Projects/NODE/ministore/backend/.env.example) a `backend/.env`.
     ```bash
     cp backend/.env.example backend/.env
     ```
     *Genera el par de claves RSA 2048 requeridas para la autenticación asimétrica JWT:*
     ```bash
     cd backend && node generate-env.js && cd ..
     ```
     *Asegúrate de configurar las credenciales de tu base de datos PostgreSQL local en `backend/.env`.*

   * **Frontend:** Copia [`frontend/.env.example`](file:///c:/Projects/NODE/ministore/frontend/.env.example) a `frontend/.env`.
     ```bash
     cp frontend/.env.example frontend/.env
     ```

3. **Ejecutar migraciones y datos iniciales (Seed):**
   ```bash
   npm run backend:migration:run
   npm run backend:seed
   ```

4. **Levantar ambos servicios en paralelo:**
   ```bash
   npm run dev
   ```
   * **Frontend:** `http://localhost:5173`
   * **Backend API:** `http://localhost:3000`
   * **Documentación Swagger:** `http://localhost:3000/docs`

---

### Opción B: Ejecución con Docker Compose (Producción / Staging)

1. **Configurar el entorno raíz:**
   ```bash
   cp .env.example .env
   ```
   *Ajusta las claves `JWT_PRIVATE_KEY` y `JWT_PUBLIC_KEY` generadas previamente.*

2. **Construir y levantar contenedores:**
   ```bash
   docker-compose up -d --build
   ```
   Esto levantará automáticamente:
   * **Base de datos:** `ministore-postgres` (PostgreSQL 16 en el puerto `5432` con volumen persistente).
   * **Backend API:** `ministore-backend` (NestJS en el puerto `3000`).
   * **Frontend Web:** `ministore-frontend` (Nginx sirviendo el build de React en el puerto `80`).

3. **Ver logs de los servicios:**
   ```bash
   npm run docker:logs
   ```

---

## 📜 4. Scripts del Monorepo

| Comando | Acción |
| :--- | :--- |
| `npm run dev` | Inicia backend y frontend simultáneamente en modo desarrollo con prefijos de color. |
| `npm run dev:backend` | Inicia únicamente el backend con Nest watch mode (`start:dev`). |
| `npm run dev:frontend` | Inicia únicamente el frontend con el servidor de desarrollo Vite (`dev`). |
| `npm run build` | Compila ambos proyectos para producción (`dist/`). |
| `npm run lint` | Ejecuta ESLint en el backend y Oxlint en el frontend. |
| `npm run backend:migration:run` | Ejecuta las migraciones pendientes en PostgreSQL. |
| `npm run backend:seed` | Puebla la base de datos con roles, usuario administrador y datos maestros. |
| `npm run docker:up` | Levanta el stack completo de Docker en segundo plano. |
| `npm run docker:down` | Detiene y remueve los contenedores de Docker. |

---

## 📚 5. Documentación Técnica Detallada

El proyecto cuenta con documentación exhaustiva y categorizada para cada subsistema:

### ⚙️ Documentación del Backend (`backend/docs/`)
Cada módulo incluye su modelo entidad-relación (**ERD**), diagrama de secuencia (**Mermaid**), casos de uso prácticos y colección **Postman** lista para importar:
* 🔐 [IAM (Identidad, Usuarios y Roles)](file:///c:/Projects/NODE/ministore/backend/docs/iam/README.md)
* 🏢 [Company (Datos Fiscales, Divisa y SMTP)](file:///c:/Projects/NODE/ministore/backend/docs/company/README.md)
* 📦 [Catalog (Productos, Recetas BOM y Categorías)](file:///c:/Projects/NODE/ministore/backend/docs/catalog/README.md)
* 🏭 [Inventory (Almacenes, Existencias y Kardex)](file:///c:/Projects/NODE/ministore/backend/docs/inventory/README.md)
* 🛒 [Purchases (Órdenes de Compra y Recepción)](file:///c:/Projects/NODE/ministore/backend/docs/purchases/README.md)
* 💰 [Sales (Cotizaciones, Ventas a Crédito y Pagos)](file:///c:/Projects/NODE/ministore/backend/docs/sales/README.md)
* 🕵️ [Audit (Trazabilidad y Log Forense)](file:///c:/Projects/NODE/ministore/backend/docs/audit/README.md)

### 🎨 Documentación del Frontend (`frontend/docs/`)
* 🧭 [Índice Maestro Frontend](file:///c:/Projects/NODE/ministore/frontend/docs/README.md)
* 🏛️ [Arquitectura y Triple-Hook Pattern](file:///c:/Projects/NODE/ministore/frontend/docs/architecture.md)
* 🖌️ [Sistema de Diseño y Componentes UI](file:///c:/Projects/NODE/ministore/frontend/docs/design-system.md)
* 🔑 [Autenticación JWT, RBAC y Rutas Protegidas](file:///c:/Projects/NODE/ministore/frontend/docs/auth-and-routing.md)
* ⚡ [Integración ApiClient y TanStack React Query v5](file:///c:/Projects/NODE/ministore/frontend/docs/api-and-state.md)

---

## 🔒 6. Medidas de Seguridad y Buenas Prácticas Aplicadas

1. **Cero Secretos en el Repositorio:** Todos los archivos `.env`, `.env.*` y credenciales privadas están completamente ignorados por [`.gitignore`](file:///c:/Projects/NODE/ministore/.gitignore).
2. **Firmado Asimétrico RS256:** El backend utiliza pares de claves RSA (pública/privada) para la firma y verificación de tokens JWT.
3. **Cabeceras HTTP Seguras:** Integración de **Helmet** en NestJS y cabeceras estrictas de seguridad (`X-Frame-Options`, `X-Content-Type-Options`) en Nginx.
4. **CORS Dinámico:** Restricción estricta de orígenes configurables vía variable de entorno `CORS_ORIGIN`.
5. **Auditoría Forense Automática:** Todas las mutaciones críticas registran automáticamente `userId`, `ipAddress`, acción y *snapshots* del estado antes y después en la tabla de auditoría.
6. **Manejo Centralizado de Expiración:** `ApiClient` detecta respuestas HTTP 401 y purga inmediatamente las sesiones expiradas en el cliente, redirigiendo al usuario a `/login`.

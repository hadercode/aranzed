# Aranzed - Software de Gestión — Frontend

Frontend del sistema **Aranzed - Software de Gestión**, construido con **React 19**, **TypeScript**, **Tailwind CSS v4** y **Vite**. Implementa una arquitectura modular por dominios de negocio, gestión de estado con Zustand y React Context, validaciones estrictas con Zod y React Hook Form, y consumo reactivo mediante TanStack React Query.

---

## 🛠️ Tecnologías Principales

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **Estilos**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Enrutamiento**: [React Router DOM v7](https://reactrouter.com/)
- **Estado Global**: [Zustand](https://zustand-demo.pmnd.rs/) (Persistencia de Auth y Feedback de UI)
- **Consultas & Mutaciones**: [TanStack Query v5](https://tanstack.com/query)
- **Formularios & Validación**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Iconografía**: [Lucide React](https://lucide.dev/)
- **Linter**: [Oxlint](https://oxc.rs/)

---

## 📂 Módulos de la Aplicación

- **IAM & Seguridad**: Autenticación JWT RS256, gestión de usuarios, roles, permisos granulares y perfil de usuario con avatar.
- **Ventas**: Cotizaciones, facturación, conversión de presupuestos, pagos y comprobantes digitales, exportación PDF/Excel.
- **Compras**: Órdenes de compra de materias primas con soporte multimoneda y actualización de costos promedio.
- **Inventario**: Almacenes, transacciones (entradas/salidas/ajustes), control de stock por almacén y motivos parametrizables.
- **Catálogo**: Productos simples y compuestos, recetas/BOM, categorías y unidades de medida.
- **Empresa**: Configuración de datos fiscales, imagen institucional (logos) y parámetros regionales/monetarios.
- **Auditoría**: Trazabilidad completa de operaciones del sistema con snapshots diferenciales y sanitización de datos sensibles.

---

## ⚙️ Configuración de Entorno

Crea un archivo `.env` o `.env.local` en la raíz de `frontend/` a partir de la plantilla:

```bash
cp .env.example .env
```

### Variables disponibles:

| Variable       | Descripción                                | Valor por Defecto       |
| :------------- | :----------------------------------------- | :---------------------- |
| `VITE_API_URL` | URL base pública del API Backend de NestJS | `http://localhost:3000` |

---

## 🚀 Scripts Disponibles

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo con Hot Module Replacement (HMR)
npm run dev

# Compilar para producción (TypeScript + Minificación Vite)
npm run build

# Analizar código con Oxlint
npm run lint

# Previsualizar el bundle de producción localmente
npm run preview
```

---

## 📦 Despliegue en Producción

Al compilar el proyecto con `npm run build`, se generarán los activos optimizados en la carpeta `dist/`.

> [!IMPORTANT]
> Al tratarse de una Single Page Application (SPA) con enrutamiento del lado del cliente (`react-router-dom`), el servidor web (Nginx, Apache, Vercel, Netlify) debe redirigir todas las rutas al archivo `index.html`.
>
> **Ejemplo de configuración en Nginx**:
>
> ```nginx
> location / {
>     try_files $uri $uri/ /index.html;
> }
> ```

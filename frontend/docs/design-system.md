# Sistema de Diseño y Componentes UI — Ministore ERP

Este documento detalla las directrices visuales, tokens de estilos y el catálogo de componentes compartidos (`@/shared/components/ui`) del frontend. El objetivo es garantizar una estética moderna, limpia y consistente en toda la plataforma.

---

## 🎨 1. Tokens de Color y Variables CSS

La interfaz utiliza variables CSS combinadas con Tailwind CSS v4 para admitir consistencia cromática, transiciones suaves y personalización:

### Superficies y Fondos
- **Fondo de Aplicación (`--color-surface-bg`)**: `#F8FAFC` (Gris frío muy claro y limpio).
- **Tarjetas y Superficies (`--color-surface-card`)**: `#FFFFFF` (Blanco puro con sombra sutil).
- **Hover de Superficie (`--color-surface-hover`)**: `#F1F5F9` (Gris suave para filas y botones secundarios).
- **Bordes (`--color-border`)**: `#E2E8F0` (Delimitación sutil sin sobrecargar la vista).

### Tipografía y Textos
- **Texto Primario (`--color-text-primary`)**: `#0F172A` (Slate 900, máximo contraste y legibilidad).
- **Texto Secundario (`--color-text-secondary`)**: `#475569` (Slate 600, etiquetas y subtítulos).
- **Texto Muted (`--color-text-muted`)**: `#94A3B8` (Slate 400, placeholders y fechas auxiliares).

### Semántica de Estados
- **Verde Salvia / Esmeralda (`var(--color-sage-*)` / Emerald)**: Operaciones exitosas, estados activos, transacciones de entrada.
- **Azul / Cian (Blue)**: Enlaces, cotizaciones, información de auditoría y actualizaciones.
- **Ámbar / Naranja (Amber)**: Advertencias de stock bajo, pedidos en borrador y vencimientos próximos.
- **Rojo / Rosa (Rose / Danger)**: Cancelaciones, eliminaciones, stock crítico y errores de validación.

---

## 🧩 2. Catálogo de Componentes Compartidos (`@/shared/components/ui`)

### 1. `Button` (`Button.tsx`)
Botón multifuncional con soporte para estados de carga y ranuras de iconos:
- **Variantes**: `primary`, `secondary`, `outline`, `danger`.
- **Tamaños**: `sm` (px-3 py-1.5 text-xs), `md` (px-4 py-2 text-sm), `lg` (px-5 py-2.5 text-base).
- **Propiedades Clave**: `loading` (muestra spinner animado y deshabilita clics), `leftIcon`, `rightIcon`.

### 2. `PageHeader` (`PageHeader.tsx`)
Encabezado estándar de cada pantalla con soporte para título, subtítulo explicativo, icono temático y botones de acción a la derecha.

### 3. `StatCard` (`StatCard.tsx`)
Tarjeta de métrica ejecutiva (KPI). Muestra valor principal destacado, título descriptivo, icono en contenedor coloreado y badge porcentual de tendencia o variación.

### 4. `Table` y `StaticTable`
- **`Table.tsx`**: Envoltorio accesible con clases preconfiguradas para bordes limpios, cabeceras fijas (`thead`), filas con efecto hover interactivo y vista vacía (*Empty State*).
- **`StaticTable.tsx`**: Especializada para tablas compactas en formularios (como renglones de materias primas o desglose de pagos).

### 5. `StickyBar` (`StickyBar.tsx`)
Barra de acción flotante adherida al fondo de la pantalla (`fixed bottom-0 left-0 right-0 z-40 backdrop-blur-md bg-white/90 border-t`):
- Muestra el nombre o código del registro en edición.
- Ofrece botones principales siempre visibles de **Cancelar** y **Guardar Cambios**, mejorando la ergonomía en formularios largos sin obligar a scrollear hasta arriba.

### 6. `ConfirmDialog` y `SuccessDialog`
- **`ConfirmDialog`**: Diálogo modal bloqueante con advertencia en rojo/ámbar para confirmar eliminaciones irreversibles o cancelaciones de documentos.
- **`SuccessDialog`**: Modal con animación de verificación verde que confirma la mutación y auto-cierra con redirección programada tras 2.5 segundos.

### 7. Componentes de Formulario (`form/`)
- **`Input`**: Campo de texto estilizado con soporte de iconos izquierdo/derecho, etiquetas flotantes y renderizado automático de mensajes de error de Zod.
- **`Select`**: Dropdown accesible con estilo nativo pulido y estados de foco `ring-2`.

---

## 📐 3. Reglas de Experiencia de Usuario (UX)

1. **Sin Modales para Formularios Extensos**: Si una entidad requiere más de 4 campos o incluye tablas hijas, **siempre** se utiliza una página completa (`/new` y `/:id/edit`), nunca una ventana modal que apretuja los datos.
2. **Feedback Inmediato**: Todo botón de envío debe activar `loading={isSubmitting}` para evitar envíos duplicados por doble clic.
3. **Animaciones Suaves**: Las páginas cargan con clases de entrada suave: `animate-in fade-in duration-300`.

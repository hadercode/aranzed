# Diseño de Interfaz: Panel Administrativo IAM

Aquí tienes el concepto visual que he generado para nuestro panel administrativo. Nos alejaremos de los típicos diseños "genéricos" usando una paleta limpia, mucho espacio en blanco, tipografía moderna y un verde salvia (sage green) como acento de elegancia.

![Concepto de Diseño UI](C:\Users\hbullon\.gemini\antigravity-ide\brain\7e633c0c-3d86-44da-a51e-fdbcea7e1aa9\admin_dashboard_concept_1791562430736.jpg)

## 🎨 Sistema de Diseño (Tailwind Tokens)

Para lograr este aspecto, configuraremos Tailwind con los siguientes tokens de diseño:

### 1. Paleta de Colores Monocromática + Acento
- **Backgrounds:** `#FAFAFA` (Un gris extremadamente sutil casi blanco para el fondo principal).
- **Cards/Superficies:** `#FFFFFF` (Blanco puro con sombras orgánicas).
- **Texto Principal:** `#1F2937` (Gris oscuro elegante, más suave que el negro puro).
- **Texto Secundario:** `#6B7280` (Para métricas, subtítulos y breadcrumbs).
- **Color de Acento (Sage Green):** `#789382` (Utilizado para gráficas, botones primarios y estados activos).
- **Acento Suave:** `#E5EBE7` (Para fondos de badges o elementos seleccionados).

### 2. Tipografía (Google Fonts)
Usaremos la fuente **"Inter"** o **"Outfit"** para una legibilidad perfecta y un aspecto geométrico moderno. Los encabezados tendrán un peso `semibold` y los textos secundarios `medium`.

### 3. Sombras y Efectos (Glassmorphism)
- **Soft Shadow:** Sombras muy difuminadas (`box-shadow: 0 10px 40px -10px rgba(0,0,0,0.03)`).
- **Micro-Glassmorphism:** Navbars laterales con un leve grado de opacidad y `backdrop-blur`.

### 4. Estructura (Layout)
- **Sidebar Izquierdo:** Minimalista, sin bordes fuertes, separación visual puramente mediante espacios.
- **Tarjetas de Datos (Cards):** Bordes ligeramente redondeados (`rounded-2xl`) con padding extenso (`p-6` o `p-8`) para mantener el diseño respirable.

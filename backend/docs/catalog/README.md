# Módulo de Catálogo y Recetas (Catalog) — Documentación

Este directorio contiene la documentación técnica y funcional del módulo de **Catálogo** de **Ministore ERP**. 

El módulo gestiona el maestro de artículos (productos simples y compuestos), recetas industriales / listas de materiales (BOM), categorías jerárquicas y unidades de medida estandarizadas.

---

## 🗂 Índice de Documentos

1. **[Diagrama de Base de Datos (ERD)](./erd-diagram.md):** Modelo relacional de Categorías, Unidades de Medida, Productos y Recetas (BOM).
2. **[Diagrama de Flujo](./flow-diagram.md):** Flujos de cálculo de costo unitario compuesto (BOM) y ciclo de vida de productos.
3. **[Casos de Uso Práctico](./use-cases.md):** Ejemplos completos de creación de insumos, formulación de recetas y fijación de precios.
4. **[Colección de Postman](./catalog.postman_collection.json):** Colección exhaustiva con endpoints de Categorías, UOFM, Productos y Recetas.

---

## 🏛️ Conceptos y Reglas de Negocio

### 1. Tipos de Productos (`ProductType`)
- **`SIMPLE` (Insumos / Materias Primas / Mercancías Directas)**: Artículos adquiridos mediante órdenes de compra, controlados por stock físico y sin desglose de recetas.
- **`COMPOUND` (Productos Manufacturados / Elaborados / Kits)**: Artículos finales que requieren una **Receta (BOM)** con componentes de insumos simples para determinar su costo de producción acumulado.

### 2. Recetas y Cálculo de Costos (BOM - Bill of Materials)
- Una receta define la relación de materias primas necesarias para producir una cantidad específica (`yieldQuantity`).
- El costo unitario sugerido de un producto compuesto se calcula sumando el costo de cada renglón:
  $$\text{Costo Total Receta} = \sum (\text{quantity}_i \times \text{unitCost}_i)$$
  $$\text{Costo Unitario Producto} = \frac{\text{Costo Total Receta}}{\text{yieldQuantity}}$$

### 3. Unidades de Medida y Categorización
- Cada producto se asocia obligatoriamente a una Unidad de Medida (`unitOfMeasureId`) y opcionalmente a una Categoría (`categoryId`).
- Soporta SKU único y código de barras (`barcode`) para integración con lectores POS.

---

## 📡 Endpoints del Módulo

| Módulo | Método | Endpoint | Permiso Requerido | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| **Categorías** | `GET` | `/catalog/categories` | `products:read` | Listado de categorías activas con filtros. |
| **Categorías** | `POST` | `/catalog/categories` | `products:manage` | Crea una nueva categoría. |
| **Categorías** | `PUT` | `/catalog/categories/:id` | `products:manage` | Actualiza nombre o código de categoría. |
| **Categorías** | `DELETE`| `/catalog/categories/:id` | `products:manage` | Elimina lógicamente una categoría. |
| **UOFM** | `GET` | `/catalog/uofm` | `products:read` | Listado de unidades de medida (kg, lt, pza). |
| **UOFM** | `POST` | `/catalog/uofm` | `products:manage` | Registra una nueva unidad de medida. |
| **Productos** | `GET` | `/catalog/products` | `products:read` | Consulta filtrada (búsqueda, tipo, categoría, activos). |
| **Productos** | `GET` | `/catalog/products/:id` | `products:read` | Obtiene el detalle completo del producto. |
| **Productos** | `POST` | `/catalog/products` | `products:manage` | Registra producto (Simple o Compuesto). |
| **Productos** | `PUT` | `/catalog/products/:id` | `products:manage` | Modifica precios, stock mínimo/máximo y datos. |
| **Productos** | `DELETE`| `/catalog/products/:id` | `products:manage` | Desactiva o elimina un producto. |
| **Recetas** | `GET` | `/catalog/recipes` | `products:read` | Listado maestro de recetas de producción. |
| **Recetas** | `GET` | `/catalog/recipes/by-product/:id` | `products:read` | Consulta la receta asociada a un producto final. |
| **Recetas** | `POST` | `/catalog/recipes` | `products:manage` | Crea una receta con renglones de materias primas. |
| **Recetas** | `PUT` | `/catalog/recipes/:id` | `products:manage` | Actualiza insumos, cantidades y rendimiento. |

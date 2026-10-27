# Diagrama de Base de Datos (ERD) — Módulo Catalog

A continuación se presenta el modelo relacional que soporta el catálogo de productos simples y recetas estructuradas (BOM) en PostgreSQL.

```mermaid
erDiagram
    CATEGORIES {
        uuid id PK "Identificador único"
        varchar name "Nombre de categoría (ej: Lácteos, Granos)"
        varchar code UK "Código nemotécnico (ej: CAT-LAC)"
        varchar description "Descripción general"
        boolean isActive "Estado de activación"
        timestamp createdAt "Fecha de creación"
        timestamp updatedAt "Fecha de actualización"
    }

    UNITS_OF_MEASURE {
        uuid id PK "Identificador único"
        varchar name "Nombre completo (ej: Kilogramo, Litro)"
        varchar code UK "Código de unidad (ej: KG, LT, UND)"
        varchar symbol "Símbolo gráfico (ej: kg, L, pza)"
        varchar description "Descripción"
        boolean isActive "Estado"
        timestamp createdAt "Fecha de creación"
        timestamp updatedAt "Fecha de actualización"
    }

    PRODUCTS {
        uuid id PK "Identificador único"
        varchar name "Nombre comercial del producto"
        varchar sku UK "Código de referencia interno"
        varchar barcode "Código de barras EAN/UPC (Nullable)"
        varchar description "Descripción detallada"
        varchar type "Tipo de producto: SIMPLE | COMPOUND"
        uuid categoryId FK "Categoría asignada"
        uuid unitOfMeasureId FK "Unidad de medida base"
        decimal costPrice "Costo unitario o calculado (10,4)"
        decimal salePrice "Precio de venta al público (10,4)"
        decimal minStock "Stock de alerta mínima"
        decimal maxStock "Stock máximo de capacidad"
        boolean manageInventory "Indica si descuenta stock físico"
        boolean isActive "Estado activo"
        varchar imageUrl "Ruta a la imagen del producto"
        timestamp createdAt "Fecha de creación"
        timestamp updatedAt "Fecha de actualización"
    }

    RECIPES {
        uuid id PK "Identificador único"
        uuid productId FK "Producto compuesto al que pertenece (1:1)"
        text instructions "Instrucciones de preparación o manufactura"
        decimal yieldQuantity "Rendimiento producido (ej: 10 unidades)"
        timestamp createdAt "Fecha de creación"
        timestamp updatedAt "Fecha de actualización"
    }

    RECIPE_ITEMS {
        uuid id PK "Identificador único de renglón"
        uuid recipeId FK "Receta a la que pertenece"
        uuid componentProductId FK "Producto insumo (SIMPLE)"
        uuid unitOfMeasureId FK "Unidad de medida del insumo"
        decimal quantity "Cantidad requerida para el rendimiento"
        decimal unitCost "Costo del insumo al momento del cálculo"
        decimal totalCost "Subtotal (quantity * unitCost)"
    }

    CATEGORIES ||--o{ PRODUCTS : "clasifica a"
    UNITS_OF_MEASURE ||--o{ PRODUCTS : "mide a"
    UNITS_OF_MEASURE ||--o{ RECIPE_ITEMS : "unidad de insumo"
    
    PRODUCTS ||--o| RECIPES : "define manufactura de"
    RECIPES ||--|{ RECIPE_ITEMS : "compuesta por"
    PRODUCTS ||--o{ RECIPE_ITEMS : "utilizado como insumo"
```

---

## 🔗 Relaciones y Cardinalidades Clave

1. **`categories` ↔ `products` (1:N)**: Un producto pertenece a una categoría, permitiendo agrupaciones por familias de productos.
2. **`units_of_measure` ↔ `products` (1:N)**: Cada producto cuenta con una unidad de medida estándar obligatoria para transacciones y compras.
3. **`products` ↔ `recipes` (1:1)**: Un producto compuesto (`type = 'COMPOUND'`) tiene exactamente una receta activa que describe su fórmula de fabricación.
4. **`recipes` ↔ `recipe_items` (1:N)**: La receta contiene múltiples renglones de materias primas que enlazan a productos simples (`componentProductId`), totalizando los costos de ensamble.

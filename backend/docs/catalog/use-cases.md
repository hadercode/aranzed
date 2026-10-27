# Casos de Uso Práctico — Módulo Catalog

Escenarios paso a paso para la parametrización de catálogos maestros, productos de materias primas y productos manufacturados con receta.

---

## 📌 Caso de Uso 1: Crear Unidades de Medida y Categorías Base

### Paso 1: Crear Unidad de Medida (Kilogramo)
- **Método y Ruta**: `POST /catalog/uofm`
- **Cabeceras**: `Authorization: Bearer {{token}}`
- **Cuerpo (Payload)**:
  ```json
  {
    "name": "Kilogramo",
    "code": "KG",
    "symbol": "kg",
    "description": "Unidad de masa para materias primas pesables"
  }
  ```
- **Respuesta (`201 Created`)**:
  ```json
  {
    "id": "e0a12345-1234-4567-89ab-cdef01234567",
    "name": "Kilogramo",
    "code": "KG",
    "symbol": "kg",
    "isActive": true
  }
  ```

### Paso 2: Crear Categoría (Panadería y Repostería)
- **Método y Ruta**: `POST /catalog/categories`
- **Cuerpo (Payload)**:
  ```json
  {
    "name": "Panadería Dulce",
    "code": "CAT-PAN-DULCE",
    "description": "Productos horneados de repostería y panes dulces"
  }
  ```

---

## 📌 Caso de Uso 2: Crear Insumos Simples (Materias Primas)

### Descripción
Registrar los insumos básicos necesarios para el proceso productivo con su costo de adquisición.

### Paso 1: Insumo Harina
- **Método y Ruta**: `POST /catalog/products`
- **Cuerpo**:
  ```json
  {
    "name": "Harina de Trigo Especial",
    "sku": "INS-HAR-01",
    "barcode": "7701234567890",
    "description": "Saco de harina para panificación",
    "type": "SIMPLE",
    "categoryId": "c1a11111-2222-3333-4444-555555555555",
    "unitOfMeasureId": "e0a12345-1234-4567-89ab-cdef01234567",
    "costPrice": 1.25,
    "salePrice": 0.00,
    "minStock": 50,
    "maxStock": 500,
    "manageInventory": true
  }
  ```

### Paso 2: Insumo Azúcar
- **Método y Ruta**: `POST /catalog/products`
- **Cuerpo**:
  ```json
  {
    "name": "Azúcar Refinada",
    "sku": "INS-AZU-01",
    "type": "SIMPLE",
    "unitOfMeasureId": "e0a12345-1234-4567-89ab-cdef01234567",
    "costPrice": 0.90,
    "salePrice": 0.00,
    "minStock": 20,
    "maxStock": 200,
    "manageInventory": true
  }
  ```

---

## 📌 Caso de Uso 3: Crear Producto Compuesto y su Receta de Fabricación (BOM)

### Paso 1: Registrar el Producto Final (Compuesto)
- **Método y Ruta**: `POST /catalog/products`
- **Cuerpo**:
  ```json
  {
    "name": "Croissant de Mantequilla (Pack x10)",
    "sku": "PROD-CROISS-10",
    "type": "COMPOUND",
    "categoryId": "c1a11111-2222-3333-4444-555555555555",
    "unitOfMeasureId": "u0000000-0000-0000-0000-000000000001",
    "costPrice": 0.00,
    "salePrice": 12.50,
    "minStock": 5,
    "maxStock": 50,
    "manageInventory": true
  }
  ```
  *(Se genera el producto con `id = "p-croiss-uuid"`).*

### Paso 2: Formular la Receta
- **Método y Ruta**: `POST /catalog/recipes`
- **Cuerpo**:
  ```json
  {
    "productId": "p-croiss-uuid",
    "instructions": "1. Mezclar harina con azúcar y mantequilla fría. 2. Reposar 2 horas. 3. Hornear a 180°C por 20 min.",
    "yieldQuantity": 1,
    "items": [
      {
        "componentProductId": "ins-har-uuid",
        "unitOfMeasureId": "e0a12345-1234-4567-89ab-cdef01234567",
        "quantity": 1.5,
        "unitCost": 1.25,
        "totalCost": 1.875
      },
      {
        "componentProductId": "ins-azu-uuid",
        "unitOfMeasureId": "e0a12345-1234-4567-89ab-cdef01234567",
        "quantity": 0.3,
        "unitCost": 0.90,
        "totalCost": 0.270
      }
    ]
  }
  ```
- **Resultado en Base de Datos**:
  El producto `p-croiss-uuid` ahora tiene un `costPrice = 2.145` calculado automáticamente. El margen de ganancia respecto al `salePrice = 12.50` queda inmediatamente establecido en más del 82%.

# Casos de Uso Prácticos — Módulo de Almacenamiento (Storage)

Este documento presenta ejemplos y patrones de implementación para aprovechar el módulo de **Storage** en los distintos módulos del ecosistema **Ministore ERP**.

---

## 📦 Caso de Uso 1: Imágenes de Productos en Catálogo

### Escenario
Al crear o editar un producto en el catálogo (ej: `ProductFormPage`), el usuario selecciona una fotografía del producto. El frontend sube la imagen al endpoint de storage con `folder="products"`. El backend retorna la clave única (`key`), la cual se persiste en el campo `imageUrl` de la tabla de productos.

### Petición HTTP Frontend
```typescript
const formData = new FormData();
formData.append('file', selectedImageFile);
formData.append('folder', 'products');

const response = await api.post('/storage/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});

// Guardamos la clave retornada en el producto
const productPayload = {
  name: 'Café Espresso 500g',
  sku: 'CAF-ESP-001',
  imageUrl: response.data.key, // ej: "products/17299000-abcd-cafe.png"
  salePrice: 12.50,
};

await api.post('/catalog/products', productPayload);
```

### Visualización en la Tabla o Ficha del Producto
En cualquier componente de React, para renderizar la imagen sin exponer credenciales:
```tsx
<img 
  src={`/api/storage/view?key=${product.imageUrl}`} 
  alt={product.name} 
  className="w-16 h-16 object-cover rounded-xl shadow-sm"
/>
```

---

## 🏢 Caso de Uso 2: Logotipo Corporativo de la Empresa

### Escenario
La configuración de empresa (`/company`) requiere almacenar el logotipo oficial para membretes de presupuestos y facturas en PDF.

### Petición HTTP
```http
POST /storage/upload HTTP/1.1
Host: localhost:3000
Authorization: Bearer {{token}}
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW

------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="file"; filename="nexus-logo.png"
Content-Type: image/png

<binary data>
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="folder"

company
------WebKitFormBoundary7MA4YWxkTrZu0gW--
```

### Respuesta del Servidor
```json
{
  "key": "company/17299000-88af-nexus-logo.png",
  "bucket": "uploads",
  "folder": "company",
  "originalName": "nexus-logo.png",
  "mimeType": "image/png",
  "size": 18450,
  "url": "https://br-restless-thunder-b42qdkhg.storage.c-6.us-east-2.aws.neon.tech/uploads/company/17299000-88af-nexus-logo.png?...",
  "createdAt": "2026-10-27T19:50:00.000Z"
}
```

---

## 🧾 Caso de Uso 3: Facturas y Comprobantes Fiscales (`invoices`)

### Escenario
Al registrar una compra de materiales (`/purchases`), el operador adjunta el PDF escaneado de la factura emitida por el proveedor. Los documentos son sensibles y no deben tener acceso público sin autenticación.

### Flujo de Subida
1. El usuario sube el PDF indicando `folder: 'invoices'`.
2. El archivo se ubica bajo `uploads/invoices/<timestamp>-<id>-factura.pdf`.
3. El ID o Key se guarda en la compra (`purchase.documentKey`).

### Flujo de Descarga Segura
Cuando el contador audita la compra, solicita una URL firmada con validez de 15 minutos (900 segundos):

```http
GET /storage/url?key=invoices/17299000-factura-00123.pdf&expiresIn=900 HTTP/1.1
Authorization: Bearer {{token}}
```

**Respuesta:**
```json
{
  "key": "invoices/17299000-factura-00123.pdf",
  "url": "https://...storage.neon.tech/...X-Amz-Expires=900...",
  "expiresIn": 900
}
```
El contador descarga el documento directamente desde los servidores de Neon de forma cifrada y con expiración automática.

---

## 👤 Caso de Uso 4: Avatares de Usuarios (`avatars`)

### Escenario
Los usuarios pueden personalizar su perfil cargando su foto de perfil.

```typescript
const uploadAvatar = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', 'avatars');

  const { data } = await api.post('/storage/upload', formData);
  return data.key; // ej: "avatars/17299000-foto.jpg"
};
```

---

## 💡 Inyección Interna en Servicios de NestJS

Si otro módulo del backend necesita generar reportes en PDF y subirlos automáticamente al storage sin pasar por la capa HTTP:

```typescript
import { Injectable, Inject } from '@nestjs/common';
import { STORAGE_SERVICE_TOKEN } from '@/storage/domain/services/storage.service.interface';
import type { IStorageService } from '@/storage/domain/services/storage.service.interface';

@Injectable()
export class InvoicePdfGeneratorService {
  constructor(
    @Inject(STORAGE_SERVICE_TOKEN)
    private readonly storageService: IStorageService,
  ) {}

  async generateAndStore(invoiceId: string, pdfBuffer: Buffer): Promise<string> {
    const stored = await this.storageService.uploadFile({
      buffer: pdfBuffer,
      originalName: `factura-${invoiceId}.pdf`,
      mimeType: 'application/pdf',
      size: pdfBuffer.length,
      folder: 'invoices',
    });

    return stored.key;
  }
}
```
